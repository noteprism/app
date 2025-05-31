export const CONFIG = {
    DATABASE: {
        URL: process.env.DATABASE_URL || 'postgresql://postgres:2255@localhost:5432/noteprism',
        USER: process.env.DB_USER || 'postgres',
        PASSWORD: process.env.DB_PASSWORD || '2255',
        HOST: process.env.DB_HOST || 'localhost',
        PORT: parseInt(process.env.DB_PORT || '5432'),
        NAME: process.env.DB_NAME || 'noteprism'
    },
    SERVER: {
        PORT: parseInt(process.env.PORT || '5173'),
        HOST: process.env.HOST || 'localhost'
    },
    APP: {
        NAME: process.env.APP_NAME || 'Noteprism',
        VERSION: process.env.APP_VERSION || '1.0.0'
    }
} as const; 