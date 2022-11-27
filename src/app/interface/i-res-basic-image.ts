export interface IResBasicImageData {
    image_name: string;
    image_type: string;
    image_code: string;
    image_file: any
}

export interface IResBasicImage {
    status: number;
    message: string;
    data: IResBasicImageData[];
}
