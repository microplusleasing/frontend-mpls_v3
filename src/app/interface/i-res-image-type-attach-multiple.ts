export interface IResImageTypeAttachMultipleData {
    image_id: string
    image_code: string;
    image_header: string;
    client_field_name: string;
}

export interface IResImageTypeAttachMultiple {
    status: number;
    message: string;
    data: IResImageTypeAttachMultipleData[];
}


