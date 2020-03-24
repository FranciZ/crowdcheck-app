import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

  @Input() url: string;

  constructor(private modalCtrl: ModalController,
              private router: Router,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.url = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  onBackClick() {
    this.navCtrl.back();
  }

}
