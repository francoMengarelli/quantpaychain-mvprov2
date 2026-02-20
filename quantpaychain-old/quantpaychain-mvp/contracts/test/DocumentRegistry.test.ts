
import { expect } from "chai";
import { ethers } from "hardhat";
import { DocumentRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("DocumentRegistry", function () {
  let documentRegistry: DocumentRegistry;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async function () {
    [admin, user1, user2, user3] = await ethers.getSigners();

    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    documentRegistry = await DocumentRegistry.deploy() as DocumentRegistry;
    
    // Initialize the contract
    await documentRegistry.initialize(admin.address);
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await documentRegistry.hasRole(await documentRegistry.ADMIN_ROLE(), admin.address)).to.be.true;
    });

    it("Should have correct initial state", async function () {
      expect(await documentRegistry.paused()).to.be.false;
    });
  });

  describe("Document Registration", function () {
    it("Should register a document successfully", async function () {
      const ipfsHash = "QmTestHash123";
      const title = "Test Document";
      const signers = [user1.address, user2.address];

      await expect(
        documentRegistry.connect(user1).registerDocument(
          ipfsHash,
          title,
          signers,
          0, // no expiry
          false, // not multi-sig
          2 // required signatures
        )
      ).to.emit(documentRegistry, "DocumentRegistered");
    });

    it("Should reject empty IPFS hash", async function () {
      const title = "Test Document";
      const signers = [user1.address];

      await expect(
        documentRegistry.connect(user1).registerDocument(
          "",
          title,
          signers,
          0,
          false,
          1
        )
      ).to.be.revertedWith("IPFS hash cannot be empty");
    });

    it("Should reject empty title", async function () {
      const ipfsHash = "QmTestHash123";
      const signers = [user1.address];

      await expect(
        documentRegistry.connect(user1).registerDocument(
          ipfsHash,
          "",
          signers,
          0,
          false,
          1
        )
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should reject invalid signers array", async function () {
      const ipfsHash = "QmTestHash123";
      const title = "Test Document";

      await expect(
        documentRegistry.connect(user1).registerDocument(
          ipfsHash,
          title,
          [], // empty signers
          0,
          false,
          1
        )
      ).to.be.revertedWith("Invalid signers array");
    });
  });

  describe("Document Signing", function () {
    let documentId: string;

    beforeEach(async function () {
      const ipfsHash = "QmTestHash123";
      const title = "Test Document";
      const signers = [user1.address, user2.address];

      const tx = await documentRegistry.connect(admin).registerDocument(
        ipfsHash,
        title,
        signers,
        0,
        false,
        2
      );
      
      const receipt = await tx.wait();
      const events = receipt?.logs || [];
      
      for (const event of events) {
        try {
          const parsedEvent = documentRegistry.interface.parseLog(event);
          if (parsedEvent?.name === "DocumentRegistered") {
            documentId = parsedEvent.args[0];
            break;
          }
        } catch (e) {
          // Skip non-matching events
        }
      }
    });

    it("Should allow required signer to sign", async function () {
      const signedIpfsHash = "QmSignedHash123";

      await expect(
        documentRegistry.connect(user1).signDocument(documentId, signedIpfsHash)
      ).to.emit(documentRegistry, "DocumentSigned");
    });

    it("Should reject unauthorized signer", async function () {
      const signedIpfsHash = "QmSignedHash123";

      await expect(
        documentRegistry.connect(user3).signDocument(documentId, signedIpfsHash)
      ).to.be.revertedWith("Not a required signer");
    });

    it("Should reject duplicate signature", async function () {
      const signedIpfsHash = "QmSignedHash123";

      await documentRegistry.connect(user1).signDocument(documentId, signedIpfsHash);

      await expect(
        documentRegistry.connect(user1).signDocument(documentId, signedIpfsHash)
      ).to.be.revertedWith("Already signed");
    });

    it("Should complete document when all signatures received", async function () {
      const signedIpfsHash = "QmSignedHash123";

      await documentRegistry.connect(user1).signDocument(documentId, signedIpfsHash);
      await documentRegistry.connect(user2).signDocument(documentId, signedIpfsHash);

      const document = await documentRegistry.getDocument(documentId);
      expect(document.status).to.equal(2); // DocumentStatus.Signed
    });
  });

  describe("EIP-712 Structured Signing", function () {
    let documentId: string;

    beforeEach(async function () {
      const ipfsHash = "QmTestHash123";
      const title = "Test Document";
      const signers = [user1.address];

      const tx = await documentRegistry.connect(admin).registerDocument(
        ipfsHash,
        title,
        signers,
        0,
        false,
        1
      );
      
      const receipt = await tx.wait();
      const events = receipt?.logs || [];
      
      for (const event of events) {
        try {
          const parsedEvent = documentRegistry.interface.parseLog(event);
          if (parsedEvent?.name === "DocumentRegistered") {
            documentId = parsedEvent.args[0];
            break;
          }
        } catch (e) {
          // Skip non-matching events
        }
      }
    });

    it("Should accept valid EIP-712 signature", async function () {
      const signedIpfsHash = "QmSignedHash123";
      const deadline = (await time.latest()) + 3600; // 1 hour from now
      const nonce = await documentRegistry.getNonce(user1.address);

      // Create EIP-712 signature
      const domain = {
        name: "QuantPayChain",
        version: "1",
        chainId: await user1.provider.getNetwork().then(n => Number(n.chainId)),
        verifyingContract: await documentRegistry.getAddress()
      };

      const types = {
        DocumentSigning: [
          { name: "documentId", type: "bytes32" },
          { name: "ipfsHash", type: "string" },
          { name: "signer", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      };

      const value = {
        documentId: documentId,
        ipfsHash: signedIpfsHash,
        signer: user1.address,
        nonce: nonce,
        deadline: deadline
      };

      const signature = await user1.signTypedData(domain, types, value);

      await expect(
        documentRegistry.connect(user1).signDocumentWithStructuredSignature(
          documentId,
          signedIpfsHash,
          deadline,
          signature
        )
      ).to.emit(documentRegistry, "DocumentSigned");
    });

    it("Should reject expired signature", async function () {
      const signedIpfsHash = "QmSignedHash123";
      const deadline = (await time.latest()) - 100; // Already expired
      const signature = "0x1234"; // Dummy signature

      await expect(
        documentRegistry.connect(user1).signDocumentWithStructuredSignature(
          documentId,
          signedIpfsHash,
          deadline,
          signature
        )
      ).to.be.revertedWith("Signature deadline expired");
    });
  });

  describe("Document Queries", function () {
    let documentId: string;

    beforeEach(async function () {
      const ipfsHash = "QmTestHash123";
      const title = "Test Document";
      const signers = [user1.address];

      const tx = await documentRegistry.connect(admin).registerDocument(
        ipfsHash,
        title,
        signers,
        0,
        false,
        1
      );
      
      const receipt = await tx.wait();
      const events = receipt?.logs || [];
      
      for (const event of events) {
        try {
          const parsedEvent = documentRegistry.interface.parseLog(event);
          if (parsedEvent?.name === "DocumentRegistered") {
            documentId = parsedEvent.args[0];
            break;
          }
        } catch (e) {
          // Skip non-matching events
        }
      }
    });

    it("Should return correct document info", async function () {
      const document = await documentRegistry.getDocument(documentId);
      expect(document.title).to.equal("Test Document");
      expect(document.ipfsHash).to.equal("QmTestHash123");
      expect(document.creator).to.equal(admin.address);
    });

    it("Should return user documents", async function () {
      const userDocs = await documentRegistry.getUserDocuments(admin.address);
      expect(userDocs).to.include(documentId);
    });

    it("Should return pending signatures", async function () {
      const pending = await documentRegistry.getPendingSignatures(user1.address);
      expect(pending).to.include(documentId);
    });
  });

  describe("Document Revocation", function () {
    let documentId: string;

    beforeEach(async function () {
      const ipfsHash = "QmTestHash123";
      const title = "Test Document";
      const signers = [user1.address];

      const tx = await documentRegistry.connect(admin).registerDocument(
        ipfsHash,
        title,
        signers,
        0,
        false,
        1
      );
      
      const receipt = await tx.wait();
      const events = receipt?.logs || [];
      
      for (const event of events) {
        try {
          const parsedEvent = documentRegistry.interface.parseLog(event);
          if (parsedEvent?.name === "DocumentRegistered") {
            documentId = parsedEvent.args[0];
            break;
          }
        } catch (e) {
          // Skip non-matching events
        }
      }
    });

    it("Should allow creator to revoke document", async function () {
      await expect(
        documentRegistry.connect(admin).revokeDocument(documentId)
      ).to.emit(documentRegistry, "DocumentStatusChanged");

      const document = await documentRegistry.getDocument(documentId);
      expect(document.status).to.equal(4); // DocumentStatus.Revoked
    });

    it("Should reject revocation by non-creator", async function () {
      await expect(
        documentRegistry.connect(user1).revokeDocument(documentId)
      ).to.be.revertedWith("Only document creator");
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to pause", async function () {
      await documentRegistry.connect(admin).pause();
      expect(await documentRegistry.paused()).to.be.true;
    });

    it("Should reject pause by non-admin", async function () {
      await expect(
        documentRegistry.connect(user1).pause()
      ).to.be.revertedWithCustomError(documentRegistry, "AccessControlUnauthorizedAccount");
    });

    it("Should reject operations when paused", async function () {
      await documentRegistry.connect(admin).pause();

      await expect(
        documentRegistry.connect(user1).registerDocument(
          "QmTestHash123",
          "Test Document",
          [user1.address],
          0,
          false,
          1
        )
      ).to.be.revertedWithCustomError(documentRegistry, "EnforcedPause");
    });
  });

  describe("Multi-signature Documents", function () {
    it("Should handle multi-sig documents correctly", async function () {
      const ipfsHash = "QmTestHash123";
      const title = "Multi-sig Document";
      const signers = [user1.address, user2.address, user3.address];

      const tx = await documentRegistry.connect(admin).registerDocument(
        ipfsHash,
        title,
        signers,
        0,
        true, // multi-sig enabled
        2 // only 2 of 3 signatures required
      );

      const receipt = await tx.wait();
      const events = receipt?.logs || [];
      
      let documentId = "";
      for (const event of events) {
        try {
          const parsedEvent = documentRegistry.interface.parseLog(event);
          if (parsedEvent?.name === "DocumentRegistered") {
            documentId = parsedEvent.args[0];
            break;
          }
        } catch (e) {
          // Skip non-matching events
        }
      }

      const signedIpfsHash = "QmSignedHash123";

      // First signature
      await documentRegistry.connect(user1).signDocument(documentId, signedIpfsHash);
      let document = await documentRegistry.getDocument(documentId);
      expect(document.status).to.equal(1); // Still pending

      // Second signature (should complete)
      await documentRegistry.connect(user2).signDocument(documentId, signedIpfsHash);
      document = await documentRegistry.getDocument(documentId);
      expect(document.status).to.equal(2); // Signed
    });
  });
});
