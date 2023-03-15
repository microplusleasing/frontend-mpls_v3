export interface IResGetaddressncblistData {
    idcard_number: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    address5: string;
    address6: string;
    address7: string;
    address8: string;
    line_number: number;
}

export interface IResGetaddressncblist {
    data: IResGetaddressncblistData[];
    status: number;
    message: string;
    currentpage: number;
    pagesize: number;
    rowcount: number;
    pagecount: number;
}


