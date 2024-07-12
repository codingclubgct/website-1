/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-remote-mdx", "next-remote-mdx-client"],
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "**/*"
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "**/*"
      },
    ]
  }
}

module.exports = nextConfig
