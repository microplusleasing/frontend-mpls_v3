export interface IReqCreateCredit {
    quotationid: string;
    brand_code: string;
    brand_name: string;
    model_code: string;
    model_name: string;
    color_name: string;
    loan_amount: number | null;
    product_value: number | null;
    interest_rate: number | null;
    payment_value: number | null;
    payment_round_count: number | null;
    insurance_code: string;
    insurance_year: number | null;
    insurance_plan_price: number | null;
    is_include_loanamount: number | null;
    factory_price: number | null;
    size_model: string;
    insurer_code: string;
    insurer_name: string;
    dealer_code: string;
}


