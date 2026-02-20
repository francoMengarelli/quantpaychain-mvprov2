
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * @title DocumentRegistry
 * @dev Smart contract for registering and managing document signatures on blockchain
 * Implements EIP-712 for structured signature verification
 */
contract DocumentRegistry is 
    Initializable, 
    AccessControlUpgradeable, 
    PausableUpgradeable, 
    ReentrancyGuardUpgradeable,
    EIP712
{
    using ECDSA for bytes32;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // EIP-712 Domain
    string private constant SIGNING_DOMAIN = "QuantPayChain";
    string private constant SIGNATURE_VERSION = "1";

    // Document status enum
    enum DocumentStatus {
        Draft,
        Pending,
        Signed,
        Rejected,
        Revoked
    }

    // Document structure
    struct Document {
        string ipfsHash;           // IPFS hash of the document
        string title;              // Document title
        address creator;           // Document creator
        uint256 createdAt;         // Creation timestamp
        uint256 expiresAt;         // Expiration timestamp (0 = never expires)
        DocumentStatus status;     // Current status
        bytes32 documentHash;      // Keccak256 hash of document content
        address[] signers;         // Required signers
        bool isMultiSig;          // Whether document requires multiple signatures
        uint256 requiredSignatures; // Number of signatures required
    }

    // Signature structure
    struct Signature {
        address signer;
        uint256 timestamp;
        bytes signature;
        string ipfsHash;          // IPFS hash of signed document version
        bool isValid;
    }

    // EIP-712 Document signing struct
    struct DocumentSigning {
        bytes32 documentId;
        string ipfsHash;
        address signer;
        uint256 nonce;
        uint256 deadline;
    }

    // State variables
    mapping(bytes32 => Document) public documents;
    mapping(bytes32 => mapping(address => Signature)) public signatures;
    mapping(bytes32 => address[]) public documentSigners;
    mapping(address => uint256) public nonces;
    
    // Additional mappings for querying
    mapping(address => bytes32[]) public userDocuments;
    mapping(address => bytes32[]) public pendingSignatures;

    // Constants
    uint256 public constant MAX_SIGNERS = 50;
    uint256 public constant MIN_EXPIRY_TIME = 1 hours;
    uint256 public constant MAX_EXPIRY_TIME = 365 days;

    // Events
    event DocumentRegistered(
        bytes32 indexed documentId,
        string ipfsHash,
        address indexed creator,
        string title
    );

    event DocumentSigned(
        bytes32 indexed documentId,
        address indexed signer,
        uint256 timestamp,
        string ipfsHash
    );

    event DocumentStatusChanged(
        bytes32 indexed documentId,
        DocumentStatus oldStatus,
        DocumentStatus newStatus
    );

    event SignerAdded(
        bytes32 indexed documentId,
        address indexed signer
    );

    event SignerRemoved(
        bytes32 indexed documentId,
        address indexed signer
    );

    // Modifiers
    modifier documentExists(bytes32 documentId) {
        require(documents[documentId].creator != address(0), "Document does not exist");
        _;
    }

    modifier onlyDocumentCreator(bytes32 documentId) {
        require(documents[documentId].creator == msg.sender, "Only document creator");
        _;
    }

    modifier onlyRequiredSigner(bytes32 documentId) {
        require(isRequiredSigner(documentId, msg.sender), "Not a required signer");
        _;
    }

    modifier documentNotExpired(bytes32 documentId) {
        Document memory doc = documents[documentId];
        require(
            doc.expiresAt == 0 || block.timestamp <= doc.expiresAt,
            "Document has expired"
        );
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        _disableInitializers();
    }

    /**
     * @dev Initialize the contract
     * @param admin Address of the admin
     */
    function initialize(address admin) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
    }

    /**
     * @dev Register a new document
     * @param ipfsHash IPFS hash of the document
     * @param title Document title
     * @param signers Array of required signers
     * @param expiryTime Expiration time in seconds from now (0 = never expires)
     * @param isMultiSig Whether document requires multiple signatures
     * @param requiredSignatures Number of signatures required (only for multi-sig)
     */
    function registerDocument(
        string calldata ipfsHash,
        string calldata title,
        address[] calldata signers,
        uint256 expiryTime,
        bool isMultiSig,
        uint256 requiredSignatures
    ) external whenNotPaused returns (bytes32 documentId) {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(signers.length > 0 && signers.length <= MAX_SIGNERS, "Invalid signers array");
        
        if (expiryTime > 0) {
            require(
                expiryTime >= MIN_EXPIRY_TIME && expiryTime <= MAX_EXPIRY_TIME,
                "Invalid expiry time"
            );
        }

        if (isMultiSig) {
            require(
                requiredSignatures > 0 && requiredSignatures <= signers.length,
                "Invalid required signatures count"
            );
        } else {
            requiredSignatures = signers.length; // All signers required for non-multi-sig
        }

        // Generate unique document ID
        documentId = keccak256(
            abi.encodePacked(
                msg.sender,
                ipfsHash,
                title,
                block.timestamp,
                block.number
            )
        );

        // Create document
        documents[documentId] = Document({
            ipfsHash: ipfsHash,
            title: title,
            creator: msg.sender,
            createdAt: block.timestamp,
            expiresAt: expiryTime > 0 ? block.timestamp + expiryTime : 0,
            status: DocumentStatus.Pending,
            documentHash: keccak256(abi.encodePacked(ipfsHash, title)),
            signers: signers,
            isMultiSig: isMultiSig,
            requiredSignatures: requiredSignatures
        });

        // Update mappings
        userDocuments[msg.sender].push(documentId);
        
        // Add to pending signatures for each signer
        for (uint256 i = 0; i < signers.length; i++) {
            pendingSignatures[signers[i]].push(documentId);
        }

        emit DocumentRegistered(documentId, ipfsHash, msg.sender, title);
        
        return documentId;
    }

    /**
     * @dev Sign a document using EIP-712 structured signature
     * @param documentId Document identifier
     * @param signedIpfsHash IPFS hash of the signed document version
     * @param deadline Signature deadline timestamp
     * @param signature EIP-712 signature
     */
    function signDocumentWithStructuredSignature(
        bytes32 documentId,
        string calldata signedIpfsHash,
        uint256 deadline,
        bytes calldata signature
    ) external 
        whenNotPaused
        documentExists(documentId)
        onlyRequiredSigner(documentId)
        documentNotExpired(documentId)
        nonReentrant
    {
        require(block.timestamp <= deadline, "Signature deadline expired");
        require(!signatures[documentId][msg.sender].isValid, "Already signed");
        
        Document storage doc = documents[documentId];
        require(doc.status == DocumentStatus.Pending, "Document not pending");

        // Verify EIP-712 signature
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("DocumentSigning(bytes32 documentId,string ipfsHash,address signer,uint256 nonce,uint256 deadline)"),
            documentId,
            keccak256(bytes(signedIpfsHash)),
            msg.sender,
            nonces[msg.sender],
            deadline
        )));

        address recoveredSigner = digest.recover(signature);
        require(recoveredSigner == msg.sender, "Invalid signature");

        // Increment nonce to prevent replay attacks
        nonces[msg.sender]++;

        // Record signature
        signatures[documentId][msg.sender] = Signature({
            signer: msg.sender,
            timestamp: block.timestamp,
            signature: signature,
            ipfsHash: signedIpfsHash,
            isValid: true
        });

        documentSigners[documentId].push(msg.sender);

        // Remove from pending signatures
        _removePendingSignature(msg.sender, documentId);

        emit DocumentSigned(documentId, msg.sender, block.timestamp, signedIpfsHash);

        // Check if document is fully signed
        _checkDocumentCompletion(documentId);
    }

    /**
     * @dev Simple signature method without EIP-712 (for basic implementations)
     * @param documentId Document identifier
     * @param signedIpfsHash IPFS hash of the signed document version
     */
    function signDocument(
        bytes32 documentId,
        string calldata signedIpfsHash
    ) external 
        whenNotPaused
        documentExists(documentId)
        onlyRequiredSigner(documentId)
        documentNotExpired(documentId)
        nonReentrant
    {
        require(!signatures[documentId][msg.sender].isValid, "Already signed");
        
        Document storage doc = documents[documentId];
        require(doc.status == DocumentStatus.Pending, "Document not pending");

        // Record simple signature
        signatures[documentId][msg.sender] = Signature({
            signer: msg.sender,
            timestamp: block.timestamp,
            signature: "",
            ipfsHash: signedIpfsHash,
            isValid: true
        });

        documentSigners[documentId].push(msg.sender);

        // Remove from pending signatures
        _removePendingSignature(msg.sender, documentId);

        emit DocumentSigned(documentId, msg.sender, block.timestamp, signedIpfsHash);

        // Check if document is fully signed
        _checkDocumentCompletion(documentId);
    }

    /**
     * @dev Check if document signing is complete and update status
     * @param documentId Document identifier
     */
    function _checkDocumentCompletion(bytes32 documentId) internal {
        Document storage doc = documents[documentId];
        
        uint256 validSignatures = 0;
        for (uint256 i = 0; i < doc.signers.length; i++) {
            if (signatures[documentId][doc.signers[i]].isValid) {
                validSignatures++;
            }
        }

        if (validSignatures >= doc.requiredSignatures) {
            DocumentStatus oldStatus = doc.status;
            doc.status = DocumentStatus.Signed;
            emit DocumentStatusChanged(documentId, oldStatus, DocumentStatus.Signed);
        }
    }

    /**
     * @dev Remove document ID from pending signatures array
     * @param signer Signer address
     * @param documentId Document identifier
     */
    function _removePendingSignature(address signer, bytes32 documentId) internal {
        bytes32[] storage pending = pendingSignatures[signer];
        for (uint256 i = 0; i < pending.length; i++) {
            if (pending[i] == documentId) {
                pending[i] = pending[pending.length - 1];
                pending.pop();
                break;
            }
        }
    }

    /**
     * @dev Check if an address is a required signer for a document
     * @param documentId Document identifier
     * @param signer Address to check
     * @return True if signer is required
     */
    function isRequiredSigner(bytes32 documentId, address signer) public view returns (bool) {
        Document memory doc = documents[documentId];
        for (uint256 i = 0; i < doc.signers.length; i++) {
            if (doc.signers[i] == signer) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get document information
     * @param documentId Document identifier
     * @return Document struct
     */
    function getDocument(bytes32 documentId) external view returns (Document memory) {
        return documents[documentId];
    }

    /**
     * @dev Get signature information
     * @param documentId Document identifier
     * @param signer Signer address
     * @return Signature struct
     */
    function getSignature(bytes32 documentId, address signer) external view returns (Signature memory) {
        return signatures[documentId][signer];
    }

    /**
     * @dev Get all signers for a document
     * @param documentId Document identifier
     * @return Array of signer addresses
     */
    function getDocumentSigners(bytes32 documentId) external view returns (address[] memory) {
        return documentSigners[documentId];
    }

    /**
     * @dev Get user's documents
     * @param user User address
     * @return Array of document IDs
     */
    function getUserDocuments(address user) external view returns (bytes32[] memory) {
        return userDocuments[user];
    }

    /**
     * @dev Get pending signatures for a user
     * @param user User address
     * @return Array of document IDs pending signature
     */
    function getPendingSignatures(address user) external view returns (bytes32[] memory) {
        return pendingSignatures[user];
    }

    /**
     * @dev Revoke a document (only creator)
     * @param documentId Document identifier
     */
    function revokeDocument(bytes32 documentId) 
        external 
        documentExists(documentId) 
        onlyDocumentCreator(documentId) 
    {
        Document storage doc = documents[documentId];
        require(doc.status != DocumentStatus.Revoked, "Document already revoked");
        
        DocumentStatus oldStatus = doc.status;
        doc.status = DocumentStatus.Revoked;
        
        emit DocumentStatusChanged(documentId, oldStatus, DocumentStatus.Revoked);
    }

    /**
     * @dev Emergency pause (only admin)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause (only admin)
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Get EIP-712 domain separator
     * @return Domain separator
     */
    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    /**
     * @dev Get current nonce for address
     * @param user User address
     * @return Current nonce
     */
    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }

    /**
     * @dev Verify document signature status
     * @param documentId Document identifier
     * @return isComplete Whether all required signatures are present
     * @return signatureCount Number of valid signatures
     * @return requiredSignatures Number of required signatures
     */
    function verifyDocumentSignatures(bytes32 documentId) 
        external 
        view 
        documentExists(documentId) 
        returns (bool isComplete, uint256 signatureCount, uint256 requiredSignatures) 
    {
        Document memory doc = documents[documentId];
        
        uint256 validSignatures = 0;
        for (uint256 i = 0; i < doc.signers.length; i++) {
            if (signatures[documentId][doc.signers[i]].isValid) {
                validSignatures++;
            }
        }

        return (
            validSignatures >= doc.requiredSignatures,
            validSignatures,
            doc.requiredSignatures
        );
    }
}
