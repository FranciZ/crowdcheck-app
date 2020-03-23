import { Component, Input, OnInit } from '@angular/core';
import { IStore, IStoreMarker, StoreBusyStatus } from '../../home/home.page';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-store-list-item',
  templateUrl: './store-list-item.component.html',
  styleUrls: ['./store-list-item.component.scss'],
})
export class StoreListItemComponent implements OnInit {

  @Input() store: IStore;
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
        store: this.store
      }
    });
  }

  get imageUrl() {
    if (this.store.history && this.store.history.length) {
      return this.store.history[0].photos[0].thumbUrl;
    }
    return '/assets/images/image_placeholder.png';
  }

  get lastDate() {
    if (!this.store.history || !this.store.history.length) {
      return null;
    }
    const sortedHistory = this.store.history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return new Date(sortedHistory[0].createdAt);
  }

  get crowdIcon() {
    if (!this.store.history || !this.store.history.length) {
      return null;
    }
    const sortedHistory = this.store.history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

    this.navCtrl.navigateForward(['store-detail', this.store._id], {
      state: {
        store: this.store
      }
    });

    // this.router.navigate(['store-detail', this.store._id], {
    //   state: {
    //     store: this.store
    //   }
    // });
  }

}
