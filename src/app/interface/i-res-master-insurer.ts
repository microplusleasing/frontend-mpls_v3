export interface IResMasterInsurerData {
    insurer_code: string;
    insurance_code: string;
    insurer_name: string;
}

export interface IResMasterInsurer {
    status: number;
    message: string;
    data: IResMasterInsurerData[];
}
