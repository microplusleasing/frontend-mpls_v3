export interface IResMasterOccupationData {
    cat_code: string;
    cat_name: string;
}

export interface IResMasterOccupation {
    status: number;
    message: string;
    data: IResMasterOccupationData[];
}


