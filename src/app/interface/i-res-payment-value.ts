export interface IResPaymentValueData {
    value: number;
}

export interface IResPaymentValue {
    status: number;
    message: string;
    data: IResPaymentValueData[];
}

