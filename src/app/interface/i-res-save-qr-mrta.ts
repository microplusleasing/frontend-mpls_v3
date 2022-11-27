export interface ImageFile {
    type: string;
    data: number[];
}

export interface IResSaveQrMrtaData {
    ref_pay_num: string;
    image_file: ImageFile[];
    bill_payment: string;
}

export interface IResSaveQrMrta {
    status: number;
    message: string;
    data: IResSaveQrMrtaData[];
}

