import { STORAGE_BUCKET, supabase } from '../lib/supabase.js';

const MAX_BYTES = 5 * 1024 * 1024; // matches the bucket's file_size_limit in schema.sql
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];

/** Uploads an image to the public bucket and returns its public URL. */
export async function uploadImage(file, folder) {
  if (!ALLOWED.includes(file.type)) throw new Error('Use a PNG, JPG, WebP, GIF or SVG image.');
  if (file.size > MAX_BYTES) throw new Error('Images must be 5 MB or smaller.');

  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  // Timestamp + random suffix: never overwrites an existing file, and a new
  // URL means browsers can cache images forever.
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '31536000', contentType: file.type, upsert: false });
  if (error) throw error;

  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
