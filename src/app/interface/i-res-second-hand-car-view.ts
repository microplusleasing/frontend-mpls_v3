export interface IResSecondHandCarView {
    data: IResSecondHandCarViewData[]
    status: number
    message: string
    currentpage: number
    pagesize: number
    rowcount: number
    pagecount: number
  }
  
  export interface IResSecondHandCarViewData {
    line_number: number
    reg_no: string
    prov_name: string
    brand_name: string
    model_name: string
    color: string
    cc: number
    engine_number: string
    engine_no_running: string
    chassis_number: string
    chassis_no_running: string
    reg_date: Date
    prov_code: string
    produc: string
    brand_code: string
    model_code: string
    application_num: string
    contract_no: string
    sl_code: string
    auction_code: string
    model_year: string
    moto_year: number
  }
  
