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
    insurance_name: string;
    insurance_year: number | null;
    insurance_plan_price: number | null;
    is_include_loanamount: number | null;
    factory_price: number | null;
    size_model: string;
    insurer_code: string;
    insurer_name: string;
    coverage_total_loss: number | null;
    max_ltv: number | null;
    price_include_vat: number | null;
    engine_number: string;
    chassis_number: string;
    engine_no_running: string;
    chassis_no_running: string;
    dealer_code: string;
    checker_id: string;

    bussiness_code: string;
    bussiness_name: string;
    model_year: string;
    cc: number | null;
    reg_no: string;
    reg_date: Date;
    contract_ref: string;
    reg_mile: number | null;
    prov_code: string;
    prov_name: string;
    moto_year: number | null;
    grade_moto: string;
    is_over_max_ltv: 'Y' | 'N';
    over_max_ltv_reason: string;
    motor_number: string
    model_description: string

    /* ... add on fuel_type, motor_power, battery_type, battery_capacity (09/07/2024) ... */
    fuel_type: string
    motor_power: number | null;
    battery_type: string
    battery_capacity: number | null;
}


