export interface IResGetMasterMrtaInsurance {
    status: number
    message: string
    data: IResGetMasterMrtaInsuranceData[]
  }
  
  export interface IResGetMasterMrtaInsuranceData {
    insurer_code: string
    insurer_name: string
    insurance_code: string
    age_min: number
    age_max: number
    years_insur: number
    rate_insur: number
    premium_insur: number
    plan: string
  }
  