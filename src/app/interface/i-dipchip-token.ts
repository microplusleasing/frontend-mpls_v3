

export interface IDipchipTokenData {
    userid: string;
    token_key: string;
}

export interface IDipchipToken {
    status: number;
    message: string;
    data: IDipchipTokenData[];
}