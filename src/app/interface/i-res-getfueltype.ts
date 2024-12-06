export interface IResGetfueltype {
    status: number
    message: string
    data: IResGetfueltypeData[]
}

export interface IResGetfueltypeData {
    code: string
    detail: string
}
