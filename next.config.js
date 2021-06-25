module.exports = {
  reactStrictMode: true,
  images: { disableStaticImages: true },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            svgo: false,
          },
        },
      ],
    })

    return config
  },
}
