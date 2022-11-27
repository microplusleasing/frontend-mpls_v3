export interface IResMasterTitle {
}
export interface IResMasterTitleData {
    title_id: string;
    title_name: string;
    sex: string;
    status_show_rect: string;
    status_show_vat: string;
    status_show_dealer: string;
}

export interface IResMasterTitle {
    status: number;
    message: string;
    data: IResMasterTitleData[];
}
