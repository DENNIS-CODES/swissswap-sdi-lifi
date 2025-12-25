import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cryptologos.cc" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "assets-cdn.lifi.io" },
      { protocol: "https", hostname: "lifi-api.staging.lifi.com" },
      { protocol: "https", hostname: "li.quest" },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      buffer: require.resolve("buffer/"),
      "node:buffer": require.resolve("buffer/"),
      "buffer/index.js": require.resolve("buffer/"),
    };
    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      buffer: require.resolve("buffer/"),
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.NormalModuleReplacementPlugin(
        /^node:buffer$/,
        require.resolve("buffer/")
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^buffer\/index\.js$/,
        require.resolve("buffer/")
      )
    );
    return config;
  },
};

export default nextConfig;
