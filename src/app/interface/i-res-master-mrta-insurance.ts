export interface IResMasterMrtaInsuranceData {
    application_num: string;
    quotation_id: string;
    contract_no: number;
    insurance_t_cash: number;
    insurance_b_cash: number;
    krommathun_st_date: Date;
    krommathun_en_date: Date;
    insurer_code: string;
    insurance_code: string;
    insurance_year: number;
    item_code: string;
    seller_id: string;
    upd_user_: string;
    upd_datetime: Date;
    out_stand: number;
    age: number;
    gender: number;
    pay_status: number;
    active_status: number;
}

export interface IResMasterMrtaInsurance {
    status: number;
    message: string;
    data: IResMasterMrtaInsuranceData[];
}
