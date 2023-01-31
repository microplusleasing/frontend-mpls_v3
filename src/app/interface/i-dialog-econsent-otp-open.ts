export interface IDialogEconsentOtpOpen {
    header: string;
    message: string;
    quotationid: string;
    firstname: string;
    lastname: string;
    citizenid: string;
    birthdate: Date | null;
    currentDate: Date;
    application_no: string;
    phone_number: string;
    refid: string;
    button_name: string;
    // === more field for stamp econsent log (addon 28/01/2023) ===
    transaction_no: string; // (quo_app_ref_no)
}
