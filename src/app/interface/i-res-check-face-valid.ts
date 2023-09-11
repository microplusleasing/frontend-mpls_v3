export interface IResCheckFaceValidData {
    isdipchip: boolean;
    isvalid: boolean;
    status: string;
    reason: string;
    face_compare_consent: String;
}

export interface IResCheckFaceValid {
    status: number;
    message: string;
    data: IResCheckFaceValidData;
}
