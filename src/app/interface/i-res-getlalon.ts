export interface IResGetlalonData {
    quo_id: number;
    idcard_num: string;
    application_num: string;
    quo_key_app_id: string;
    first_name: string;
    last_name: string;
    latitude: string;
    londtiude: string;
}

export interface IResGetlalon {
    status: number;
    message: string;
    data: IResGetlalonData[];
}

