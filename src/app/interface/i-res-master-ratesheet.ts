export interface IResMasterRatesheetData {
    brand: string;
    modelname: string;
    engine_no: string;
    max_ltv: number;
    premium_insur: number;
    rate: number;
    term: number;
    monthly: number;
}

export interface IResMasterRatesheet {
    status: number;
    message: string;
    data: IResMasterRatesheetData[];
}