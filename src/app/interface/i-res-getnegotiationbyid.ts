export interface IResGetnegotiationbyidData {
    // cust_no_0: string;
    // hp_no: string;
    // monthly: string;
    // first_due: string;
    // name: string;
    // sname: string;
    // period: number;
    // will_pay_amt: number;
    // will_pay_inst: number;
    // due_date: Date;
    hp_no: string;
    title_id: string;
    tittle_name: string;
    name: string;
    sname: string;
    type_code: string;
    type_name: string;
    branch_code: string;
    branch_name: string;
    month_end: string;
    year_end: string;
    bill_beg: string;
    bill_sub_beg?: any;
    bill_curr: string;
    bill_sub_curr?: any;
    collected_inst: number;
    collected_amt: number;
    collected_date?: any;
    by_bill?: any;
    by_dealer?: any;
    monthly: number;
    will_pay_amt: number;
    will_pay_inst: number;
    first_due: Date;
    total_paid: number;
    term: number;
    account_status?: any;
    stage_no?: any;
    safety_level?: any;
    no_of_overdue?: any;
    col_r_code?: any;
    no_of_sms?: any;
    no_of_contact?: any;
    no_of_appoint?: any;
    flag: string;
    flagname: string;
    cust_no: string;
    perc_pay: number;
    stapay?: any;
    hp_hold?: any;
    nego_id?: any;
    stapay1?: any;
    unp_mrr: number;
    unp_100: number;
    unp_200: number;
    bussiness_code: string;
    dl_code: string;
    rollback_call: string;
    ref_pay_num: string;
    create_contract_date: Date;
    paymentdate: Date;
    // === add idcard on 31/08/2022 ===
    idcard_num: string;
    // === add birth_date 23/02/2023 ===
    birth_date: Date;

}

export interface IResGetnegotiationbyid {
    status: number;
    message: string;
    data: IResGetnegotiationbyidData[];
}


