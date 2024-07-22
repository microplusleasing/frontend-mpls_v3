export interface IReqUpdateCreditAndPurpose {
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
    /*... purpose ... */
    car_user: string,
    car_user_citizen_id: string
    car_user_district: string
    car_user_floor: string
    car_user_home_name: string
    car_user_home_no: string
    car_user_moo: string
    car_user_name: string
    car_user_name_2: string
    car_user_phone_no: string
    car_user_postal_code: string
    car_user_province_code: string
    car_user_province_name: string
    car_user_relation: string
    car_user_road: string
    car_user_room_no: string
    car_user_soi: string
    car_user_sub_district: string
    first_referral_fullname: string
    first_referral_phone_no: string
    first_referral_relation: string
    purpose_buy: string
    purpose_buy_name: string
    reason_buy: string
    reason_buy_etc: string
    second_referral_fullname: string
    second_referral_phone_no: string
    second_referral_relation: string
}
