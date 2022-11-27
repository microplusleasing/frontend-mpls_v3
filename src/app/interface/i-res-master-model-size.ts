export interface IResMasterModelSizeData {
    size: string;
}

export interface IResMasterModelSize {
    status: number;
    message: string;
    data: IResMasterModelSizeData[];
}
