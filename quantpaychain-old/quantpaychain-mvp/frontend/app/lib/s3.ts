

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getBucketConfig, createS3Client } from "./aws-config";

export async function uploadFile(buffer: Buffer, fileName: string): Promise<string> {
  try {
    const s3Client = createS3Client();
    const config = getBucketConfig();
    
    const key = `${config.folderPrefix}uploads/${Date.now()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: buffer,
    });

    await s3Client.send(command);
    return key; // Return the S3 key (cloud_storage_path)
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to cloud storage');
  }
}

export async function downloadFile(key: string): Promise<string> {
  try {
    const s3Client = createS3Client();
    const config = getBucketConfig();
    
    const command = new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    return signedUrl;
  } catch (error) {
    console.error('S3 download error:', error);
    throw new Error('Failed to generate download URL');
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    const s3Client = createS3Client();
    const config = getBucketConfig();
    
    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from cloud storage');
  }
}

export async function renameFile(oldKey: string, newKey: string): Promise<string> {
  try {
    // Download the file first
    const downloadUrl = await downloadFile(oldKey);
    const response = await fetch(downloadUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Upload with new key
    await uploadFile(buffer, newKey);
    
    // Delete old file
    await deleteFile(oldKey);
    
    return newKey;
  } catch (error) {
    console.error('S3 rename error:', error);
    throw new Error('Failed to rename file');
  }
}
