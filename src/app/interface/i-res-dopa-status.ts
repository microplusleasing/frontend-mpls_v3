
export interface IResDopaStatusData {
    first_name: string;
    last_name: string;
    uuid: number;
    time_stamp: Date;
    username: string;
    status_code: string;
    status_desc: string;
    error_msg?: any;
    id: number;
}

export interface IResDopaStatus {
    status: number;
    message: string;
    data: IResDopaStatusData[];
}
