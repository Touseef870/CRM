import path from 'path';

const nextConfig = {
    webpack: (config, { isServer }) => {
        // Add custom CSS handling
        config.module.rules.push({
            test: /\.css$/,
            use: [
                'style-loader', // Injects styles into the DOM
                'css-loader',   // Resolves CSS imports
                'postcss-loader', // Processes CSS with PostCSS
            ],
            include: path.resolve('src/styles'), // Adjust the path to your CSS files
        });

        // Optional: Resolve potential CSS handling issues in server-side rendering
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false, // Avoids "fs" module errors
            };
        }

        return config;
    },
};

export default nextConfig;
