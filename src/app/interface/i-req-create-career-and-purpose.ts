export interface IReqCreateCareerAndPurpose {
  // === career Path ===
  quotationid: string
  main_career_code: string
  main_career_name: string
  main_department: string
  main_experience_month: number | null
  main_experience_year: number | null
  main_leader_name: string
  main_position: string
  main_salary_per_day: number | null
  main_salary_per_month: number | null
  main_work_per_week: number | null
  main_workplace_name: string
  is_sub_career: number
  sub_career_code: string // career form (stamp via code , sync master data)
  sub_career_name: string
  sub_department: string
  sub_experience_month: number | null
  sub_experience_year: number | null
  sub_leader_name: string
  sub_position: string
  sub_salary_per_day: number | null
  sub_salary_per_month: number | null
  sub_work_per_week: number | null
  sub_workplace_name: string
  main_workplace_phone_no_1: string;
  main_workplace_phone_no_2: string;
  book_bank_account_no: string;
  bank_account_name: string;
  bank_account_branch: string;
  // === purpose Path ===
  car_user: string, // career form (stamp via code , sync master data)
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
  purpose_buy_other: string
  purpose_buy_name: string
  reason_buy: string
  reason_buy_etc: string
  second_referral_fullname: string
  second_referral_phone_no: string
  second_referral_relation: string
}
