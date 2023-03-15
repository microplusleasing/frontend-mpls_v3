export interface IResGetWitnessEconsentData {
    fname: string;
    lname: string;
    checker_name: string;
}

export interface IResGetWitnessEconsent {
    status: number;
    message: string;
    data: IResGetWitnessEconsentData[];
}
