export interface IResMaxLtvData {
    maxltv: number;
}

export interface IResMaxLtv {
    status: number;
    message: string;
    data: IResMaxLtvData[];
}
