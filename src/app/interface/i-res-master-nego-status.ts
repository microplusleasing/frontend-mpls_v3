export interface IResMasterNegoStatusData {
    neg_r_code: string;
    neg_r_detail: string;
    group_code: string;
    active_new: string;
    active_collection: string;
}

export interface IResMasterNegoStatus {
    status: number;
    message: string;
    data: IResMasterNegoStatusData[];
}

