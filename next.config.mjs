import path from 'path';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
      ],
      include: path.resolve(__dirname, 'src/styles'),
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        name: false,
      };
    }

    return config;
  },

  env: {
    customKey: 'yourValue',
  },
};

export default nextConfig;
