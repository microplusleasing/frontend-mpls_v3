export interface IResInsuranceData {
    application_num: string;
    net_finance: number;
    monthly: number;
    rate_charge: number;
    term: number;
    first_due: Date;
    brand_code: string;
    modelcode: string;
    model_name: string;
    insurance_years: number;
    insurer_name: string;
    tl_t1: number;
    coverage_total_loss: number;
}

export interface IResInsurance {
    status: number;
    message: string;
    data: IResInsuranceData[];
}

