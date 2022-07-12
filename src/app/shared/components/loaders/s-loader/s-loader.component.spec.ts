import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SLoaderComponent } from './s-loader.component';

describe('SLoaderComponent', () => {
  let component: SLoaderComponent;
  let fixture: ComponentFixture<SLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
