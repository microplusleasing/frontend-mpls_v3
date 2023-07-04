export interface IResDealerGrade {
}
export interface IResDealerGrade {
    status: number
    message: string
    data: IResDealerGradeData
  }
  
  export interface IResDealerGradeData {
    dl_code: string
    sl_notice_code: string
    sl_notice_detail: string
    notice_image_name: string
    notice_image: IResDealerGradeDataImage
    upd_datetime: string
    upd_user: string
    br_code: string
    active_notice: string
  }
  
  export interface IResDealerGradeDataImage {
    type: string;
    data: number[];
}