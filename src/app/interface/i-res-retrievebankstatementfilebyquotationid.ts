export interface IResRetrievebankstatementfilebyquotationid {
    status: number
    message: string
    data: IResRetrievebankstatementfilebyquotationidData
}

export interface IResRetrievebankstatementfilebyquotationidData {
    image_name: string
    image_type: string
    image_file: any
}
