export interface IResMasterMrtaSellerData {
    emp_id: string;
    fullname: string;
    life_licensed_no: string;
    life_start_date: Date;
    life_end_date: Date;
}

export interface IResMasterMrtaSeller {
    status: number;
    message: string;
    data: IResMasterMrtaSellerData[];

}