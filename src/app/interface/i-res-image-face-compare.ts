export interface IResImageFaceCompareData {
    file1: string;
    file2: string;
    is_dipchip_channal: string;
}

export interface IResImageFaceCompare {
    status: number;
    message: string;
    data: IResImageFaceCompareData;
}