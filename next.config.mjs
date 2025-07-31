/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 👈 ESTA LÍNEA es clave para que se genere /out

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig;
