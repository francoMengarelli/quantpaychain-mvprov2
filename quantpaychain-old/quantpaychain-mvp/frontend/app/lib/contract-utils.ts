
import { ethers } from 'ethers';
import { CONTRACTS } from './web3-config';

// DocumentRegistry ABI (simplified for MVP)
export const DOCUMENT_REGISTRY_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "ipfsHash", "type": "string"},
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "address[]", "name": "signers", "type": "address[]"},
      {"internalType": "uint256", "name": "expiryTime", "type": "uint256"},
      {"internalType": "bool", "name": "isMultiSig", "type": "bool"},
      {"internalType": "uint256", "name": "requiredSignatures", "type": "uint256"}
    ],
    "name": "registerDocument",
    "outputs": [{"internalType": "bytes32", "name": "documentId", "type": "bytes32"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "documentId", "type": "bytes32"},
      {"internalType": "string", "name": "signedIpfsHash", "type": "string"}
    ],
    "name": "signDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "documentId", "type": "bytes32"}],
    "name": "getDocument",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "ipfsHash", "type": "string"},
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "uint256", "name": "expiresAt", "type": "uint256"},
          {"internalType": "uint8", "name": "status", "type": "uint8"},
          {"internalType": "bytes32", "name": "documentHash", "type": "bytes32"},
          {"internalType": "address[]", "name": "signers", "type": "address[]"},
          {"internalType": "bool", "name": "isMultiSig", "type": "bool"},
          {"internalType": "uint256", "name": "requiredSignatures", "type": "uint256"}
        ],
        "internalType": "struct DocumentRegistry.Document",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "documentId", "type": "bytes32"},
      {"internalType": "address", "name": "signer", "type": "address"}
    ],
    "name": "getSignature",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "signer", "type": "address"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "bytes", "name": "signature", "type": "bytes"},
          {"internalType": "string", "name": "ipfsHash", "type": "string"},
          {"internalType": "bool", "name": "isValid", "type": "bool"}
        ],
        "internalType": "struct DocumentRegistry.Signature",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "bytes32", "name": "documentId", "type": "bytes32"},
      {"indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "title", "type": "string"}
    ],
    "name": "DocumentRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "bytes32", "name": "documentId", "type": "bytes32"},
      {"indexed": true, "internalType": "address", "name": "signer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string"}
    ],
    "name": "DocumentSigned",
    "type": "event"
  }
];

export class ContractService {
  async getContract(chainId: number, provider: ethers.Provider) {
    const contractAddress = CONTRACTS.DOCUMENT_REGISTRY[chainId as keyof typeof CONTRACTS.DOCUMENT_REGISTRY];
    if (!contractAddress) {
      throw new Error(`Contract not deployed on chain ${chainId}`);
    }

    return new ethers.Contract(
      contractAddress,
      DOCUMENT_REGISTRY_ABI,
      provider
    );
  }

  async registerDocument(
    signer: ethers.Signer,
    chainId: number,
    params: {
      ipfsHash: string;
      title: string;
      signers: string[];
      expiryTime?: number;
      isMultiSig?: boolean;
      requiredSignatures?: number;
    }
  ) {
    const contract = await this.getContract(chainId, signer.provider!);
    const contractWithSigner = contract.connect(signer);

    const tx = await (contractWithSigner as any).registerDocument(
      params.ipfsHash,
      params.title,
      params.signers,
      params.expiryTime || 0,
      params.isMultiSig || false,
      params.requiredSignatures || params.signers.length
    );

    return await tx.wait();
  }

  async signDocument(
    signer: ethers.Signer,
    chainId: number,
    documentId: string,
    signedIpfsHash: string
  ) {
    const contract = await this.getContract(chainId, signer.provider!);
    const contractWithSigner = contract.connect(signer);

    const tx = await (contractWithSigner as any).signDocument(documentId, signedIpfsHash);
    return await tx.wait();
  }

  async getDocument(provider: ethers.Provider, chainId: number, documentId: string) {
    const contract = await this.getContract(chainId, provider);
    return await contract.getDocument(documentId);
  }

  async getSignature(
    provider: ethers.Provider,
    chainId: number,
    documentId: string,
    signerAddress: string
  ) {
    const contract = await this.getContract(chainId, provider);
    return await contract.getSignature(documentId, signerAddress);
  }
}

export const contractService = new ContractService();

// Utility functions for API routes
export async function registerDocumentOnChain(documentHash: string, ipfsHash: string): Promise<string> {
  try {
    // For MVP, simulate blockchain registration
    console.log('Registering document on blockchain:', { documentHash, ipfsHash });
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 15)}${Date.now().toString(16)}${'0'.repeat(32)}`.substring(0, 66);
    
    console.log('Mock blockchain registration complete:', mockTxHash);
    return mockTxHash;
  } catch (error) {
    console.error('Blockchain registration error:', error);
    throw new Error('Failed to register document on blockchain');
  }
}

export async function signDocumentOnChain(documentId: string, signature: string, signerAddress: string): Promise<string> {
  try {
    // For MVP, simulate blockchain signing
    console.log('Signing document on blockchain:', { documentId, signerAddress });
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 15)}${Date.now().toString(16)}${'0'.repeat(32)}`.substring(0, 66);
    
    console.log('Mock blockchain signing complete:', mockTxHash);
    return mockTxHash;
  } catch (error) {
    console.error('Blockchain signing error:', error);
    throw new Error('Failed to sign document on blockchain');
  }
}

export async function verifyDocumentOnChain(documentHash: string): Promise<boolean> {
  try {
    // For MVP, simulate verification
    console.log('Verifying document on blockchain:', documentHash);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock verification result
    return true;
  } catch (error) {
    console.error('Blockchain verification error:', error);
    return false;
  }
}
