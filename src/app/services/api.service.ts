import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IFile, IStoreHistoryItem, StoreBusyStatus } from '../home/home.page';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly BASE_URL = environment.API.BASE_URL;

  constructor(private http: HttpClient) {
  }

  async getStoresInBox(bottomLeft: ISimpleLocation, topRight: ISimpleLocation) {
    const response: any = await this.http.get(`${this.BASE_URL}/v1/stores/nearby?blat=${bottomLeft.lat}&blng=${bottomLeft.lng}&tlat=${topRight.lat}&tlng=${topRight.lng}`).toPromise();
    return response.data;
  }

  async publishUpdate(storeId: string, update: IStoreUpdate): Promise<IStoreHistoryItem> {
    const response: any = await this.http.post(`${this.BASE_URL}/v1/stores/${storeId}/update`, update).toPromise();
    return response.data;
  }

}

export interface ISimpleLocation {
  lat: number;
  lng: number;
}

export interface IStoreUpdate {
  status: StoreBusyStatus;
  photos: Array<IFile>;
}
