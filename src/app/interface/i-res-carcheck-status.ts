export interface IResCarcheckStatusData {
    details: string;
    status: string;
}

export interface IResCarcheckStatus {
    status: number;
    message: string;
    data: IResCarcheckStatusData[];
}
