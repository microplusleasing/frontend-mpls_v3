export interface IResMasterRateData {
    rate: number;
}

export interface IResMasterRate {
    status: number;
    message: string;
    data: IResMasterRateData[];
}
