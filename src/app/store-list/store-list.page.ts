import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IStoreMarker } from '../home/home.page';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.page.html',
  styleUrls: ['./store-list.page.scss'],
})
export class StoreListPage implements OnInit {

  storeMarker: IStoreMarker;

  constructor(private navCtrl: NavController,
              private router: Router) {
  }

  ngOnInit() {

    if (this.router.getCurrentNavigation().extras.state) {
      this.storeMarker = this.router.getCurrentNavigation().extras.state.marker;
    }

  }

  onBackClick() {
    this.navCtrl.back();
  }

}
