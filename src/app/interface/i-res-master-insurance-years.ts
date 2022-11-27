export interface IResMasterInsuranceYearsData {
    years_insur: number;
    insurer_code: string;
    insurance_code: string
    insurer_name: string;
}

export interface IResMasterInsuranceYears {
    status: number;
    message: string;
    data: IResMasterInsuranceYearsData[];
}
