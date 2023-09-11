export interface IReqUpdatePersonalInfoDipchip {
    token: string
    username: string
    fromBody: IReqUpdatePersonalInfoDipchipData;
}

export interface IReqUpdatePersonalInfoDipchipData {
    UUID: string
    QUE_KEY_ID: string
    REMARK: string
}