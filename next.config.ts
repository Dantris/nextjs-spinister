module.exports = {
  async redirects() {
    return [
      {
        source: "/account",
        destination: "/login",
        permanent: false, // 🚨 This forces a redirect to /login
      },
    ];
  },
};
