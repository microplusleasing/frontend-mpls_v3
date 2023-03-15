export interface IResMasterInsuranceOldData {
    insurer_code: string;
    insurer_name: string;
    years_insur: number;
    premium_insur: number;
    insurance_code: string;
    _client_label: string;
    _code_gen: string;
}

export interface IResMasterInsuranceOld {
    status: number;
    message: string;
    data: IResMasterInsuranceOldData[];
}