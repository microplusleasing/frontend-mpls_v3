export interface IResGetAcStatusType {
    status: number
    message: string
    data: IResGetAcStatusTypeData[]
}

export interface IResGetAcStatusTypeData {
    ac_code?: string
    ac_desc: string
}
