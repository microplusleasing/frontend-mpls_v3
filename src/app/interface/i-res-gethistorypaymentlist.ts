export interface IResGethistorypaymentlistData {
    hp_no: string;
    reciept_d: Date;
    inst_no: number;
    inst_due?: any;
    cash: number;
    out_stand: number;
    pay_name: string;
    line_number: number;
    pay_code: string;
    round_payment: number;
    out_stand_main: number;
    // client field 
    _txt_type_field: string;
}

export interface IResGethistorypaymentlist {
    status: number;
    message: string;
    currentpage: number;
    pagesize: number;
    rowcount: number;
    pagecount: number;
    data: IResGethistorypaymentlistData[];
}

