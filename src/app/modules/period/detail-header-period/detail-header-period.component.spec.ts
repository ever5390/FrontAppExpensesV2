import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHeaderPeriodComponent } from './detail-header-period.component';

describe('DetailHeaderPeriodComponent', () => {
  let component: DetailHeaderPeriodComponent;
  let fixture: ComponentFixture<DetailHeaderPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailHeaderPeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailHeaderPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
