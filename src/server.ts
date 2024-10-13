/* eslint-disable @typescript-eslint/no-floating-promises */
import app from './app';
import config from './config/config';
import databaseService from './service/databaseService';



const server = app.listen(config.PORT)

;(async ()=>{
    try {
       await databaseService.connect()
       console.log(`Mongoose Connected`)
        console.log(`APPLICATION_STARTED`,{
            meta : {
                PORT : config.PORT,
                SERVER_URL : config.SERVER_URL
            }
        })
    } catch (err) {
        console.error(`APPLICATION_ERROR`, {meta : err})
        server.close((error)=>{
            if (error) {
                console.info(`Server Error`,{meta : error})
            }
            process.exit(1)
        })
    }
})()