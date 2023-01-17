import { SafeUrl } from "@angular/platform-browser"

export interface IImageAttachUpload {
    name: string
    image_code: string
    image_header: string
    image_field_name: string
    urlsanitizer: SafeUrl
    src: string
}
// name: item.image_name ?? '',
//     image_code: item.image_code ?? '',
//         image_header: this.temp_master_categories.find((m_image) => m_image.image_code == item.image_code)?.image_header ?? '',
//             image_field_name: item.image_name ?? '',
//                 urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(imageStr),
//                     src: imageStr