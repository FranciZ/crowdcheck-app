import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IStore, IStoreMarker, StoreBusyStatus } from '../home.page';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-card, [app-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() storeMarker: IStoreMarker;

  constructor(private router: Router,
              private navCtrl: NavController) {
  }

  ngOnInit() {
  }

  onPhotoChange(event) {
    console.log('Photo change: ', event.target.files[0]);
    this.navCtrl.navigateForward(['new-post'], {
      state: {
        file: event.target.files[0],
        store: this.storeMarker.store
      }
    });
  }

  get imageUrl() {
    if (this.storeMarker && this.storeMarker.store.history && this.storeMarker.store.history.length) {
      return this.storeMarker.store.history[0].photos[0].thumbUrl;
    }
    return '/assets/images/image_placeholder.png';
  }

  get lastDate() {
    if (!this.storeMarker.store.history || !this.storeMarker.store.history.length) {
      return null;
    }
    const sortedHistory = this.storeMarker.store.history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return new Date(sortedHistory[0].createdAt);
  }

  get crowdIcon() {
    if (!this.storeMarker.store.history || !this.storeMarker.store.history.length) {
      return null;
    }
    const sortedHistory = this.storeMarker.store.history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const status = sortedHistory[0].status;

    switch (status) {
      case StoreBusyStatus.HIGH_BUSY:
        return '/assets/images/big_crowd_icon.svg';
        break;
      case StoreBusyStatus.LOW_BUSY:
        return '/assets/images/small_crowd_icon.svg';
        break;
      case StoreBusyStatus.MEDIUM_BUSY:
        return '/assets/images/medium_crowd_icon.svg';
        break;
    }
  }

  onCardClick() {

    if (!this.storeMarker.store.history || !this.storeMarker.store.history.length) {
      return;
    }


    this.navCtrl.navigateForward(['store-detail', this.storeMarker.store._id], {
      state: {
        store: this.storeMarker.store
      }
    });

    // this.router.navigate(['store-detail', this.storeMarker.store._id], {
    //   state: {
    //     store: this.storeMarker.store
    //   }
    // });
  }

}
