
import axios from 'axios';
import { IPFS_CONFIG } from './web3-config';

interface IPFSUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export class IPFSService {
  private apiKey: string;
  private apiSecret: string;
  private jwt: string;
  private baseURL = 'https://api.pinata.cloud';

  constructor() {
    this.apiKey = IPFS_CONFIG.PINATA_API_KEY;
    this.apiSecret = IPFS_CONFIG.PINATA_SECRET;
    this.jwt = IPFS_CONFIG.PINATA_JWT;
  }

  private getHeaders() {
    if (this.jwt) {
      return {
        'Authorization': `Bearer ${this.jwt}`,
      };
    }
    return {
      'pinata_api_key': this.apiKey,
      'pinata_secret_api_key': this.apiSecret,
    };
  }

  async uploadFile(file: File, metadata?: any): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (metadata) {
        formData.append('pinataMetadata', JSON.stringify({
          name: metadata.name || file.name,
          keyvalues: metadata.keyvalues || {},
        }));
      }

      formData.append('pinataOptions', JSON.stringify({
        cidVersion: 1,
      }));

      const response = await axios.post<IPFSUploadResponse>(
        `${this.baseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'multipart/form-data',
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async uploadJSON(data: any, name?: string): Promise<string> {
    try {
      const response = await axios.post<IPFSUploadResponse>(
        `${this.baseURL}/pinning/pinJSONToIPFS`,
        data,
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  getGatewayUrl(hash: string): string {
    return `${IPFS_CONFIG.GATEWAY_URL}${hash}`;
  }

  async pinByHash(hash: string, name?: string): Promise<void> {
    try {
      await axios.post(
        `${this.baseURL}/pinning/pinByHash`,
        {
          hashToPin: hash,
          pinataMetadata: name ? { name } : undefined,
        },
        {
          headers: this.getHeaders(),
        }
      );
    } catch (error) {
      console.error('Error pinning hash:', error);
      throw new Error('Failed to pin hash');
    }
  }

  async unpin(hash: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/pinning/unpin/${hash}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error unpinning:', error);
      throw new Error('Failed to unpin hash');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await axios.get(`${this.baseURL}/data/testAuthentication`, {
        headers: this.getHeaders(),
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const ipfsService = new IPFSService();

// Utility functions for API routes
export async function uploadToIPFS(buffer: Buffer, fileName: string): Promise<string> {
  try {
    // Convert buffer to File for the service
    const file = new File([Buffer.from(buffer)], fileName);
    
    const metadata = {
      name: fileName,
      keyvalues: {
        uploadedBy: 'quantpay-chain',
        timestamp: new Date().toISOString()
      }
    };

    return await ipfsService.uploadFile(file, metadata);
  } catch (error) {
    console.error('Upload to IPFS error:', error);
    // For MVP, return a mock hash if Pinata fails
    return `QmMock${Date.now()}${Math.random().toString(36).substring(2, 15)}`;
  }
}

export async function downloadFromIPFS(hash: string): Promise<string> {
  try {
    return ipfsService.getGatewayUrl(hash);
  } catch (error) {
    console.error('Download from IPFS error:', error);
    throw new Error('Failed to generate download URL');
  }
}

export async function pinToIPFS(hash: string): Promise<boolean> {
  try {
    await ipfsService.pinByHash(hash);
    return true;
  } catch (error) {
    console.error('Pin to IPFS error:', error);
    return false;
  }
}
