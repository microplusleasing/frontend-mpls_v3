export interface IResCalculateAgeDbData {
    age_year: number;
}

export interface IResCalculateAgeDb {
    status: number;
    message: string;
    data: IResCalculateAgeDbData[];
}
