/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "gallant-giraffe-334.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
