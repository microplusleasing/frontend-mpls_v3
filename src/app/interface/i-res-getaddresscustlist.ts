export interface IResGetaddresscustlistData {
    hp_no: string;
    cust_id: string;
    addr_type_code: string;
    addr_type_name: string;
    prov_name: string;
    addr_no: string;
    home_no: string;
    home_name: string;
    sai?: any;
    trok?: any;
    mhod: string;
    road?: any;
    kwang: string;
    khet: string;
    prov_code: string;
    post_code: string;
    latitude?: any;
    longitude?: any;
    line_number: number;
    _client_index: number;
}

export interface IResGetaddresscustlist {
    status: number;
    message: string;
    currentpage: number;
    pagesize: number;
    rowcount: number;
    pagecount: number;
    data: IResGetaddresscustlistData[];
}

