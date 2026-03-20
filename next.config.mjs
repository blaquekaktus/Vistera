/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'photo-sphere-viewer-data.netlify.app' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      // Supabase Storage (covers any project ref subdomain)
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
