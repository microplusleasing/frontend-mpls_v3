export interface IResMasterTermData {
    term: number;
}

export interface IResMasterTerm {
    status: number;
    message: string;
    data: IResMasterTermData[];
}