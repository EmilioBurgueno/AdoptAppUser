import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdoptionPage } from './adoption.page';

describe('AdoptionPage', () => {
  let component: AdoptionPage;
  let fixture: ComponentFixture<AdoptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdoptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdoptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
