export interface IQrTotalLossDataImageFile {
    type: string;
    data: number[];
}

export interface IQrTotalLossData {
    ref_pay_num: string;
    image_file: IQrTotalLossDataImageFile[];
    bill_payment: string;
    item_price: number;
    name: string;
    sname: string;
}

export interface IQrTotalLoss {
    status: number;
    message: string;
    data: IQrTotalLossData[];
}
