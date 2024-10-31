import { Allow } from '../enum/permissionAllowed'

export type Rule = {
    id: string
    allow: Allow[]
}
