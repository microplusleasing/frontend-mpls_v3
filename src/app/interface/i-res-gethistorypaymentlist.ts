export interface IResGethistorypaymentlistData {
    hp_no: string;
    reciept_d: Date;
    inst_no: number;
    inst_due?: any;
    cash: number;
    out_stand: number;
    pay_name: string;
    line_number: number;
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

