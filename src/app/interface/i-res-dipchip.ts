export interface IResDipchipData {
    UUID: string;
    USERNAME: string;
    IMEI_NUMBER: string;
    IMEI_READ_DATE: string;
    PERSONAL_ID: string;
    PERSONAL_THAI_BEGIN_NAME: string;
    PERSONAL_THAI_NAME: string;
    PERSONAL_THAI_SURNAME: string;
    PERSONAL_ENG_BEGIN_NAME: string;
    PERSONAL_ENG_NAME: string;
    PERSONAL_ENG_SURNAME: string;
    PERSONAL_BIRTHDAY: string;
    PERSONAL_GENDER: string;
    PERSONAL_RELIGION: string;
    PERSONAL_AGE_AT_ISSURE: string;
    PERSONAL_AGE_AT_NOW: string;
    HOUSE_NO: string;
    ALLEY: string;
    SOI: string;
    ROAD: string;
    SUB_DISTRICT?: any;
    DISTRICT: string;
    PROVINCE: string;
    ISSUE_DATE: string;
    EXPIRE_DATE: string;
    ISSUE_LOCATION: string;
    REQUEST_NO: string;
    PERSONAL_IMAGE: string;
    STRING_PERSONAL_IMAGE?: any;
    READ_DATA_DATETIME: string;
    FLAG_STSTUS?: any;
    RECORD_DATE: string;
    QUE_KEY_ID: string;
    DIPCHIP_NAME: string;
    LOGID?: any;
    LATITUDE?: any;
    LONGITUDE?: any;
    POST_CODE?: string;
    CARD_CODE?: string;
    DESC?: string;
    PUBLIC_MSH?: string;
}

export interface IResDipchip {
    number: number;
    message: string;
    data: IResDipchipData[];
}

