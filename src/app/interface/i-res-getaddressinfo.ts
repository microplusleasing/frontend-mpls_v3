export interface IResGetaddressinfoData {
    quotationid: string;
    applicationno: string;
    // idcard_num: string;
    // application_num: string;
    // quo_key_app_id: string;
    // first_name: string;
    // last_name: string;
    address: string;
    latitude: string;
    londtiude: string;
    sub_district: string;
    district: string;
    postal_code: string;
    province_code: string;
}

export interface IResGetaddressinfo {
    status: number;
    message: string;
    data: IResGetaddressinfoData[];
}

