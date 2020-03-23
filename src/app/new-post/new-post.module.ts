import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPostPageRoutingModule } from './new-post-routing.module';

import { NewPostPage } from './new-post.page';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPostPageRoutingModule,
    FileUploadModule
  ],
  declarations: [NewPostPage]
})
export class NewPostPageModule {}
