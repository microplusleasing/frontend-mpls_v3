export interface IQrAdvancePaymentDataImageFile {
    type: string;
    data: number[];
}

export interface IQrAdvancePaymentData {
    ref_pay_num: string;
    image_file: IQrAdvancePaymentDataImageFile[];
    item_price: number;
    name: string;
    sname: string;
    term: number;
    monthly: number;
    first_due: Date;
    due: string;
    bill_payment: string;
}

export interface IQrAdvancePayment {
    status: number;
    message: string;
    data: IQrAdvancePaymentData[];
}
