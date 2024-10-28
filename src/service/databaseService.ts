import mongoose from 'mongoose'; // Import the mongoose library for MongoDB interactions
import config from '../config/config'; // Import the configuration settings

// Export an object with a connect method
export default {
    // Asynchronous method to connect to the database
    connect: async () => {
        try {
            // Attempt to connect to the MongoDB database using the URL from config
            await mongoose.connect(config.DATABASE_URL as string);
            // Return the mongoose connection object
            return mongoose.connection;
        } catch (error) {
            // If an error occurs during connection, throw the error
            throw error;
        }
    }
};
