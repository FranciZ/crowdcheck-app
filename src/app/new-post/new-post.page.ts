import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import * as EXIF from 'exif-js';
// @ts-ignore
import imageCompression from 'browser-image-compression';
import { IFile, IStore, StoreBusyStatus } from '../home/home.page';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { environment } from '../../environments/environment';
import { async } from '@angular/core/testing';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {

  fileForUpload: File;
  file: File;
  src;
  store: IStore;

  lineStatus: StoreBusyStatus;
  lineStatusArray: Array<ILineStatusItem> = [
    {
      status: StoreBusyStatus.HIGH_BUSY,
      iconPath: '/assets/images/big_crowd_icon.svg',
      text: 'Več kot pol ure'
    },
    {
      status: StoreBusyStatus.MEDIUM_BUSY,
      iconPath: '/assets/images/medium_crowd_icon.svg',
      text: 'Okoli 15 minut'
    },
    {
      status: StoreBusyStatus.LOW_BUSY,
      iconPath: '/assets/images/small_crowd_icon.svg',
      text: 'Skoraj nič'
    }
  ];

  photoUploader: FileUploader = new FileUploader({
    url: `${environment.API.BASE_URL}/v1/file/upload`
  });
  photoProgress = 0;
  uploadWarning;

  constructor(private router: Router,
              private navCtrl: NavController,
              public loadingController: LoadingController,
              private apiService: ApiService,
              private route: ActivatedRoute) {
  }

  ionViewCanLeave(): boolean {
    return false;
  }

  async ngOnInit() {

    if (this.router.getCurrentNavigation().extras.state) {

      this.file = this.router.getCurrentNavigation().extras.state.file;
      this.store = this.router.getCurrentNavigation().extras.state.store;

      const fileReader = new FileReader();
      fileReader.onload = async () => {

        const exif = EXIF.readFromBinaryFile(fileReader.result);
        const orientation = exif.Orientation;

        console.log('exifOrientation: ', orientation);

        const file = await imageCompression(this.file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1440,
          exifOrientation: orientation
        });

        this.fileForUpload = file;

        const src = await imageCompression.getDataUrlFromFile(file);

        this.src = src;

      };

      fileReader.readAsArrayBuffer(this.file);

    }

  }

  async onPublishClick() {

    const loading = await this.loadingController.create({
      message: 'Objavljam...',
      translucent: true,
      backdropDismiss: false
    });

    loading.present();

    try {
      const file = await this.upload((progress) => {
        // ...
      });

      const update = await this.apiService.publishUpdate(this.store._id, {
        status: this.lineStatus,
        photos: [file]
      });
      this.store.history.push(update);
      loading.dismiss();
      this.navCtrl.back();
    } catch (e) {
      console.log('Error: ', e);
      loading.dismiss();
    }


  }

  onStatusClick(item: ILineStatusItem) {
    this.lineStatus = item.status;
  }

  onBackClick() {
    this.navCtrl.back();
  }

  async upload(progressCallback = null): Promise<IFile> {

    return new Promise((resolve, reject) => {

      this.photoUploader.addToQueue([this.fileForUpload]);
      this.photoUploader.uploadAll();

      this.photoUploader.onProgressAll = (progress: any) => {
        console.log('Image progress: ', progress);
        this.photoProgress = progress;
        if (progressCallback) {
          progressCallback(progress);
        }
      };

      this.photoUploader.onCompleteAll = () => {

      };

      this.photoUploader.onCompleteItem = async (item: any, response: any, status: any, headers: any) => {
        console.log('Image uploaded');
        const photo: IFile = JSON.parse(response).data;
        this.photoProgress = 0;
        resolve(photo);
      };

      this.photoUploader.onErrorItem = async (item: any, response: any, status: any, headers: any) => {
        this.uploadWarning = 'Pri nalaganju fotografije je prišlo do problema. Prosimo poizkusite ponovno.';
        reject();
      };

    });

  }

}

export interface ILineStatusItem {
  status: StoreBusyStatus;
  iconPath: string;
  text: string;
}
