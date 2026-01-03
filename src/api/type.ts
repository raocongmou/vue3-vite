export interface requestResultInter<T> {
    code: number,
    data: T,
    msg: string
}