export interface IResMasterDealerData {
    dl_code: string;
    dl_name: string;
}

export interface IResMasterDealer {
    status: number;
    message: string;
    data: IResMasterDealerData[];
}


