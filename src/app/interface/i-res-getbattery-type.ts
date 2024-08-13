export interface IResGetbatteryType {
    status: number
    message: string
    data: IResGetbatteryTypeData[]
  }
  
  export interface IResGetbatteryTypeData {
    bat_code: string
    bat_detail: string
  }
  