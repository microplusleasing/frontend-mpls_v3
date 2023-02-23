export interface IUserTokenData {
    USERID: string;
    USERNAME: string;
    FNAME: string;
    LNAME: string;
    EMAIL: string;
    RADMIN?: any;
    ROLE: string;
    STATUS: string;
    EXPIRE_DATE: string;
    channal: string;
    FULLNAME: string;
    SELLER_ID: string;
    ID: string;
}

export interface IUserToken {
    token: string;
    data: IUserTokenData;
    status: number;
    message: string;
}

