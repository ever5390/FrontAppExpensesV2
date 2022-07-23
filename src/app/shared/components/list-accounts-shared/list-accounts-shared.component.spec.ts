import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAccountsSharedComponent } from './list-accounts-shared.component';

describe('ListAccountsSharedComponent', () => {
  let component: ListAccountsSharedComponent;
  let fixture: ComponentFixture<ListAccountsSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAccountsSharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccountsSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
