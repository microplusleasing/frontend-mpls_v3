export interface IResChecksendcarimagelist {
  data: IResChecksendcarimagelistData[]
  status: number
  message: string
  currentpage: number
  pagesize: number
  rowcount: number
  pagecount: number
}

export interface IResChecksendcarimagelistData {
  line_number: number
  idcard_num: string
  created_time: string
  contract_no: string
  application_num: string
  create_contract_date: string
  cust_name: string
  branch_name: string
  checker_code: string
  checker_name: string
  ac_status?: string
  ac_status_text?: string
  quo_key_app_id: string
}
