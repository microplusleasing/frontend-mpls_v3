export interface IResImageAttachData {
    image_name: string;
    image_type: string;
    image_code: string;
    image_file: {
        data: ArrayBuffer,
        type: string
    }
}

export interface IResImageAttach {
    status: number;
    message: string;
    data: IResImageAttachData[];
}
