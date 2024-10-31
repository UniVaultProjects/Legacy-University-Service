import { UserType } from '../enum/userType'
import { Rule } from './rule'

export type UserDetail = {
    iss: string
    exp: number
    iat: number
    email: string
    sub: string
    user_type: UserType
    permissions: {
        institutes: Rule[]
        courses: Rule[]
    }
}
