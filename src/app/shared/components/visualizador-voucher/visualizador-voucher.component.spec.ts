import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorVoucherComponent } from './visualizador-voucher.component';

describe('VisualizadorVoucherComponent', () => {
  let component: VisualizadorVoucherComponent;
  let fixture: ComponentFixture<VisualizadorVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizadorVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizadorVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
