export interface IResMasterImageTypeData {
    image_code: string;
    image_header: string;
    client_field_name: string;
}

export interface IResMasterImageType {
    status: number;
    message: string;
    data: IResMasterImageTypeData[];
}


