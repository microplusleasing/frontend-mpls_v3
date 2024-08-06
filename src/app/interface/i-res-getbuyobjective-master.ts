export interface IResGetbuyobjectiveMaster {
    status: number
    message: string
    data: IResGetbuyobjectiveMasterData[]
  }
  
  export interface IResGetbuyobjectiveMasterData {
    code: string
    code_client: string
    name: string
    upd_datetime?: string
    upd_user?: string
    br_code?: string
    product_code: string
  }
  