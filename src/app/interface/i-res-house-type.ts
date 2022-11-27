export interface IResHouseTypeData {
    code: string;
    name: string;
}

export interface IResHouseType {
    status: number;
    message: string;
    data: IResHouseTypeData[];
}
