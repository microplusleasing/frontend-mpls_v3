export interface IResConfirmQrPaymentData {
    application_num: string;
    quotation_id: string;
    contract_no?: any;
    insurance_t_cash: number;
    insurance_b_cash: number;
    krommathun_st_date?: any;
    krommathun_en_date?: any;
    insurer_code: string;
    insurance_year: number;
    item_code: string;
    seller_id: string;
    upd_user: string;
    upd_datetime: Date;
    out_stand: number;
    age: number;
    gender: number;
    pay_status: number;
    active_status: number;
    insurance_code: string;
    barcode_img: any;
    bill_payment: string;
    confirm_by: string;
    confirm_datetime: Date;
}

export interface IResConfirmQrPayment {
    status: number;
    message: string;
    data: IResConfirmQrPaymentData[];
}
