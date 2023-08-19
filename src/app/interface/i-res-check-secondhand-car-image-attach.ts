export interface IResCheckSecondhandCarImageAttach {
    data: IResCheckSecondhandCarImageAttachData
    status: boolean
    valid: boolean
    contract_ref_change: boolean
    message: string
    newcase: boolean
  }
  
  export interface IResCheckSecondhandCarImageAttachData {
    quotationid: string
    creditid: string
    valid_field: string
  }
  