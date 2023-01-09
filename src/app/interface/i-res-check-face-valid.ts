export interface IResCheckFaceValidData {
    isdipchip: boolean;
    isvalid: boolean;
    status: string;
    reason: string;
}

export interface IResCheckFaceValid {
    status: number;
    message: string;
    data: IResCheckFaceValidData;
}
