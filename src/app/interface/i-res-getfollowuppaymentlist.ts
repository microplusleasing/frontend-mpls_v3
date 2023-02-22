export interface IResGetfollowuppaymentlistData {
    hp_no: string;
    cust_id: string;
    phone_no: string;
    con_r_code: string;
    rec_day: Date;
    call_date: string;
    rec_date: string;
    user_name: string;
    neg_r_code: string;
    staff_id: string;
    appoint_date: Date;
    message1: string;
    message2?: any;
    pay: number;
    emp_name: string;
    emp_lname: string;
    neg_r_detail: string;
    line_number: number;
}

export interface IResGetfollowuppaymentlist {
    data: IResGetfollowuppaymentlistData[];
    status: number;
    message: string;
    currentpage: number;
    pagesize: number;
    rowcount: number;
    pagecount: number;
}

