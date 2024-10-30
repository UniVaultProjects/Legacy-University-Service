import { Allow } from '../enum/permissions-allowed'

export type Rule = {
    id: string
    allow: Allow[]
}
