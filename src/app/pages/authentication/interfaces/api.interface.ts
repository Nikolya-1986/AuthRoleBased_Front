export interface IApiDto<T> {
    isSucceed: boolean,
    status: number,
    message: string,
    data: T,
}