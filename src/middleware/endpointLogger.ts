import { Request, Response, NextFunction } from 'express'
import httpError from '../utils/httpError'
import chalk from 'chalk'

// Helper function to format date in 12-hour format with AM/PM
function getFormattedTimestamp() {
    const now = new Date()
    const hours = now.getHours() // Get hours (0-23)
    const minutes = now.getMinutes() // Get minutes (0-59)
    const seconds = now.getSeconds() // Get seconds (0-59)
    const ampm = hours >= 12 ? 'PM' : 'AM' // Determine AM/PM

    // Convert to 12-hour format
    const hour12 = hours % 12
    const hour = hour12 === 0 ? 12 : hour12 // Convert '0' to '12' for 12-hour format

    // Format minutes and seconds to always be two digits
    const minuteStr = minutes < 10 ? `0${minutes}` : minutes
    const secondStr = seconds < 10 ? `0${seconds}` : seconds

    // Return formatted time string
    return `${now.toLocaleDateString()} ${hour}:${minuteStr}:${secondStr} ${ampm}`
}

export default {
    logger: (req: Request, res: Response, next: NextFunction) => {
        try {
            const start = Date.now() // Start time for latency calculation
            const method = req.method
            const url = req.originalUrl
            const statusCode = res.statusCode

            // Color code the HTTP method and status code
            const methodColor = method === 'GET' ? chalk.green : chalk.yellow // GET in green, POST in yellow
            const statusColor = (status : number) => {
                if (status >= 200 && status < 300) return chalk.green(status) // 2xx status in green
                if (status >= 300 && status < 400) return chalk.cyan(status) // 3xx status in cyan
                if (status >= 400 && status < 500) return chalk.red(status) // 4xx status in red
                return chalk.magenta(status) // 5xx status in magenta
            }

            res.on('finish', () => {
                const latency = Date.now() - start // Latency in milliseconds
                const timeStamp = getFormattedTimestamp()

                // eslint-disable-next-line no-console
                console.log(
                    `[${chalk.blue(timeStamp)}] ${methodColor(method)} ${url} - Status: ${statusColor(statusCode)} - Latency: ${chalk.bold(latency + 'ms')}`
                )
            })

            next() // Pass control to the next middleware or route handler
        } catch (error) {
            httpError(next, error, req, 500)
        }
    }
}

