export interface IResBtwMrtaInfoData {
    seq_item: number;
    quo_key_app_id: string;
    application_num: string;
    dl_branch: string;
    branch_name: string;
    contract_no: string;
    application_date: string;
    create_contract_date: string;
    cust_no: string;
    birth_date_th: string;
    birth_date: Date;
    sex?: any;
    first_name: string;
    last_name: string;
    customer_fullname: string;
    idcard_num: string;
    address1: string;
    address_letter: string;
    sl_code: string;
    dl_name: string;
    motorcycle_brands: string;
    motorcycle_models: string;
    model_year: string;
    model_cc: number;
    colors: string;
    first_installment_paid_date: string;
    last_installment_paid_date: string;
    monthly_txt: string;
    monthly: number;
    period: number;
    out_stand_txt: string;
    out_stand: number;
    down_payment_amount: string;
    chassis_number: string;
    machine_number: string;
    due: string;
    email?: any;
    sms_number?: any;
    phone_number?: any;
    checker_code: string;
    report_date: Date;
    insurance_years: number;
    insurance_t1_cash?: any;
}

export interface IResBtwMrtaInfo {
    status: number;
    message: string;
    data: IResBtwMrtaInfoData[];
}


