import { insforgeClient } from './insforge-client';
import { ServiceResponse } from './types';

const BUCKET_NAME = 'task-attachments';

/**
 * Upload file with user-specific folder
 */
export async function uploadAttachment(
  file: File,
  userId?: string
): Promise<ServiceResponse<string>> {
  try {
    if (!file) throw new Error('No file provided');
    if (file.size > 10 * 1024 * 1024) throw new Error('File size must be less than 10MB');

    // Improved debugging
    if (!userId) {
      console.error('[uploadAttachment] Missing userId. This should not happen if user is logged in.');
      throw new Error('User ID is required to upload files');
    }

    console.log(`[uploadAttachment] Uploading for user: ${userId}`);

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt || 'png'}`;

    const uploadResult = await insforgeClient.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadResult?.error) throw uploadResult.error;

    const publicUrl = insforgeClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return { 
      data: publicUrl as string, 
      error: null 
    };
  } catch (error: any) {
    console.error('Error uploading attachment:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to upload file' } 
    };
  }
}

/**
 * Delete attachment
 */
export async function deleteAttachment(filePath: string): Promise<ServiceResponse<null>> {
  try {
    if (!filePath) throw new Error('File path is required');

    const result = await insforgeClient.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (result?.error) throw result.error;

    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error deleting attachment:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to delete file' } 
    };
  }
}

/**
 * Get public URL
 */
export function getAttachmentUrl(filePath: string): string {
  if (!filePath) return '';
  return insforgeClient.storage.from(BUCKET_NAME).getPublicUrl(filePath) as string;
}