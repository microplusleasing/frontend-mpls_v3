export interface IReqFacevalidV2Data {
    file1: string;
    file2: string;
}

export interface IReqFacevalidV2 {
    status: number;
    message: string;
    data: IReqFacevalidV2Data;
}
