export interface IResNationalityMaster {
    status: number
    message: string
    data: IResNationalityMasterData[]
  }
  
  export interface IResNationalityMasterData {
    nationality_code: string
    nationality_name: string
  }
  