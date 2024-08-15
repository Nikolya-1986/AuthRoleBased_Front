export interface IResponseDto<T> {
    isSucceed: boolean,
    status: number,
    message: string,
    data: T,
}