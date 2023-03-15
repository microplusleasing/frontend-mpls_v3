export interface IResGetphonenolistData {
    phone_no: string;
    ref_customer: string;
    ref_name: string;
    ref_status: string;
    line_number: number;
}

export interface IResGetphonenolist {
    data: IResGetphonenolistData[];
    status: number;
    message: string;
    currentpage: number;
    pagesize: number;
    rowcount: number;
    pagecount: number;
}

