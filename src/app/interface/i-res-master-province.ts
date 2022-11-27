export interface IResMasterProvinceData {
    prov_code: string;
    prov_name: string;
}

export interface IResMasterProvince {
    status: number;
    message: string;
    data: IResMasterProvinceData[];
}

