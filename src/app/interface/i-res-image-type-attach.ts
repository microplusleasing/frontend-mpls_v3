export interface IResImageTypeAttachData {
    image_code: string;
    image_header: string;
    client_field_name: string;
}

export interface IResImageTypeAttach {
    status: number;
    message: string;
    data: IResImageTypeAttachData[];
}


