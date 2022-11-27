
export interface IResDopaStatusData {
    first_name: string;
    last_name: string;
    status_desc: string;
}

export interface IResDopaStatus {
    status: number;
    message: string;
    data: IResDopaStatusData[];
}
