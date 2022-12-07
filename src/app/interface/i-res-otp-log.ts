export interface IResOtpLogData {
    otp_quo_key_app_id: string;
    type: string;
    created_date: Date;
    otp_value: string;
    status: string;
    verified_success_date?: any;
    upd_user: string;
    expire_date: Date;
    otp_app_id: string;
    id: number;
}

export interface IResOtpLog {
    data: IResOtpLogData[];
    status: number;
    message: string;
}

