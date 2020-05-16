export interface ApiResponse<T> {
    result: T,
    status: Status
}

export enum Status {
    success,
    failure
}