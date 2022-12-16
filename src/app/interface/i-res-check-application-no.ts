export interface IResCheckApplicationNoData {
    application_no: string;
}

export interface IResCheckApplicationNo {
    status: number;
    message: string;
    data: IResCheckApplicationNoData[];
}