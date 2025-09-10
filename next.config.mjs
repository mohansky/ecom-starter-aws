import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  output: 'standalone',
  serverExternalPackages: [
    '@libsql/client', 
    'libsql', 
    '@libsql/linux-x64-musl',
    'better-sqlite3'
  ],
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Handle database packages as externals
    if (isServer) {
      webpackConfig.externals.push({
        '@libsql/client': 'commonjs @libsql/client',
        'libsql': 'commonjs libsql',
        '@libsql/linux-x64-musl': 'commonjs @libsql/linux-x64-musl',
        'better-sqlite3': 'commonjs better-sqlite3',
      })
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
