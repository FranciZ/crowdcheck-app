import { Component, OnInit } from '@angular/core';
import { IStore } from '../home/home.page';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.page.html',
  styleUrls: ['./store-detail.page.scss'],
})
export class StoreDetailPage implements OnInit {

  store: IStore;

  constructor(private router: Router,
              private navCtrl: NavController,
              private locationService: LocationService,
              private route: ActivatedRoute) {

  }

  ngOnInit() {

    const routeSub = this.route.params.subscribe(params => {
      console.log(params);
      console.log(params.storeId);
    });
    routeSub.unsubscribe();

    if (this.router.getCurrentNavigation().extras.state) {
      this.store = this.router.getCurrentNavigation().extras.state.store;
    }

  }

  onBackClick() {
    this.navCtrl.back();
  }

  onPhotoChange(event) {
    console.log('Photo change: ', event.target.files[0]);
    this.navCtrl.navigateForward(['new-post'], {
      state: {
        file: event.target.files[0],
        store: this.store
      }
    });
  }

  onNavigateClick() {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${this.store.lat},${this.store.lng}&dirflg=w`);
  }

}
