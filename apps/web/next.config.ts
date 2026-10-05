import type { NextConfig } from 'next';

import './src/env';

const nextConfig: NextConfig = {
  typedRoutes: true,
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
};

export default nextConfig;
