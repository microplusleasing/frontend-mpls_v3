export interface IResGeteconsentimagebyid {
    data: IResGeteconsentimagebyidData[]
    status: number
    message: string
}

export interface IResGeteconsentimagebyidData {
    econsent_image: EconsentImage
}

export interface EconsentImage {
    type: string
    data: number[]
}
