'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { X, Upload, Loader2 } from 'lucide-react';

interface Props {
  /** Supabase Storage bucket name */
  bucket: string;
  /** Folder path within the bucket (should be the user's auth UID) */
  folder: string;
  /** Currently saved public URLs */
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  /** Accept string for <input type="file"> e.g. "image/*" or ".jpg,.jpeg,.png,.webp" */
  accept?: string;
  label?: string;
}

export function ImageUpload({
  bucket,
  folder,
  value,
  onChange,
  maxFiles = 10,
  accept = 'image/jpeg,image/png,image/webp',
  label,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  async function handleFiles(files: FileList) {
    if (!files.length) return;
    setUploading(true);
    setError(null);

    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Each image must be under 10 MB.');
        continue;
      }

      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
      newUrls.push(publicUrl);
    }

    onChange([...value, ...newUrls].slice(0, maxFiles));
    setUploading(false);
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  const canAddMore = value.length < maxFiles;

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      )}

      {/* Thumbnail strip */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((url) => (
            <div key={url} className="relative w-24 h-16 rounded-lg overflow-hidden group border border-slate-100">
              <Image
                src={url}
                alt="Property image"
                fill
                className="object-cover"
                unoptimized={url.includes('supabase.co')}
              />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload trigger */}
      {canAddMore && (
        <label
          className={`flex items-center gap-2.5 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            uploading
              ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
              : 'border-slate-200 hover:border-brand-400 hover:bg-brand-50/30'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400 flex-shrink-0" />
          ) : (
            <Upload className="w-4 h-4 text-slate-400 flex-shrink-0" />
          )}
          <span className="text-sm text-slate-500">
            {uploading
              ? 'Uploading…'
              : maxFiles === 1
              ? 'Upload image'
              : `Upload images (${value.length} / ${maxFiles})`}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            disabled={uploading}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      )}

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
