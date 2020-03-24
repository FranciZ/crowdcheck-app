import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreDetailPageRoutingModule } from './store-detail-routing.module';

import { StoreDetailPage } from './store-detail.page';
import { HistoryCardComponent } from './history-card/history-card.component';
import { MomentModule } from 'ngx-moment';
import { ImageModalPageModule } from '../modals/image-modal/image-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreDetailPageRoutingModule,
    MomentModule,
    ImageModalPageModule
  ],
  declarations: [StoreDetailPage, HistoryCardComponent]
})
export class StoreDetailPageModule {
}
