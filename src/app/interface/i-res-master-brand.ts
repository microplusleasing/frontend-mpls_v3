export interface IResMasterBrandData {
    brand_code: string;
    brand_name: string;
    pro_code: string
}

export interface IResMasterBrand {
    status: number;
    message: string;
    data: IResMasterBrandData[];
}