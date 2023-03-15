export interface IResGetnegotiationlistData {
    rec_date: Date;
    status_recall?: any;
    appoint_date?: any;
    message1: string;
    message2?: any;
    pay: number;
    line_number: number;
}

export interface IResGetnegotiationlist {
    data: IResGetnegotiationlistData[];
    status: number;
    message: string;
    currentpage: number;
    pagesize: number;
    rowcount: number;
    pagecount: number;
}

