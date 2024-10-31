export type HttpResponse = {
    code: number,
    message : string, 
    data : unknown,
}

export type HttpError = {
    code : number,
    message : string, 
    data : unknown, 
}