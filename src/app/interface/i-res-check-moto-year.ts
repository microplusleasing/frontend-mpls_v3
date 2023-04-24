export interface IResCheckMotoYear {
    status: number
    message: string
    data: IResCheckMotoYearData
  }
  
  export interface IResCheckMotoYearData {
    result: 'Y' | 'N'
  }
  