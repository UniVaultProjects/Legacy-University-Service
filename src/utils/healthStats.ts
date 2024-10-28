import os from 'os'; // Import the os module for operating system-related utility methods
import config from '../config/config'; // Import configuration settings

// Export an object with methods to check system and application health
export default {
    // Method to get system health metrics
    getSystemHealth: () => {
        return {
            // Retrieve CPU load averages over the last 1, 5, and 15 minutes
            cpuUsage: os.loadavg(), // Note: add parentheses to call the function
            // Calculate total memory and convert to MB
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            // Calculate free memory and convert to MB
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`
        };
    },

    // Method to get application health metrics
    getApplicationHealth: () => {
        return {
            // Get the current environment from config
            Env: config.ENV,
            // Get the uptime of the application in seconds
            uptime: `${process.uptime().toFixed(2)} Seconds`,
            // Get memory usage statistics
            memoryUsage: {
                // Total heap memory allocated
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                // Memory currently used by the heap
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
            }
        };
    }
};
