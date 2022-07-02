import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBodyPeriodComponent } from './detail-body-period.component';

describe('DetailBodyPeriodComponent', () => {
  let component: DetailBodyPeriodComponent;
  let fixture: ComponentFixture<DetailBodyPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailBodyPeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBodyPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
