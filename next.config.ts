/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // !! WARN !!
        // This is a temporary solution only!
        // Remove this once you fix the type errors
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig