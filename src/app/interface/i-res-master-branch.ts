export interface IResMasterBranchData {
    branch_code: string;
    branch_name: string;
}

export interface IResMasterBranch {
    status: number;
    message: string;
    data: IResMasterBranchData[];
}
