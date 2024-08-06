import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzFormModule,
    NzUploadModule,
    NzModalModule,
    NzButtonModule
  ], exports: [
    NzFormModule,
    NzUploadModule,
    NzModalModule,
    NzButtonModule
  ]
})
export class AntDesignMaterialModule { }
