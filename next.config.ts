import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react',
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
      ],
    },
  },
  images: {
    remotePatterns: [new URL('https://img.clerk.com/**')],
    domains: ['images.unsplash.com', 'i.imgur.com'],
  },
};

export default withMDX(nextConfig);
