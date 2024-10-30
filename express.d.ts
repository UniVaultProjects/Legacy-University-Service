import { UserDetail } from './src/types/user-detail'

declare global {
    namespace Express {
        interface Request {
            user_details: UserDetail
        }
    }
}
