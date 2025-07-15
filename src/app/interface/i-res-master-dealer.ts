export interface IResMasterDealerData {
    dl_code: string;
    dl_name: string;
    product_item: string
}

export interface IResMasterDealer {
    status: number;
    message: string;
    data: IResMasterDealerData[];
}


