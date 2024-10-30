export type Response<T = 0> = {
    message: string
    code: number
    data: T
}
