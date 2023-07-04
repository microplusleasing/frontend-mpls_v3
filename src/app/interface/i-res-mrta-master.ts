export interface IResMrtaMaster {
    status: number
    message: string
    data: IResMrtaMasterData[]
  }
  
  export interface IResMrtaMasterData {
    insurer_code: string
    insurance_code: string
    plan: string
  }
  