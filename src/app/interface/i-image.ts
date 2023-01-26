export interface IImageData {
    image_name: string;
    image_type: string;
    image_code: string;
    image_file: any
}

export interface IImage {
    status: number;
    message: string;
    data: IImageData[];
}
