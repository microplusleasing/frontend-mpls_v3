export interface IStampFaceVerificationLog {
    quotationid: string;
    duration: number;
    matched?: Boolean;
    message: string;
    score?: number;
    threshold?: number;
}
