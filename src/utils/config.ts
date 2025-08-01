export const config = {
    CODE_LENGTH: parseInt(process.env.CODE_LENGTH || '6', 10),
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    DEFAULT_PAGE: parseInt(process.env.DEFAULT_PAGE || '1', 10),
    DEFAULT_LIMIT: parseInt(process.env.DEFAULT_LIMIT || '10', 10),
};