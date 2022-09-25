import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseModel } from '@data/models/business/expense.model';
import { ExpensesService } from '@data/services/expenses/expenses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-body-expense',
  templateUrl: './body-expense.component.html',
  styleUrls: ['./body-expense.component.css']
})
export class BodyExpenseComponent implements OnInit {

  voucherSelectedToShow: string = '';
  flagShowVoucherPopUp : boolean = false;
  sendListExpensesToBodyList: any[] = [];

  schemaToSendParent: any = {
    "action":"",
    "idExpense":0
  }

  @Input("receivedHeightHeaderToBody") receivedHeightHeaderToBody:string = '';
  @Input("receivedListExpensesFromSkeleton") receivedListExpensesFromSkeleton:any = [];
  @Output() sendExpenseToUpdateStatausPay = new EventEmitter();
  @ViewChild('contentList') contentList: ElementRef  | any;

  constructor(
    private _renderer: Renderer2,
    private _expenseService: ExpensesService,
    private _router: Router
  ) { 
  }

  ngOnInit(): void {
    this.sendListExpensesToBodyList = this.receivedListExpensesFromSkeleton;
    console.log(this.sendListExpensesToBodyList);
  }

  sendUpdatePayedExpense(idExpenseUpdate: number) {
    Swal.fire({
      title: '¿Ya se te realizó el pago de este gasto?',
      text: "Este procedimiento marcará el gasto seleccionado como pagado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.schemaToSendParent.action ="updateStatusPay";
        this.schemaToSendParent.idExpense = idExpenseUpdate;
        this.sendExpenseToUpdateStatausPay.emit(this.schemaToSendParent);
      }
    })
  }

  deletExpense(expenseToDelete: ExpenseModel) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "El elemento no podrá recuperarse!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.schemaToSendParent.action ="deletExpense";
        this.schemaToSendParent.idExpense = expenseToDelete.id;
        this.sendExpenseToUpdateStatausPay.emit(this.schemaToSendParent);
      }
    })

  }

  updateExpense(expenseToEdit: ExpenseModel) {
    this._expenseService.guardarExpenseToEdit(expenseToEdit);
    this._router.navigate(["/expense/" + expenseToEdit.id]);
  }

  receivedResponseFromVoucherShowToParent(event: any) {
    this.flagShowVoucherPopUp = false;
  }

  showVoucherSelected(voucherSelected: string) {
    this.flagShowVoucherPopUp = true;
    this.voucherSelectedToShow = voucherSelected;
  }

  ngAfterViewInit() {
    setTimeout(()=>{      
      this._renderer.setStyle(this.contentList.nativeElement,"height", (parseInt(this.receivedHeightHeaderToBody) - 110)+"px");
      this._renderer.setStyle(this.contentList.nativeElement,"overflow-y","scroll");
    },500);
  }

}
