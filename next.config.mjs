/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['img.icons8.com', 'core-staging.nativetalkcrm.com'],
    },
    async redirects() {
      return [
        {
          source: '/nativecrm',
          destination: '/nativecrm/dashboard',
          permanent: true,
        },
      ]
    },
  };
  
  export default nextConfig;
  