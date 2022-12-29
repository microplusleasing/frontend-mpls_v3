
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-image-attach',
  templateUrl: './image-attach.component.html',
  styleUrls: ['./image-attach.component.scss']
})
export class ImageAttachComponent implements OnInit {
  categories = [
    { value: 'category1', label: 'Category 1' },
    { value: 'category2', label: 'Category 2' },
    { value: 'category3', label: 'Category 3' },
    { value: 'category4', label: 'Category 4' },
    { value: 'category5', label: 'Category 5' }
  ];
  categoriestemp = [
    { value: 'category1', label: 'Category 1' },
    { value: 'category2', label: 'Category 2' },
    { value: 'category3', label: 'Category 3' },
    { value: 'category4', label: 'Category 4' },
    { value: 'category5', label: 'Category 5' }
  ];

  @ViewChild('hiddenInput') hiddenInput: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  uploadedImages: any[] = [];

  selectImage: string = ''

  category = new FormControl('', Validators.required)
  image = new FormControl('', Validators.required)

  uploadForm = this.formBuilder.group({
    category: this.category,
    image: this.image
  });

  constructor(
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer) {
      this.hiddenInput = new ElementRef(null);
    this.fileInput = new ElementRef(null);
  }

  ngOnInit() {
  }

  

  onSubmit() {
    // Get the base64 encoded image data from the form control
    const fileimage = this.uploadForm.controls.image.value ?? '';
  
    // Create an image element and set its src attribute to a data: URI containing the base64 encoded image data
    const img = document.createElement('img');
    // img.src = `data:image/jpeg;base64,${fileimage}`;
    img.src = `${fileimage}`;
  
    // Use the onload event of the image to read the data URL and add the image to the uploadedImages array
    img.onload = () => {
      this.uploadedImages.push({
        name: this.uploadForm.controls.category.value ?? '',
        urlsanitizer: this.sanitizer.bypassSecurityTrustUrl(img.src),
        src: img.src
      });

      // remove category type out from list when is used to upload 
      this.categories = this.categories.filter(category => category.value !== this.uploadForm.controls.category.value);
    };
  }

  onFileChange(event: any) {
    // Create a FileReader object
    const reader = new FileReader();
  
    // Use the onload event of the FileReader to store the data URL in a variable
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.selectImage = reader.result;
        this.uploadForm.controls.image.setValue(this.selectImage);
        this.hiddenInput.nativeElement.value = event.target.files[0].name;
        this.fileInput.nativeElement.value = null;
      }
    };
  
    // Read the data URL of the selected file
    reader.readAsDataURL(event.target.files[0]);
  }

  onPanelOpen(image: any) {
    console.log(`Expansion panel opened for image: ${image.name}`);
  }

  deleteImage(image: any) {
    this.uploadedImages = this.uploadedImages.filter(img => img !== image);
    this.categories.push({value: this.uploadForm.controls.category.value ?? '', label: this.uploadForm.controls.category.value ?? ''})
  }
}
