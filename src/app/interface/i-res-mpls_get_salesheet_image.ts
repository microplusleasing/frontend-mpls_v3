export interface IResGetsalesheetimage {
    status: number;
    message: string;
    data: IResGetsalesheetimageData[];
}

export interface IResGetsalesheetimageData {
    file_data: {
        data: ArrayBuffer,
        type: string
    }
}

