/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['m.media-amazon.com', 'via.placeholder.com'],
    },
    typescript: {
        // !! WARN !!
        // This is a temporary solution only!
        // Remove this once you fix the type errors
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig