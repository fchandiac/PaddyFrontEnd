/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile MUI y otras dependencias que lo necesiten
  transpilePackages: [
    '@mui/material', 
    '@mui/icons-material',
    '@mui/x-data-grid'
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
    return config;
  },
};

export default nextConfig;
