import { Component, OnInit } from '@angular/core';
import geolocator from 'geolocator';
import { LocationService } from '../services/location.service';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { ApiService, ISimpleLocation } from '../services/api.service';
import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';
import { AgmMap } from '@agm/core';
import { Router } from '@angular/router';

declare var google;

geolocator.config({
  language: 'sl',
  google: {
    version: '3',
    key: 'AIzaSyAT3yNDubLAiETu46f03XKk-L2bFZDcrR8'
  }
});

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  locationLoading = true;
  locationError;
  mapObject;

  lottieOptions: AnimationOptions = {
    path: '/assets/lottie/location.json',
  };

  markers: Array<IStoreMarker> = [];

  bottomLeft;
  topRight;

  zoomLevel = 15.5;
  mapLocation: ISimpleLocation;
  boundsTimeout;
  selectedMarker: IStoreMarker;

  constructor(public locationService: LocationService,
              private router: Router,
              private apiService: ApiService) {
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  ngOnInit(): void {

    this.locationLoading = true;

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumWait: 10000,
      desiredAccuracy: 30,
      fallbackToIP: true,
      addressLookup: false,
      timezone: false
    };

    geolocator.locate(options, (err, loc) => {
      if (!err) {
        console.log('Location: ', loc);
        this.locationService.locationStatus = true;
        this.locationService.location = {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude
        };

        this.mapLocation = {
          lat: this.locationService.location.lat,
          lng: this.locationService.location.lng
        };

        console.log('loc: ', loc);

        this.locationLoading = false;
      } else {
        console.log('Location error: ', err);
        this.locationService.locationStatus = false;
        this.locationLoading = false;
        this.locationError = err;
      }
    });

  }

  onMapReady(event) {
    this.mapObject = event;

    google.maps.Map.prototype.setCenterWithOffset = function(latlng, offsetX, offsetY) {
      const map = this;
      const ov = new google.maps.OverlayView();
      ov.onAdd = function() {
        const proj = this.getProjection();
        const aPoint = proj.fromLatLngToContainerPixel(latlng);
        aPoint.x = aPoint.x + offsetX;
        aPoint.y = aPoint.y + offsetY;
        map.panTo(proj.fromContainerPixelToLatLng(aPoint));
      };
      ov.draw = () => {
      };
      ov.setMap(this);
    };

    this.mapObject.setCenterWithOffset(new google.maps.LatLng(this.mapLocation.lat, this.mapLocation.lng), 0, 0);
  }

  onMapClick() {
    this.deselectSelectedMarker();
  }

  deselectSelectedMarker() {
    if (this.selectedMarker) {
      this.selectedMarker.selected = false;
      this.selectedMarker.icon = {
        url: this.selectedMarker.type === MarkerType.SINGLE ? '/assets/images/map_pin.svg' : '/assets/images/map_pin_cluster1.svg',
        scaledSize: {
          width: 60,
          height: 72
        }
      };
      this.selectedMarker = null;
    }
  }

  onMarkerClick(marker: IStoreMarker) {

    if (marker === this.selectedMarker) {
      // return;
    }

    if (marker.type === MarkerType.MULTIPLE) {
      this.router.navigate(['store-list'], {
        state: {
          marker
        }
      });
    }

    console.log('Marker click');

    this.deselectSelectedMarker();

    marker.icon = {
      url: marker.type === MarkerType.SINGLE ? '/assets/images/map_pin_selected.svg' : '/assets/images/map_pin_cluster_selected.svg',
      scaledSize: {
        width: 60,
        height: 72
      }
    };

    this.selectedMarker = marker;

    // if (this.mapLocation) {
    //   this.mapLocation.lat = marker.lat;
    //   this.mapLocation.lng = marker.lng;
    // } else {
    //   this.mapLocation = {
    //     lat: marker.lat,
    //     lng: marker.lng,
    //   };
    // }

    setTimeout(() => {
      this.mapObject.setCenterWithOffset(new google.maps.LatLng(marker.lat, marker.lng), 0, 100);
    }, 0);

  }

  clusterCalculator() {
    return {
      text: '',
      index: ''
    };
  }

  onMyLocationClick() {

    this.locationLoading = true;

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumWait: 10000,
      desiredAccuracy: 30,
      fallbackToIP: true,
      addressLookup: false,
      timezone: false
    };

    geolocator.locate(options, (err, loc) => {
      if (!err) {
        console.log('Location: ', loc);
        this.locationService.locationStatus = true;
        this.locationService.location = {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude
        };

        this.mapLocation = {
          lat: this.locationService.location.lat,
          lng: this.locationService.location.lng
        };

        this.zoomLevel = 17;

        console.log('loc: ', loc);

        this.locationLoading = false;
      } else {
        console.log('Location error: ', err);
        this.locationService.locationStatus = false;
        this.locationLoading = false;
        this.locationError = err;
      }
    });

  }

  onNavigateClick() {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${this.selectedMarker.store.lat},${this.selectedMarker.store.lng}&dirflg=w`);
  }

  onClusterClick(event) {
    console.log('Cluster click: ', event);
  }

  async onBoundsChange(event) {

    if (this.boundsTimeout) {
      clearTimeout(this.boundsTimeout);
    }

    console.log('zoomLevel: ', this.zoomLevel);

    this.boundsTimeout = setTimeout(async () => {
      this.bottomLeft = {
        lat: event.Ya.g,
        lng: event.Ta.g
      };

      this.topRight = {
        lat: event.Ya.i,
        lng: event.Ta.i
      };

      const stores: Array<IStore> = await this.apiService.getStoresInBox(this.bottomLeft, this.topRight);
      const storesAtSameLocation: Array<Array<IStore>> = [];

      stores.forEach((store) => {
        const matchingStores = stores.filter((s) => store.lat === s.lat && store.lng === s.lng);
        if (matchingStores.length > 1) {
          storesAtSameLocation.push(matchingStores);
          matchingStores.forEach((match) => {
            const index = stores.findIndex((s) => s._id === match._id);
            stores.splice(index, 1);
          });
        }
      });

      const newStores: Array<IStore> = stores.filter(store => !this.markers.filter(marker => marker.store && marker.store._id === store._id).length);

      const newMarkers: Array<IStoreMarker> = newStores.map(store => ({
        icon: {
          url: '/assets/images/map_pin.svg',
          scaledSize: {
            width: 60,
            height: 72
          }
        },
        store,
        type: MarkerType.SINGLE,
        lat: store.lat,
        lng: store.lng
      }));

      storesAtSameLocation.forEach((storeGroup) => {
        const existingMarker = !!this.markers.filter((m) => m.stores && m.stores[0]._id === storeGroup[0]._id).length;
        if (!existingMarker) {
          newMarkers.push({
            stores: storeGroup,
            type: MarkerType.MULTIPLE,
            icon: {
              url: '/assets/images/map_pin_cluster1.svg',
              scaledSize: {
                width: 60,
                height: 72
              },
              anchor: {x: 30, y: 58}
            },
            lat: storeGroup[0].lat,
            lng: storeGroup[0].lng
          });
        }
      });

      const numMultiple = newMarkers.filter((m) => m.type === MarkerType.MULTIPLE).length;

      this.markers.push(...newMarkers);

      console.log('Markers: ', this.markers);

    }, 300);

  }

}

export interface IStoreMarker {
  icon?: {
    url: string;
    scaledSize: {
      height: number;
      width: number;
    },
    anchor?: { x: number; y: number; }
  };
  type: MarkerType;
  store?: IStore;
  stores?: Array<IStore>;
  lat?: number;
  lng?: number;
  selected?: boolean;
}

export enum StoreBusyStatus {
  HIGH_BUSY = 'HIGH_BUSY',
  MEDIUM_BUSY = 'MEDIUM_BUSY',
  LOW_BUSY = 'LOW_BUSY'
}

export interface IStore {
  _id: string;
  brand: string;
  name: string;
  street: string;
  city: string;
  lat: number;
  lng: number;
  history: Array<IStoreHistoryItem>;
}

export interface IStoreHistoryItem {
  _id: string;
  status: StoreBusyStatus;
  photos: Array<IFile>;
  createdAt?: Date;
}

export interface IFile {
  _id: string;
  url?: string;
  thumbUrl?: string;
}

export enum MarkerType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE'
}
