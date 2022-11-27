export interface IResMasterQuoatationStatusData {
    status: string;
    statustext: string;
}

export interface IResMasterQuoatationStatus {
    status: number;
    message: string;
    data: IResMasterQuoatationStatusData[];
}

