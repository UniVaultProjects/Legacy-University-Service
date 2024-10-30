import { UserType } from '../enum/user-type'
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
