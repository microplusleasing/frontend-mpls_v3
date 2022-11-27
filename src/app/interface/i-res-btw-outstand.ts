export interface IResBtwOutstandData {
    term: number;
    monthly: number;
    out_stand: number;
    value?: any;
}

export interface IResBtwOutstand {
    status: number;
    message: string;
    data: IResBtwOutstandData[];
}

