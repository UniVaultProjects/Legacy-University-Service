export type AuthServiceResponse<T> = {
    message: string
    code: number
    data: T
}
