export interface IResGetMasterBussiness {
    status: number
    message: string
    data: IResGetMasterBussinessData[]
}

export interface IResGetMasterBussinessData {
    bussiness_code: string
    bussiness_name: string
    upd_datetime: string
    upd_user: string
    br_code: string
    score_type: string
    cs_no: string
    credit_process: string
    reprint: string
    gfms_product_code: any
    product_name: string
}
