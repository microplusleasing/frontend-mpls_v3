export interface IResCreateApplicationNoData {
    application_no: string;
}

export interface IResCreateApplicationNo {
    status: number;
    message: string;
    data: IResCreateApplicationNoData[];
}
