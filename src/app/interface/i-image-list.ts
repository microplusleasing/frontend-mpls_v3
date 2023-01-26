export interface IImageListData {
    image_code: string;
}

export interface IImageList {
    status: number;
    message: string;
    data: IImageListData[];
}


