import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Point Turbopack at this package's own root to silence the lockfile warning.
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    minimumCacheTTL: 60,
  },

  devIndicators: false,
};

export default nextConfig;
