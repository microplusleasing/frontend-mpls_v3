
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin, lastValueFrom } from 'rxjs';
import { IResImageTypeAttachData } from 'src/app/interface/i-res-image-type-attach';
import { IResQuotationDetail } from 'src/app/interface/i-res-quotation-detail';
import { BaseService } from 'src/app/service/base/base.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MasterDataService } from 'src/app/service/master.service';
import imageCompression from 'browser-image-compression';
import { QuotationService } from 'src/app/service/quotation.service';
import { ImageDialogComponent } from 'src/app/widget/dialog/image-dialog/image-dialog.component';
import { IImageAttachUpload } from 'src/app/interface/i-image-attach-upload';
import { IResImageAttachData } from 'src/app/interface/i-res-image-attach';
import { IResImageTypeAttachMultipleData } from 'src/app/interface/i-res-image-type-attach-multiple';
import { IResImageAttachMultipleData } from 'src/app/interface/i-res-image-attach-multiple';
import { HttpErrorResponse } from '@angular/common/http';
import { IImageAttachUploadMultiple } from 'src/app/interface/i-image-attach-upload-multiple';
import { IUserTokenData } from 'src/app/interface/i-user-token';


@Component({
  selector: 'app-image-attach',
  templateUrl: './image-attach.component.html',
  styleUrls: ['./image-attach.component.scss']
})
export class ImageAttachComponent extends BaseService implements OnInit {
  @Input() quotationReq = {} as Observable<IResQuotationDetail>;
  @Output() emitverifyimageattach = new EventEmitter();
  @Output() emitverifysecondhandcarimage = new EventEmitter();

  userSession: IUserTokenData = {} as IUserTokenData

  quotationdatatemp: IResQuotationDetail = {} as IResQuotationDetail

  temp_master_categories: IResImageTypeAttachData[] = [];
  temp_master_categories_multiple: IResImageTypeAttachMultipleData[] = [];
  categories: IResImageTypeAttachData[] = [];
  categoriesMultiple: IResImageTypeAttachMultipleData[] = [];
  recent_image_data: IResImageAttachData[] = [];
  recent_image_multiple_data: IResImageAttachMultipleData[] = [];
  // recent_image_multiple_data: IResImageTypeAttachMultipleData[] = [];
  countload: number = 0;
  currentTypeSelect = {} as IResImageTypeAttachData
  disableUploadBtn: boolean = true
  disableUploadMultipleBtn: boolean = true

  @ViewChild('hiddenInput') hiddenInput: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInputMultiple') fileInputMultiple: ElementRef;
  @ViewChild('fileInputEdit') fileInputEdit: ElementRef;
  @ViewChild('fileInputMultipleEdit') fileInputMultipleEdit: ElementRef;
  uploadedImages: IImageAttachUpload[] = [];
  uploadedImagesMultiple: IImageAttachUploadMultiple[] = [];
  cureentimagecreatecode: string = ''
  cureentimagecreatecodeMultiple: string = ''
  currentimageeditcode: string = ''
  currentimageeditcodeMultiple: string = ''

  selectImage: string = ''
  selectImageMultiple: string = ''

  category = new FormControl('', Validators.required)
  categoryMultiple = new FormControl('', Validators.required)
  image = new FormControl('', Validators.required)
  imageMultiple = new FormControl('', Validators.required)
  verifyImageAttach = new FormControl<boolean>(false, Validators.requiredTrue)
  verifySecondhandCarImageAttach = new FormControl<boolean>(false, Validators.requiredTrue)

  txtrequireimage: string = ''
  txtsecondhandcarheader: string = 'รูปภาพแนบสำหรับรถมือสอง'
  txtrequireimagesecondhandcar: string = ``

  showsecondhandcarimageattach: boolean = false


  uploadForm = this.fb.group({
    category: this.category,
    image: this.image
  });

  uploadMultipleForm = this.fb.group({
    category: this.categoryMultiple,
    image: this.imageMultiple
  });

