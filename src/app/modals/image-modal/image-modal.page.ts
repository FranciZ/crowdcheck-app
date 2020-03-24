import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

  @Input() url: string;

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
  }

  onBackClick() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

}
