import dotenv, {parse} from 'dotenv';
import path from "path";

dotenv.config();

const config = {
	port: process.env.PORT || 4000,
	db: {
		username: process.env.MONGODB_USERNAME || '',
		password: process.env.MONGODB_PASSWORD || '',
		url: process.env.MONGODB_URL || '',
		name: process.env.MONGODB_TABLE_NAME || '',
	},
	secretOrKey: 'yee',
	mail: {
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT),
		secure: Boolean(parseInt(process.env.SMTP_SECURE)),
		templates: {
			resetPassword: path.join(__dirname, '../mail/templates/reset-password.html'),
			newUser: path.join(__dirname, '../mail/templates/new-account.html')
		}
	},
	appDomain: process.env.APP_DOMAIN,
	appProtocol: process.env.APP_PROTOCOL,
};

if (!!process.env.SMTP_PROXY) {
	config.mail.proxy = process.env.SMTP_PROXY;
}

export default config;