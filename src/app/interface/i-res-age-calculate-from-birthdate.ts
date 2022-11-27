export interface IResAgeCalculateFromBirthdateData {
    age_year: number;
    value?: any;
}

export interface IResAgeCalculateFromBirthdate {
    status: number;
    message: string;
    data: IResAgeCalculateFromBirthdateData[];
}
