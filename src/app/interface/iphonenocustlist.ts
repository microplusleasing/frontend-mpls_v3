export interface IphonenolistcustData {
    phone_no: string;
    cust_id: string;
    name: string;
    sname: string;
    line_number: number;
}

export interface Iphonenocustlist {
    data: IphonenolistcustData[];
    status: number;
    message: string;
    currentpage: number;
    pagesize: number;
    rowcount: number;
    pagecount?: any;
}