  imageAttachForm = this.fb.group({
    uploadForm: this.uploadForm,
    uploadMultipleForm: this.uploadMultipleForm
  })

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private quotationService: QuotationService,
    private loadingService: LoadingService,
    public override dialog: MatDialog,
    public override _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer
  ) {
    super(dialog, _snackBar)
    this.hiddenInput = new ElementRef(null);
    this.fileInput = new ElementRef(null);
    this.fileInputMultiple = new ElementRef(null);
    this.fileInputEdit = new ElementRef(null);
    this.fileInputMultipleEdit = new ElementRef(null);
  }

  ngOnInit() {
    this.getUserSessionQuotation().subscribe({
      next: (res_session) => {

        this.userSession = res_session
      }, error: (e) => {

      }, complete: () => {

      }
    }).add(() => {
      this.loadingService.hideLoader();
    })
  }

  onStageChangeFormStepper() {

    if (this.countload == 0) {

      this.uploadedImagesMultiple = []
      this.quotationReq.subscribe({
        next: async (resquo) => {
          this.loadingService.showLoader();
          this.quotationdatatemp = resquo
          const checkquoitem = this.quotationdatatemp.data
          if (checkquoitem) {

            const quoitem = this.quotationdatatemp.data[0]
            const recordExists = '';

            // *** comment on (13/07/2023) use api check busicode instead ****
            // this.showsecondhandcarimageattach = (quoitem.cd_bussiness_code !== '001');
            // this.showsecondhandcarimageattach = (quoitem.cd_bussiness_code === '002' || quoitem.cd_bussiness_code === '003') ? true : false;
            // console.log(`this.showsecondhandcarimageattach : ${this.showsecondhandcarimageattach}`)

            // *** check busicode with api (13/07/2023) ***
            const check_busi_code = await lastValueFrom(this.masterDataService.MPLS_check_busi_code({ quotation_id: quoitem.quo_key_app_id }))

            if (check_busi_code.status == 200) {
              this.showsecondhandcarimageattach = (check_busi_code.data.bussiness_code !== '001');
              this.showsecondhandcarimageattach = (check_busi_code.data.bussiness_code === '002' || check_busi_code.data.bussiness_code === '003') ? true : false;
            }

            // === call parameter data (single and multiple type) ===
            forkJoin([
              this.masterDataService.getImageTypeAttach(),
              this.masterDataService.getImageTypeAttachMultiple()
            ]).subscribe({
              next: ([resimageattach, resimageattachmultiple]) => {

                // *** image attach list (original) ***
                if (resimageattach) {
                  if (resimageattach.data.length !== 0) {
                    this.countload++
                    this.categories = resimageattach.data
                    this.temp_master_categories = resimageattach.data
                  }
                }

                // *** image attach list (multiple) (05/04/2023) ***
                if (resimageattachmultiple) {
                  if (resimageattachmultiple.data.length !== 0) {
                    this.categoriesMultiple = resimageattachmultiple.data
                    this.temp_master_categories_multiple = resimageattachmultiple.data
                  }
                }

                forkJoin([
                  this.quotationService.MPLS_getimagefilebyid(this.quotationdatatemp.data[0].quo_key_app_id),
                  this.quotationService.MPLS_getimage_multiple_filebyid(this.quotationdatatemp.data[0].quo_key_app_id),
                ]).subscribe({
                  next: ([res1, res2]) => {

                    this.loadingService.hideLoader()
                    // console.log(`this is res2 : ${JSON.stringify(res2)}`)

                    // *** recent image (single row) ***
                    if (res1) {

                      // === set exist image data to variable === 
                      this.recent_image_data = res1.data

                      // === remove image type that already exist in select list ===
                      this.categories = resimageattach.data.filter((item) => { return !(res1.data.some((recImage) => recImage.image_code === item.image_code)) })

                      // === create uploadImage photo ===
                      if (res1.data && res1.data.length !== 0) {
                        res1.data.forEach(async (item) => {
                          const imageStr = this._arrayBufferToJpeg(item.image_file.data)
                          // this.uploadedImages.push({
                          //   name: item.image_name ?? '',
                          //   image_code: item.image_code ?? '',
                          //   image_header: this.temp_master_categories.find((m_image) => m_image.image_code == item.image_code)?.image_header ?? '',
                          //   image_field_name: item.image_name ?? '',
                          //   urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(imageStr),
                          //   src: imageStr
                          // })
                          this.uploadedImages.push({
                            name: item.image_name ?? '',
                            image_code: item.image_code ?? '',
                            image_header: (() => {
                              if (item.image_code === '16') {
                                return 'KYC';
                              }
                              const foundImage = this.temp_master_categories.find((m_image) => m_image.image_code == item.image_code);
                              return foundImage?.image_header ?? '';
                            })(),
                            image_field_name: item.image_name ?? '',
                            urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(imageStr),
                            src: imageStr
                          });

                        })
                      }
                    }

                    // *** recent image (multiple row) ***
                    if (res2) {

                      // === set exist image data to variable === 
                      this.recent_image_multiple_data = res2.data

                      // === create uploadImage photo ===
                      if (res2.data && res2.data.length !== 0) {
                        const lastIndex = res2.data.length;
                        res2.data.forEach(async (item, i) => {
                          const imageStr = this._arrayBufferToJpeg(item.image_file.data)
                          const sequence = i === 0 ? lastIndex : lastIndex - (i);
                          this.uploadedImagesMultiple.push({
                            name: item.image_name ?? '',
                            image_code: item.image_code ?? '',
                            image_id: item.image_id ?? '',
                            image_header: `${this.temp_master_categories_multiple.find((m_image) => m_image.image_code == item.image_code)?.image_header} (รูปที่ ${sequence})` ?? '',
                            image_field_name: item.image_name ?? '',
                            urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(imageStr),
                            src: imageStr
                          })
                        })
                      }
                    }

                  }, error: (e) => {
                    this.loadingService.hideLoader()
                    this.snackbarfail(`ไม่สามารถโหลดรายการไฟล์แนบได้ ${e.message ? e.message : 'No return message'}`)
                    console.log(`error :  ${e.message ? e.message : 'No return message'}`)
                  }, complete: () => {
                    console.log(`complete getb image file by id `)
                  }
                })

                // === value Change ===

                this.verifyImageAttach.valueChanges.subscribe((value) => {
                  if (value) {

                  } else {

                  }
                })

                this.uploadForm.valueChanges.subscribe((value) => {
                  if (this.uploadForm.valid) {
                    this.disableUploadBtn = false
                  } else {
                    this.disableUploadBtn = true
                  }
                })

                this.uploadMultipleForm.valueChanges.subscribe((value) => {
                  if (this.uploadMultipleForm.valid) {
                    this.disableUploadMultipleBtn = false
                  } else {
                    this.disableUploadMultipleBtn = true
                  }
                })


                this.uploadForm.controls.category.valueChanges.subscribe((value) => {
                  const cselect = this.categories.find((item) => { return item.image_code == value })
                  if (cselect) {
                    this.currentTypeSelect = cselect
                  }
                })

                this.uploadMultipleForm.controls.category.valueChanges.subscribe((value) => {
                  const cselect = this.categoriesMultiple.find((item) => { return item.image_code == value })
                  if (cselect) {
                    this.currentTypeSelect = cselect
                  }
                })


                // *** check for stamp record data to form ***
                if (!recordExists) {
                  // === no record exist ===
                } else {

                }

                // ===== End ======
              }, error: (e) => {
                console.log(`Error dution call master Image type data : ${e.message ? e.message : 'No return message'}`)
              }, complete: () => {
                console.log(`complete call master Image type`)
              }
            })

          } else {
            this.loadingService.hideLoader()
            console.log(`this record is still no exits`)
          }
        }, error: (err) => {
          this.loadingService.hideLoader()
          this.snackbarfail(`${err.message}`)
        }, complete: () => {
          this.loadingService.hideLoader();
        }
      })
    }

  }



  uploadImage() {
    this.loadingService.showLoader()
    // Get the base64 encoded image data from the form control
    const fileimage = this.uploadForm.controls.image.value ?? '';

    // Create an image element and set its src attribute to a data: URI containing the base64 encoded image data
    const img = document.createElement('img');
    // img.src = `data:image/jpeg;base64,${fileimage}`;
    img.src = `${fileimage}`;

    // === check type of image (create, upload) ====
    // let imagetype = this.checkImageType(this.currentTypeSelect.image_code, this.recent_image_data)


    // Use the onload event of the image to read the data URL and add the image to the uploadedImages array
    img.onload = async () => {

      // === call api create here === 

      const recentSelect = this.categories.find((item) => { return item.image_code == this.uploadForm.controls.category.value ? this.uploadForm.controls.category.value : '' })


      let quotationdata = {
        quotationid: this.quotationdatatemp.data[0].quo_key_app_id ?? '',
        image_code: this.uploadForm.controls.category.value ?? '',
        image_name: recentSelect ? recentSelect.client_field_name : '',
      }
      const itemString = JSON.stringify(quotationdata)
      let fd = new FormData();
      fd.append('item', itemString)
      fd.append('image_file', await this._base64toblob(fileimage))
      this.quotationService.MPLS_create_image_attach_file(fd).subscribe({
        next: async (res_image_create) => {
          if (res_image_create.status == 200) {
            this.snackbarsuccess(`ทำรายการสำเร็จ : ${res_image_create.message ? res_image_create.message : 'No return message'}`)
            // === handle image variable next when success === 
            this.uploadedImages.push({
              name: this.uploadForm.controls.category.value ?? '',
              image_code: this.uploadForm.controls.category.value ?? '',
              image_header: this.currentTypeSelect.image_header ?? '',
              image_field_name: this.currentTypeSelect.client_field_name ?? '',
              urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(img.src),
              src: img.src
            });

            await this.checkimageattachtype()
            this.loadingService.hideLoader()

            // remove category type out from list when is used to upload 
            this.categories = this.categories.filter(category => category.image_code !== this.uploadForm.controls.category.value);

            // === sort UploadedImage ===
            this.uploadedImages.sort((a, b) => {
              return parseInt(a.image_code) - parseInt(b.image_code);
            });

            // === clear all value in form ===
            this.selectImage = ''
            this.uploadForm.reset()
            console.log(`uploadImage: ${this.uploadedImages}`)
          } else {
            this.snackbarfail(`ทำรายการไม่สำเร็จ : ${res_image_create.message ? res_image_create.message : 'No return message'}`)
          }
        }, error: (e) => {
          this.loadingService.hideLoader()
          console.log(JSON.stringify(e))
        }, complete: () => {
          this.loadingService.hideLoader()
          console.log(`complete trigger`)
        }
      })
    };
  }

  async onFileChange(event: any) {
    // Create a FileReader object

    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try {

      const compressedFile = await imageCompression(imageFile, options);
      const reader = new FileReader();

      // Convert the Blob to a base64-encoded image URL
      reader.readAsDataURL(compressedFile);

      // Use the onload event of the FileReader to store the data URL in a variable
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          this.selectImage = reader.result;
          this.uploadForm.controls.image.setValue(this.selectImage);
          this.hiddenInput.nativeElement.value = event.target.files[0].name;
          this.fileInput.nativeElement.value = null;

        }
      };

      // Read the data URL of the selected file
      reader.readAsDataURL(event.target.files[0]);

    } catch (e: any) {
      console.log(`Error when compress image : ${e.message ? e.message : 'No message return'}`)
    }
  }

  onPanelOpen(image: any) {
    console.log(`Expansion panel opened for image: ${image.name}`);
  }

  updateImage(image: any) {

    // == set currentimageeditcode to use in next fn (onFileChangeEdit) ==
    const selectimage = this.uploadedImages.find(img => img == image);

    if (selectimage) {
      this.currentimageeditcode = selectimage.image_code
      this.fileInputEdit.nativeElement.click();
    }

  }

  async onFileChangeEdit(event: any) {

    // === work with fn updateImage for get image_code that edit === 
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try {

      const compressedFile = await imageCompression(imageFile, options);
      const reader = new FileReader();

      // Convert the Blob to a base64-encoded image URL
      reader.readAsDataURL(compressedFile);

      // Use the onload event of the FileReader to store the data URL in a variable
      reader.onload = async () => {
        if (typeof reader.result === 'string') {

          const imagesrc = reader.result

          // === keep current file to stamp when update is fail or stage can't update (quo_status == 1)
          const currentpic = this.uploadedImages.filter((item) => { return (item.image_code == this.currentimageeditcode) })

          this.uploadedImages = this.uploadedImages.map(img => {
            if (img.image_code === this.currentimageeditcode) {
              return {
                ...img,
                urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(imagesrc),
                src: imagesrc
              }
            }
            return img;
          });

          // === call api update here ===

          const imageheader = this.temp_master_categories.find((value) => {
            if (value.image_code == this.currentimageeditcode) {
              return { ...value }
            } else {
              return
            }
          })

          if (imageheader) {

            let quotationdata = {
              quotationid: this.quotationdatatemp.data[0].quo_key_app_id ?? '',
              image_code: imageheader.image_code,
              client_field_name: imageheader.client_field_name
            }
            const itemString = JSON.stringify(quotationdata)
            let fd = new FormData();
            fd.append('item', itemString)
            fd.append('image_file', await this._base64toblob(reader.result))
            this.quotationService.MPLS_update_image_attach_file(fd).subscribe({
              next: (res_image_update) => {
                if (res_image_update.status == 200) {
                  this.snackbarsuccess(`ทำรายการสำเร็จ : ${res_image_update.message ? res_image_update.message : 'No return message'}`)
                  // === handle image variable next when success === 
                } else {
                  this.snackbarfail(`ทำรายการไม่สำเร็จ : ${res_image_update.message ? res_image_update.message : 'No return message'}`)
                  // === set current file when update fail or on stage that can't update image (quo_status = 1) ===

                  if (currentpic.length !== 0) {
                    this.uploadedImages = this.uploadedImages.map(img => {
                      if (img.image_code === this.currentimageeditcode) {
                        return {
                          ...img,
                          urlsanitizer: currentpic[0].urlsanitizer,
                          src: currentpic[0].src
                        }
                      }
                      return img;
                    });
                  }
                  // ===== End ====
                }
              }, error: (e) => {
                // === fail ====
                if (currentpic.length !== 0) {
                  this.uploadedImages = this.uploadedImages.map(img => {
                    if (img.image_code === this.currentimageeditcode) {
                      return {
                        ...img,
                        urlsanitizer: currentpic[0].urlsanitizer,
                        src: currentpic[0].src
                      }
                    }
                    return img;
                  });
                }
                console.log(JSON.stringify(e))
              }, complete: () => {
                console.log(`complete trigger`)
              }
            })
          } else {
            console.log(`not found recent image code edit`)
          }

        }
      };

      // Read the data URL of the selected file
      reader.readAsDataURL(event.target.files[0]);

    } catch (e: any) {
      console.log(`Error when compress image : ${e.message ? e.message : 'No message return'}`)
    }
  }

  deleteImage(image: any) {
    this.loadingService.showLoader()
    let quotationdata = {
      quotationid: this.quotationdatatemp.data[0].quo_key_app_id ?? '',
      image_code: image.image_code ?? ''
    }

    const itemString = JSON.stringify(quotationdata)
    let fd = new FormData();
    fd.append('item', itemString)

    this.quotationService.MPLS_delete_image_attach_file(fd).subscribe({
      next: async (res_delete_image) => {


        if (res_delete_image.status == 200) {
          this.snackbarsuccess(`ทำรายการสำเร็จ : ${res_delete_image.message ? res_delete_image.message : 'No return message'}`)
          // === handle image attach next when delete success ===
          this.uploadedImages = this.uploadedImages.filter(img => img !== image);

          await this.checkimageattachtype()

          this.categories.push
            ({
              image_header: image.image_header ?? '',
              image_code: image.image_code ?? '',
              client_field_name: image.image_field_name ?? ''
            })
          this.categories.sort((a, b) => {
            return parseInt(a.image_code) - parseInt(b.image_code);
          });
        } else {
          // Fail or Error 
          this.snackbarfail(`ทำรายการไม่สำเร็จ : ${res_delete_image.message ? res_delete_image.message : 'No return message'}`)
        }

      }, error: (e) => {
        this.loadingService.hideLoader()
        console.log(`Error : ${e.messsage ? e.message : 'No return message'}`)
      }, complete: () => {
        this.loadingService.hideLoader()
      }
    })
  }

  uploadImageMultiple() {
    // Get the base64 encoded image data from the form control
    this.loadingService.showLoader()
    const fileimage = this.uploadMultipleForm.controls.image.value ?? '';

    // Create an image element and set its src attribute to a data: URI containing the base64 encoded image data
    const img = document.createElement('img');
    // img.src = `data:image/jpeg;base64,${fileimage}`;
    img.src = `${fileimage}`;

    // === check type of image (create, upload) ====
    // let imagetype = this.checkImageType(this.currentTypeSelect.image_code, this.recent_image_data)


    // Use the onload event of the image to read the data URL and add the image to the uploadedImages array
    img.onload = async () => {

      // === call api create here === 

      const recentSelect = this.categoriesMultiple.find((item) => { return item.image_code == this.uploadMultipleForm.controls.category.value ? this.uploadMultipleForm.controls.category.value :'' })


      let quotationdata = {
        quotationid: this.quotationdatatemp.data[0].quo_key_app_id ?? '',
        image_code: this.uploadMultipleForm.controls.category.value ?? '',
        image_name: recentSelect ? recentSelect.client_field_name : '',
      }
      const itemString = JSON.stringify(quotationdata)
      let fd = new FormData();
      fd.append('item', itemString)
      fd.append('image_file', await this._base64toblob(fileimage))
      this.quotationService.MPLS_create_image_attach_file_multiple(fd).subscribe({
        next: async (res_image_create) => {
          if (res_image_create.status == 200) {
            this.snackbarsuccess(`ทำรายการสำเร็จ : ${res_image_create.message ? res_image_create.message : 'No return message'}`)
            // === handle image variable next when success === 
            // const lastIndex = this.uploadedImagesMultiple.length;
            // this.uploadedImagesMultiple.push({
            //   name: this.uploadMultipleForm.controls.category.value ?? '',
            //   image_code: this.uploadMultipleForm.controls.category.value ?? '',
            //   image_header: this.currentTypeSelect.image_header + ` (รูปที่ ${lastIndex})` ?? '',
            //   image_field_name: this.currentTypeSelect.client_field_name ?? '',
            //   urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(img.src),
            //   src: img.src
            // });

            // *** show recent image file (multiple) (from api request) (05/04/2023) ***
            try {
              this.loadingService.showLoader()
              this.uploadedImagesMultiple = []
              const recent_multiple_image = await lastValueFrom(this.quotationService.MPLS_getimage_multiple_filebyid(this.quotationdatatemp.data[0].quo_key_app_id))
              // === set exist image data to variable === 
              this.loadingService.hideLoader()
              this.recent_image_multiple_data = recent_multiple_image.data

              // === create uploadImage photo ===
              if (recent_multiple_image.data && recent_multiple_image.data.length !== 0) {
                const lastIndex = recent_multiple_image.data.length;
                recent_multiple_image.data.forEach(async (item, i) => {
                  const imageStr = this._arrayBufferToJpeg(item.image_file.data)
                  const sequence = i === 0 ? lastIndex : lastIndex - (i);
                  this.uploadedImagesMultiple.push({
                    name: item.image_name ?? '',
                    image_code: item.image_code ?? '',
                    image_id: item.image_id ?? '',
                    image_header: `${this.temp_master_categories_multiple.find((m_image) => m_image.image_code == item.image_code)?.image_header} (รูปที่ ${sequence})` ?? '',
                    image_field_name: item.image_name ?? '',
                    urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(imageStr),
                    src: imageStr
                  })
                })
              }

            } catch (e: any) {
              this.loadingService.hideLoader()
              this.snackbarfail(`Error: ทำการอัพโหลดภาพไม่สำเร็จ : ${e.message ? e.message : 'No return Msg'}`)
            }

            await this.checkimageattachtype()

            this.loadingService.hideLoader()
            // remove category type out from list when is used to upload 
            // this.categoriesMultiple = this.categoriesMultiple.filter(category => category.image_code !== this.uploadMultipleForm.controls.category.value);

            // === sort UploadedImage ===
            this.uploadedImagesMultiple.sort((a, b) => {
              return parseInt(a.image_code) - parseInt(b.image_code);
            });

            // === clear all value in form ===
            this.selectImageMultiple = ''
            this.uploadMultipleForm.reset()
            console.log(`uploadImage: ${this.uploadedImagesMultiple}`)
          } else {
            this.snackbarfail(`ทำรายการไม่สำเร็จ : ${res_image_create.message ? res_image_create.message : 'No return message'}`)
          }
        }, error: (e) => {
          this.loadingService.hideLoader()
          console.log(JSON.stringify(e))
        }, complete: () => {
          this.loadingService.hideLoader()
          console.log(`complete trigger`)
        }
      })
    };
  }

  async onFileChangeMultiple(event: any) {
    // Create a FileReader object

    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try {

      const compressedFile = await imageCompression(imageFile, options);
      const reader = new FileReader();

      // Convert the Blob to a base64-encoded image URL
      reader.readAsDataURL(compressedFile);

      // Use the onload event of the FileReader to store the data URL in a variable
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          this.selectImageMultiple = reader.result;
          this.uploadMultipleForm.controls.image.setValue(this.selectImageMultiple);
          this.hiddenInput.nativeElement.value = event.target.files[0].name;
          this.fileInputMultiple.nativeElement.value = null;

        }
      };

      // Read the data URL of the selected file
      reader.readAsDataURL(event.target.files[0]);

    } catch (e: any) {
      console.log(`Error when compress image : ${e.message ? e.message : 'No message return'}`)
    }
  }

  onPanelOpenMultiple(image: any) {
    console.log(`Expansion panel opened for image: ${image.name}`);
  }

  updateImageMultiple(image: any) {

    // == set currentimageeditcode to use in next fn (onFileChangeEdit) ==
    const selectimage = this.uploadedImagesMultiple.find(img => img == image);

    if (selectimage) {
      // this.currentimageeditcodeMultiple = selectimage.image_code
      this.currentimageeditcodeMultiple = selectimage.image_id
      this.fileInputMultipleEdit.nativeElement.click();
    }

  }

  async onFileChangeMultipleEdit(event: any) {

    // === work with fn updateImage for get image_code that edit === 
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try {

      const compressedFile = await imageCompression(imageFile, options);
      const reader = new FileReader();

      // Convert the Blob to a base64-encoded image URL
      reader.readAsDataURL(compressedFile);

      // Use the onload event of the FileReader to store the data URL in a variable
      reader.onload = async () => {
        if (typeof reader.result === 'string') {

          const imagesrc = reader.result

          // === keep current file to stamp when update is fail or stage can't update (quo_status == 1)
          // const currentpic = this.uploadedImagesMultiple.filter((item) => { return (item.image_code == this.currentimageeditcodeMultiple) })
          const currentpic = this.uploadedImagesMultiple.filter((item) => { return (item.image_id == this.currentimageeditcodeMultiple) })

          this.uploadedImagesMultiple = this.uploadedImagesMultiple.map(img => {
            if (img.image_id === this.currentimageeditcodeMultiple) {
              return {
                ...img,
                urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(imagesrc),
                src: imagesrc
              }
            }
            return img;
          });

          // === call api update here ===

          const checkimageid = this.currentimageeditcodeMultiple

          if (checkimageid) {

            let quotationdata = {
              quotationid: this.quotationdatatemp.data[0].quo_key_app_id ?? '',
              image_id: this.currentimageeditcodeMultiple
            }
            const itemString = JSON.stringify(quotationdata)
            let fd = new FormData();
            fd.append('item', itemString)
            fd.append('image_file', await this._base64toblob(reader.result))
            this.quotationService.MPLS_update_image_attach_file_multiple(fd).subscribe({
              next: (res_image_update) => {
                if (res_image_update.status == 200) {
                  this.snackbarsuccess(`ทำรายการสำเร็จ : ${res_image_update.message ? res_image_update.message : 'No return message'}`)
                  // === handle image variable next when success === 
                } else {
                  this.snackbarfail(`ทำรายการไม่สำเร็จ : ${res_image_update.message ? res_image_update.message : 'No return message'}`)
                  // === set current file when update fail or on stage that can't update image (quo_status = 1) ===

                  if (currentpic.length !== 0) {
                    this.uploadedImagesMultiple = this.uploadedImagesMultiple.map(img => {
                      if (img.image_code === this.currentimageeditcodeMultiple) {
                        return {
                          ...img,
                          urlsanitizer: currentpic[0].urlsanitizer,
                          src: currentpic[0].src
                        }
                      }
                      return img;
                    });
                  }
                  // ===== End ====
                }
              }, error: (e) => {
                // === fail ====
                if (currentpic.length !== 0) {
                  this.uploadedImagesMultiple = this.uploadedImagesMultiple.map(img => {
                    if (img.image_code === this.currentimageeditcodeMultiple) {
                      return {
                        ...img,
                        urlsanitizer: currentpic[0].urlsanitizer,
                        src: currentpic[0].src
                      }
                    }
                    return img;
                  });
                }
                console.log(JSON.stringify(e))
              }, complete: () => {
                console.log(`complete trigger`)
              }
            })
          } else {
            console.log(`not found recent image code edit`)
          }

        }
      };

      // Read the data URL of the selected file
      reader.readAsDataURL(event.target.files[0]);

    } catch (e: any) {
      console.log(`Error when compress image : ${e.message ? e.message : 'No message return'}`)
    }
  }

  deleteImageMultiple(image: any) {
    // *** waiting ***
  }

  openimagedialog(image: any) {
    const imageselect = this.uploadedImages.filter(img => img == image)

    if (imageselect) {
      this.dialog.open(ImageDialogComponent, {
        data: {
          header: '',
          message: '',
          imageurl: imageselect[0].src,
          button_name: 'Ok'
        }
      }).afterClosed().subscribe(result => {
        // === do nothing ==
      });
    }
  }
  openimageMultipledialog(image: any) {
    const imageselect = this.uploadedImagesMultiple.filter(img => img == image)

    if (imageselect) {
      this.dialog.open(ImageDialogComponent, {
        data: {
          header: '',
          message: '',
          imageurl: imageselect[0].src,
          button_name: 'Ok'
        }
      }).afterClosed().subscribe(result => {
        // === do nothing ==
      });
    }
  }


  checkImageType(image_code: string, recent_image_list: IResImageAttachData[]): string {
    // === check with exist image from api MPLS_getimagefilebyid === 
    let imagetype = ''

    const imagetypechk = recent_image_list.find(item => item.image_code == image_code)

    imagetype = imagetypechk ? 'edit' : 'create';

    return imagetype
  }

  async checkimageattachtype() {
    console.log(``)

    // *** add check image attach of second hand car at lease 2 image (05/04/2023) ***
    let checkverifysecondhandcarimage: boolean

    (this.quotationdatatemp.data[0].cd_bussiness_code !== '001') ? checkverifysecondhandcarimage = true : checkverifysecondhandcarimage = false

    const checkverifysecondhandcarimagelist = this.uploadedImagesMultiple.filter((item) => { return (item.image_code == '12') })
    const checkverifyimage = this.uploadedImages.filter((item) => { return (item.image_code == '01' || item.image_code == '03' || item.image_code == '09' || item.image_code == '10') })

    if (checkverifyimage.length == 4) {
      // === set flag via api to update QUO_IMAGE_ATTACH_VERIFY TO 'Y' === SUCCESS DO NEXT PROCESS

      this.quotationService.MPLS_update_flag_image_attach_file(this.quotationdatatemp.data[0].quo_key_app_id ?? '').subscribe({
        next: (res_update_flag_image) => {
          if (res_update_flag_image.status == 200) {
            // === success ===
            // this.snackbarsuccesscenter(`ทำรายการสำเร็จ : ${res_update_flag_image.message}`)
            // this.snackbarsuccesscenter(`ทำรายการสำเร็จ`)
            this.verifyImageAttach.setValue(true)
            this.emitverifyimageattach.emit(true)
            this.txtrequireimage = ''

            // *** secondhand car handle ***
            if (checkverifysecondhandcarimage) {
              if (checkverifysecondhandcarimagelist.length >= 2) {
                this.quotationService.MPLS_update_flag_image_attach_file_multiple(this.quotationdatatemp.data[0].quo_key_app_id ?? '').subscribe({
                  next: (res_update_second_hand_verify) => {
                    if (res_update_second_hand_verify.status == 200) {
                      this.txtrequireimagesecondhandcar = ''
                      this.emitverifysecondhandcarimage.emit(true)
                    }
                  }, error: (e) => {

                  }, complete: () => {

                  }
                })
              }
            }
          } else {
            // === fail ===
            this.snackbarfailcenter(`ทำรายการไม่สำเร็จ : ${res_update_flag_image.message}`)
          }
        }, error: (e) => {

        }, complete: () => {

        }
      })
    } else {
      // === set flag via api to update QUO_IMAGE_ATTACH_VERIFY TO '' === SUCCESS DO NEXT PROCESS

      this.quotationService.MPLS_update_flag_image_attach_file(this.quotationdatatemp.data[0].quo_key_app_id ?? '').subscribe({
        next: (res_update_flag_image) => {
          if (res_update_flag_image.status == 200) {
            // === success ===
            // this.snackbarsuccesscenter(`ทำรายการสำเร็จ : ${res_update_flag_image.message}`)
            // this.snackbarsuccesscenter(`ทำรายการสำเร็จ`)

            // *** secondhand car handle ***
            if (checkverifysecondhandcarimage) {
              if (checkverifysecondhandcarimagelist.length >= 2) {
                this.quotationService.MPLS_update_flag_image_attach_file_multiple(this.quotationdatatemp.data[0].quo_key_app_id ?? '').subscribe({
                  next: (res_update_second_hand_verify) => {
                    if (res_update_second_hand_verify.status == 200) {
                      this.txtrequireimagesecondhandcar = ''
                      this.emitverifysecondhandcarimage.emit(true)
                    }
                  }, error: (e) => {

                  }, complete: () => {

                  }
                })
              }
            }
          } else {
            // === fail ===
            this.verifyImageAttach.setValue(false)
            this.emitverifyimageattach.emit(false)
          }
        }, error: (e) => {

        }, complete: () => {

        }
      })
    }
  }

}
