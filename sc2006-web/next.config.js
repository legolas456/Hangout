/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false, // True: renders components twice (on dev but not production) in order to detect any problems with your code and warn you about them (which can be quite useful). Turned off as I require PublicParticipantCard to render once
	swcMinify: true,
	env: {
		API_URL: process.env.CLIENT_ENV
			? process.env.API_URL
			: 'http://localhost:3100',
		AUTH_TOKEN_SECRET:
			'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCadRK5JmtBVg9EEutjRxI2M1L/b25iot7zm+EKwSHOuQSrmGC0D6wgIU1UNfQA9K3uCBfvs0b1zNg0l/OmKptBeo/ko8l/VYmlYoY2ast0tkH4341YBnTDzxEGgUxDiPuI1gdeYThAY7yzJweb+5brZgPpwT6mZYy64J+hurljtwIDAQAB',
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/home',
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
