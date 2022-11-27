export interface IResHouseOwnerTypeData {
    status_code: string;
    status_name: string;
}

export interface IResHouseOwnerType {
    status: number;
    message: string;
    data: IResHouseOwnerTypeData[];
}