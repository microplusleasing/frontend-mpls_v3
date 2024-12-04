export interface IResGetcustomerfaceimage {
    data: {
      citizen_file: {
        title_name: string;
        first_name: string;
        last_name: string;
        cizcard_image: {
          type: string;
          data: ArrayBuffer;
        };
      };
      facecompare_file: {
        image_file: {
          type: string;
          data: ArrayBuffer;
        };
      };
    };
    status: number;
    message: string;
  }