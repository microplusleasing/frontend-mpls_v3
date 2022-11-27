
    export interface IResQuotationViewData {
        quo_id: number;
        idcard_num: string;
        phone_number: string;
        title_code: string;
        title_name: string;
        first_name: string;
        last_name: string;
        birth_date: Date;
        ciz_issued_date: Date;
        ciz_expired_date: Date;
        ciz_address: string;
        ciz_sub_district: string;
        ciz_district: string;
        ciz_province_name: string;
        ciz_province_code: string;
        quo_status: number;
        quo_living_place_id: string;
        quo_contract_place_id: string;
        quo_working_place_id: string;
        quo_career_id: string;
        quo_credit_id: string;
        quo_image_id: string;
        user_id: number;
        created_time: Date;
        last_updated_time: Date;
        approved_time?: any;
        face_recog_api_id?: any;
        quo_key_app_id: string;
        quo_purpose_id: string;
        quo_consent_id: string;
        line_number: number;
        loan_result: string;
        dl_name: string;
        ref_pay_num: string;
        branch_name: string;
        _client_index: number;
        _client_quo_status: string;
        // === add new 6 fild (maire status, nick name, stay month, stay year , house type , house owner type ) (15/11/2022) ===
        ciz_nickname: string;
        ciz_house_type: number;
        ciz_house_owner_type: number;
        ciz_stayed_year: number;
        ciz_stayed_month: number;
        ciz_maried_status: number;
    }

    export interface IResQuotationView {
        data: IResQuotationViewData[];
        status: number;
        message: string;
        currentpage: number;
        pagesize: number;
        rowcount: number;
        pagecount: number;
    }
