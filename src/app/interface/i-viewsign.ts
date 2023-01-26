export interface IViewsignData {
    id: number;
    app_key_id: string;
    cons_quo_key_app_id: string;
    customer_name?: any;
    frist_name?: any;
    last_name?: any;
    is_credit_consent?: any;
    is_final_consent?: any;
    is_disclosure_consent?: any;
    is_personal_disclosure_consent?: any;
    signature_image: any;
    created_time: Date;
    first_name?: any;
    witness_image: any;
    verify_status: number;
    verify_by: string;
    vertify_datetime: string;
}

export interface IViewsign {
    data: IViewsignData[];
    status: number;
    message: string;
}

