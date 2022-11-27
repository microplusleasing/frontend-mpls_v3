export interface IResMariedStatusData {
    code: string;
    name: string;
}

export interface IResMariedStatus {
    status: number;
    message: string;
    data: IResMariedStatusData[];
}
