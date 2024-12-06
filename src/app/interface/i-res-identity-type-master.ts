export interface IResIdentityTypeMaster {
    status: number
    message: string
    data: IResIdentityTypeMasterData[]
  }
  
  export interface IResIdentityTypeMasterData {
    identity_code: string
    identity_name: string
  }
  