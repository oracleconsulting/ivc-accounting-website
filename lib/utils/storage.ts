import { supabase } from '@/lib/supabaseClient';

export async function uploadImage(file: File, folder: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error('Failed to upload image');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteImage(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from('blog-images')
    .remove([filePath]);

  if (error) {
    throw new Error('Failed to delete image');
  }
} 