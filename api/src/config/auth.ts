export default {
    jwt: {
        secret: process.env.APP_SECRET || 'Default',
        expiresIn: "1d",
    },
};
