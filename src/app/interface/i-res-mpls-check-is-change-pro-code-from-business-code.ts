export interface IResMPLSCheckIsChangeProCodeFromBusinessCode {
    status: number
    message: string
    data: IResMPLSCheckIsChangeProCodeFromBusinessCodeData
  }

export interface IResMPLSCheckIsChangeProCodeFromBusinessCodeData {
  isProcodeChange: boolean
  recentProCode: string
}
  