
export interface IMrtaQrBarcodeDataImageFile {
    type: string;
    data: number[];
}

export interface IMrtaQrBarcodeData {
    ref_pay_num: string;
    image_file: IMrtaQrBarcodeDataImageFile[];
    bill_payment: string;
}

export interface IMrtaQrBarcode {
    status: number;
    message: string;
    data: IMrtaQrBarcodeData[];
}
