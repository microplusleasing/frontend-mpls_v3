export interface IResMasterBrandData {
    brand_code: string;
    brand_name: string;
}

export interface IResMasterBrand {
    status: number;
    message: string;
    data: IResMasterBrandData[];
}