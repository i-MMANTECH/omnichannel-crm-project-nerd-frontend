/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true,
      domains: [
        'img.icons8.com', 
        'core-staging.nativetalkcrm.com', 
        'staging.core.nativetalkcrm.com',
      ],
    },
    async redirects() {
      return [
        {
          source: '/nativecrm',
          destination: '/nativecrm/dashboard',
          permanent: true,
        },
        {
          source: '/admin',
          destination: '/admin/dashboard',
          permanent: true,
        },
      ]
    },
  };
  
  export default nextConfig;
  