import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreListItemComponent } from './store-list-item.component';

describe('StoreListItemComponent', () => {
  let component: StoreListItemComponent;
  let fixture: ComponentFixture<StoreListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreListItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
