export interface IResMasterModelData {
    brand_name: string
    brand_code: string
    model_code: string
    model: string
    price: number
    engine_no: string
    engine_no_running: string
    chassis_no: string
    chassis_no_running: string
    model_year: string
    cc: number
    motor: number
    motor_number: string
    battery_type: string
    battery_capacity: string
    fuel_type: string
    pro_code: string
}

export interface IResMasterModel {
    status: number;
    message: string;
    data: IResMasterModelData[];
}

