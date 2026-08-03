import imageCompression from 'browser-image-compression';
import { supabase } from '@/integrations/supabase/client';

// Generate SEO-friendly filename
export function generateSEOFilename(originalName: string, category: string = 'image'): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  const timestamp = Date.now();
  return `${category}-${cleanName}-${timestamp}.webp`;
}

// Compress and convert image to WebP
export async function compressAndConvertImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
    alwaysKeepResolution: true,
  };
  
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Compression error:', error);
    throw error;
  }
}

// Upload to Supabase Storage
export async function uploadToSupabase(
  file: File,
  bucket: string,
  category: string = 'gallery'
): Promise<{ url: string; path: string; error: any }> {
  const fileName = generateSEOFilename(file.name, category);
  const filePath = `${category}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/webp'
    });
  
  if (error) return { url: '', path: '', error };
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return { url: publicUrl, path: filePath, error: null };
}

// Delete image from storage
export async function deleteFromStorage(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  return !error;
}

// Get all images from a bucket
export async function getGalleryImages(bucket: string, category?: string): Promise<any[]> {
  let folderPath = category ? `${category}/` : '';
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(category || '');
  
  if (error) {
    console.error('Error fetching images:', error);
    return [];
  }
  
  return await Promise.all(
    (data || []).map(async (item) => {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(`${folderPath}${item.name}`);
      
      return {
        name: item.name,
        url: publicUrl,
        size: item.metadata?.size,
        created_at: item.created_at,
        path: `${folderPath}${item.name}`
      };
    })
  );
}