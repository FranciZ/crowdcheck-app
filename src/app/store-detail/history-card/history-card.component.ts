import { Component, Input, OnInit } from '@angular/core';
import { IStore, IStoreHistoryItem, StoreBusyStatus } from '../../home/home.page';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../modals/image-modal/image-modal.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-card',
  templateUrl: './history-card.component.html',
  styleUrls: ['./history-card.component.scss'],
})
export class HistoryCardComponent implements OnInit {

  @Input() historyItem: IStoreHistoryItem;

  constructor(public modalController: ModalController, private router: Router) {
  }

  ngOnInit() {
  }

  async onImageClick() {

    this.router.navigate(['image-modal'], {
      state: {
        url: this.imageUrl
      }
    });

    // const modal = await this.modalController.create({
    //   component: ImageModalPage,
    //   componentProps: {
    //     url: this.imageUrl
    //   }
    // });
    // return await modal.present();
  }

  get imageUrl() {
    if (this.historyItem) {
      return this.historyItem.photos[0].thumbUrl;
    }
    return '/assets/images/image_placeholder.png';
  }

  get lastDate() {
    if (!this.historyItem) {
      return null;
    }
    return new Date(this.historyItem.createdAt);
  }

  get crowdIcon() {
    if (!this.historyItem) {
      return null;
    }
    const status = this.historyItem.status;

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

  get crowdString() {
    switch (this.historyItem.status) {
      case StoreBusyStatus.HIGH_BUSY:
        return 'Čakamo več kot pol ure';
        break;
      case StoreBusyStatus.LOW_BUSY:
        return 'Verjetno ni čakanja';
        break;
      case StoreBusyStatus.MEDIUM_BUSY:
        return 'Čakamo okoli 15 minut';
        break;
    }
  }

}
