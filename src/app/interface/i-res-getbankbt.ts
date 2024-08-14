export interface IResGetbankbt {
    status: number
    message: string
    data: IResGetbankbtData[]
  }
  
  export interface IResGetbankbtData {
    code: string
    name: string
    acronym_th: any
    name_eng: any
    acronym_eng: any
    cancel: string
    upd_user: any
    upd_datetime: string
    br_code: any
    flag_receive: string
  }
  