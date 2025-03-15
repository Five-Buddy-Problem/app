/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  output: "export",
  images: {
    unoptimized: true,
  },

  webpack: (config) => {
    // This is needed for Three.js to work with Next.js
    config.resolve.alias = {
      ...config.resolve.alias,
      three: require.resolve("three"),
    };
    return config;
  },
};

export default config;
