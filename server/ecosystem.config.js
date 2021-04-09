module.exports = {
    apps: [{
        name: "server",
        script: "./server.js",
        watch: true,
        env: {
            "NODE_ENV": "development",
        },
        env_production: {
            "NODE_ENV": "production",
            "PORT": 4000
        },
        node_args: "-r esm"
    }],

    deploy: {
        production: {
            user: process.env.HOST_USER,
            host: 'cs-first.cs.fiu.edu',
            key: 'deploy.key',
            ref: 'origin/main',
            repo: 'https://github.com/FIU-VAS/VAS',
            path: process.env.PROJECT_DIRECTORY,
            'post-deploy': 'cd ./server && npm install && pm2 reload ecosystem.config.js --env production',
            env: {
                NODE_ENV: process.env.NODE_ENV,
                MONGODB_USERNAME: process.env.MONGODB_USERNAME,
                MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
                MONGODB_URL: process.env.MONGODB_URL,
                MONGODB_TABLE_NAME: process.env.MONGODB_TABLE_NAME,
                APP_DOMAIN: "cs-first.cs.fiu.edu",
                APP_PROTOCOL: "https",

                SMTP_HOST: process.env.SMTP_HOST,
                SMTP_PORT: process.env.SMTP_PORT,
                SMTP_SECURE: process.env.SMTP_SECURE,
            },
        }
    }
};
