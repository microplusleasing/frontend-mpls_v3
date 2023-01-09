export interface IResDopaValidStatusData {
    status_code: string[];
}

export interface IResDopaValidStatus {
    status: number;
    message: string;
    data: IResDopaValidStatusData;
}

