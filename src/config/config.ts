import DotenvFlow from 'dotenv-flow'

DotenvFlow.config()

// Step 1: Define the interface for the configuration
interface Config {
    ENV: string | undefined;
    PORT: string | undefined;
    SERVER_URL: string | undefined;
    DATABASE_URL: string | undefined;
    AUTH_URL: string | any
}

// Step 2: Create and export the configuration object
const config: Config = {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_URL: process.env.AUTH_URL 
};

export default config;
