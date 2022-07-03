import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularyRegisterExpenseSharedComponent } from './formulary-register-expense-shared.component';

describe('FormularyRegisterExpenseSharedComponent', () => {
  let component: FormularyRegisterExpenseSharedComponent;
  let fixture: ComponentFixture<FormularyRegisterExpenseSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularyRegisterExpenseSharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularyRegisterExpenseSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
