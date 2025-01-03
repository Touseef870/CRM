/** @type {import('next').NextConfig} */

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during builds
  },
 
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',   // Injects styles into the DOM
        'css-loader',     // Resolves CSS imports
        'postcss-loader', // Processes CSS with PostCSS
      ],
      include: path.resolve(__dirname, 'src/styles'), // Adjust the path to your CSS files
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // Avoids "fs" module errors in server-side code
    };

    // Add alias to ignore localStorage on the server
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        localStorage: false, // Prevents server-side errors for localStorage
      };
    }

    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        name: false, // Prevents chunk naming conflicts
      };
    }

    return config;
  },

  env: {
    customKey: 'yourValue',
  },
  // output: 'export',
  output: 'standalone',

  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable image optimization for cPanel hosting
  },
  distDir: 'build', // Optional: Change the build directory if needed
};

export default nextConfig;
