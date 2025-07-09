/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile MUI y otras dependencias que lo necesiten
  transpilePackages: [
    '@mui/material',
    '@mui/system',
    '@mui/x-data-grid',
    '@mui/icons-material',
    'moment-timezone'
  ],
  
  // Configurar webpack para manejar dependencias del navegador
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // No intentar resolver estas dependencias en el servidor
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      };
    }

    // Configuración adicional para @mui/x-data-grid
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    return config;
  },
};

export default nextConfig;
