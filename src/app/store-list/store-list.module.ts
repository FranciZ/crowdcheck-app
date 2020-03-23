import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreListPageRoutingModule } from './store-list-routing.module';

import { StoreListPage } from './store-list.page';
import { StoreListItemComponent } from './store-list-item/store-list-item.component';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreListPageRoutingModule,
    MomentModule
  ],
  declarations: [StoreListPage, StoreListItemComponent]
})
export class StoreListPageModule {}
