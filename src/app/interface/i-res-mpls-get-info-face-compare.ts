export interface IResMplsGetInfoFaceCompare {
    status: number
    message: string
    data: IResMplsGetInfoFaceCompareData
  }
  
  export interface IResMplsGetInfoFaceCompareData {
    first_name: string
    last_name: string
    idcard_num: string
    quo_consent_face_compare_date: Date | null
  }
  