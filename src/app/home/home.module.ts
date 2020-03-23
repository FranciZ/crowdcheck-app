import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import player from 'lottie-web';

import { HomePage } from './home.page';
import { AppRoutingModule } from '../app-routing.module';
import { AgmCoreModule } from '@agm/core';
import { LottieModule } from 'ngx-lottie';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { CardComponent } from './card/card.component';
import { MomentModule } from 'ngx-moment';
import * as moment from 'moment';

moment.locale('sl-SI');

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LottieModule.forRoot({player: playerFactory}),
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAT3yNDubLAiETu46f03XKk-L2bFZDcrR8'
    }),
    AgmJsMarkerClustererModule,
    MomentModule
  ],
  declarations: [HomePage, CardComponent]
})
export class HomePageModule {
}
