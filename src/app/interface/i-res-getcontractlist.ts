export interface IResGetcontractlistData {
    hp_no: string;
    monthly: string;
    first_due: string;
    name: string;
    sname: string;
    latitude: string;
    londtiude: string;
    address?: any;
    line_number: number;
    period: number;
    will_pay_amt: number;
    will_pay_inst: number;
    _client_index: number;
}

export interface IResGetcontractlist {
    data: IResGetcontractlistData[];
    status: number;
    message: string;
    currentpage: number;
    pagesize: number;
    rowcount: number;
    pagecount: number;
}
