/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
  },
  ignoredRouteFiles: ["**/.*", "components/*"],
  serverDependenciesToBundle: "all",
  tailwind: true,
  postcss: true,
  appDirectory: "src",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // devServerPort: 8002
}
