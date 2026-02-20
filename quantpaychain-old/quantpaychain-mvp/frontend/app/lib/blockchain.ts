
import { ethers } from 'ethers';

// Contract ABI - simplified version focusing on key methods
const DOCUMENT_REGISTRY_ABI = [
  {
    "inputs": [
      {"name": "ipfsHash", "type": "string"},
      {"name": "title", "type": "string"}, 
      {"name": "signers", "type": "address[]"},
      {"name": "expiryTime", "type": "uint256"},
      {"name": "isMultiSig", "type": "bool"},
      {"name": "requiredSignatures", "type": "uint256"}
    ],
    "name": "registerDocument",
    "outputs": [{"name": "documentId", "type": "bytes32"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "documentId", "type": "bytes32"},
      {"name": "signedIpfsHash", "type": "string"}
    ],
    "name": "signDocument", 
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "documentId", "type": "bytes32"}],
    "name": "getDocument",
    "outputs": [
      {
        "components": [
          {"name": "ipfsHash", "type": "string"},
          {"name": "title", "type": "string"},
          {"name": "creator", "type": "address"},
          {"name": "createdAt", "type": "uint256"},
          {"name": "expiresAt", "type": "uint256"},
          {"name": "status", "type": "uint8"},
          {"name": "documentHash", "type": "bytes32"},
          {"name": "signers", "type": "address[]"},
          {"name": "isMultiSig", "type": "bool"},
          {"name": "requiredSignatures", "type": "uint256"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "documentId", "type": "bytes32"},
      {"name": "signer", "type": "address"}
    ],
    "name": "getSignature",
    "outputs": [
      {
        "components": [
          {"name": "signer", "type": "address"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "signature", "type": "bytes"},
          {"name": "ipfsHash", "type": "string"},
          {"name": "isValid", "type": "bool"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserDocuments",
    "outputs": [{"name": "", "type": "bytes32[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  sepolia: "0x742d35Cc6634C0532925a3b8D29B5A33B3f7B0A5", // Replace with actual deployed address
  mainnet: "0x742d35Cc6634C0532925a3b8D29B5A33B3f7B0A5", // Replace with actual deployed address
  polygon: "0x742d35Cc6634C0532925a3b8D29B5A33B3f7B0A5", // Replace with actual deployed address
};

export interface DocumentData {
  ipfsHash: string;
  title: string;
  creator: string;
  createdAt: number;
  expiresAt: number;
  status: number;
  documentHash: string;
  signers: string[];
  isMultiSig: boolean;
  requiredSignatures: number;
}

export interface SignatureData {
  signer: string;
  timestamp: number;
  signature: string;
  ipfsHash: string;
  isValid: boolean;
}

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  async initialize() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    
    const network = await this.provider.getNetwork();
    const networkName = this.getNetworkName(Number(network.chainId));
    const contractAddress = CONTRACT_ADDRESSES[networkName as keyof typeof CONTRACT_ADDRESSES];
    
    if (!contractAddress) {
      throw new Error(`Contract not deployed on network: ${networkName}`);
    }

    this.contract = new ethers.Contract(contractAddress, DOCUMENT_REGISTRY_ABI, this.signer);
  }

  private getNetworkName(chainId: number): string {
    switch (chainId) {
      case 1: return 'mainnet';
      case 11155111: return 'sepolia';
      case 137: return 'polygon';
      default: return 'sepolia'; // Default to sepolia for testing
    }
  }

  async registerDocument(
    ipfsHash: string,
    title: string,
    signers: string[] = [],
    expiryHours: number = 0,
    isMultiSig: boolean = false,
    requiredSignatures: number = 1
  ): Promise<string> {
    if (!this.contract) {
      await this.initialize();
    }

    const expiryTime = expiryHours > 0 ? expiryHours * 3600 : 0; // Convert hours to seconds
    const userAddress = await this.signer!.getAddress();
    
    // If no signers provided, use current user
    const documentSigners = signers.length > 0 ? signers : [userAddress];
    
    try {
      const tx = await this.contract!.registerDocument(
        ipfsHash,
        title,
        documentSigners,
        expiryTime,
        isMultiSig,
        requiredSignatures
      );

      const receipt = await tx.wait();
      
      // Extract document ID from the event logs
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract!.interface.parseLog(log);
          return parsed?.name === 'DocumentRegistered';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = this.contract!.interface.parseLog(event);
        return parsed?.args.documentId;
      }

      throw new Error('Document registration event not found');
    } catch (error) {
      console.error('Error registering document:', error);
      throw new Error('Failed to register document on blockchain');
    }
  }

  async signDocument(documentId: string, signedIpfsHash: string): Promise<void> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const tx = await this.contract!.signDocument(documentId, signedIpfsHash);
      await tx.wait();
    } catch (error) {
      console.error('Error signing document:', error);
      throw new Error('Failed to sign document on blockchain');
    }
  }

  async getDocument(documentId: string): Promise<DocumentData> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const result = await this.contract!.getDocument(documentId);
      return {
        ipfsHash: result.ipfsHash,
        title: result.title,
        creator: result.creator,
        createdAt: Number(result.createdAt),
        expiresAt: Number(result.expiresAt),
        status: Number(result.status),
        documentHash: result.documentHash,
        signers: result.signers,
        isMultiSig: result.isMultiSig,
        requiredSignatures: Number(result.requiredSignatures)
      };
    } catch (error) {
      console.error('Error getting document:', error);
      throw new Error('Failed to get document from blockchain');
    }
  }

  async getSignature(documentId: string, signerAddress: string): Promise<SignatureData> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const result = await this.contract!.getSignature(documentId, signerAddress);
      return {
        signer: result.signer,
        timestamp: Number(result.timestamp),
        signature: result.signature,
        ipfsHash: result.ipfsHash,
        isValid: result.isValid
      };
    } catch (error) {
      console.error('Error getting signature:', error);
      throw new Error('Failed to get signature from blockchain');
    }
  }

  async getUserDocuments(userAddress?: string): Promise<string[]> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const address = userAddress || await this.signer!.getAddress();
      const documentIds = await this.contract!.getUserDocuments(address);
      return documentIds;
    } catch (error) {
      console.error('Error getting user documents:', error);
      throw new Error('Failed to get user documents from blockchain');
    }
  }

  async getConnectedAddress(): Promise<string> {
    if (!this.signer) {
      await this.initialize();
    }
    return await this.signer!.getAddress();
  }

  async getNetwork(): Promise<{ name: string; chainId: number }> {
    if (!this.provider) {
      await this.initialize();
    }
    const network = await this.provider!.getNetwork();
    return {
      name: this.getNetworkName(Number(network.chainId)),
      chainId: Number(network.chainId)
    };
  }
}

export const blockchainService = new BlockchainService();
