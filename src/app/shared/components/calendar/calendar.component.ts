import { Target } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Output, EventEmitter, ComponentFactoryResolver, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Calendar } from 'app/data/models/calendar.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  date : Date =  new Date();
  dateSend: DateSend = new DateSend();
  showDateFull : string ='';
  showDateMonthAndYearCurrent: string = '';
  daysMonthPrev: number[] = [];
  daysMonthCurrent: number[] = [];
  daysMonthNext: number[] = [];
  today: number = 0;
  month: number = 0;
  count: number = 0;
  
  dateEnd: Date = new Date();
  dateInit: Date = new Date();
  inputValueDateInit: Date = new Date();
  inputValueDateEnd: Date = new Date();
  // showPopUpCalendar: boolean = true;



  countClick: number = 0;
  indiceDesde: number = 0;
  initial: any;
  final:any;

  @Output() sendDateRange = new EventEmitter<any>();
  @ViewChild("hashCOntentCalendar")
  hashCOntentCalendar!: ElementRef<any>;

  months: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];



  //Date Calendar
  dateSelectedInitial: Calendar  = new Calendar();
  dateSelectedFinal: Calendar = new Calendar();

  constructor(private _renderer: Renderer2,) { }

  ngAfterViewInit() {
    this._renderer.listen(this.hashCOntentCalendar.nativeElement,'click', (e: Event)=> {    
      //painting to select item      
     
      var lista =  document.querySelectorAll(".today_select");
      for (let index = 0; index < lista.length; index++) {
        if(e.target == lista[index]) {
            //catching to target select   
            if(this.countClick == 1) {
              this.initial = e.target;
              this._renderer.setStyle( this.initial ,"background-color","#88beb2");
              this._renderer.setStyle( this.initial ,"border-radius","50%");

              this.dateSelectedInitial.itemHTML = this.initial;
              console.log("INIT");
              console.log(this.dateSelectedInitial);
            }

            if(this.countClick == 2) {
              this.final = e.target;
              this._renderer.setStyle(this.final ,"background-color","#88beb2");
              this._renderer.setStyle(this.final ,"border-radius","50%");
              this.dateSelectedFinal.itemHTML = this.final;
              console.log("FINAL");
              console.log(this.dateSelectedFinal);

            }
            break;
        }
        
      }
      
    });
  }

  ngOnInit(): void {
    //this.catchDate(1,0,1);
    this.renderCalendar();
   
   
  }

  renderCalendar() {

    this.today = new Date().getDate();
    this.month = new Date().getMonth();

    this.daysMonthPrev = [];
    this.daysMonthCurrent = [];
    this.daysMonthNext = [];

    this.date.setDate(1);
    //show fullDate
    this.showDateFull = new Date().toDateString();
    this.showDateMonthAndYearCurrent = this.months[this.date.getMonth()].concat(" ",this.date.getFullYear().toString());
  
    const lastDay = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDate();
  
    const prevLastDay = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      0
    ).getDate();
  
    const firstDayIndex = this.date.getDay();
  
    const lastDayIndex = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDay();
  
    const nextDays = 7 - lastDayIndex - 1;
  
    for (let x = firstDayIndex; x > 0; x--) {
      this.daysMonthPrev.push(prevLastDay - x + 1);
    }
  
    for (let i = 1; i <= lastDay; i++) {
        this.daysMonthCurrent.push(i);
    }
  
    for (let i = 1; i <= nextDays; i++) {
      this.daysMonthNext.push(i);      
    }
  };

  getDateByDaySelected(daySelected: any) {
    
    var lista =  document.querySelectorAll(".today_select");
    
    if(this.countClick>1) {
      this.resetDateRange(lista);
    }

    //Imcrement count click
    this.countClick++;

    if(this.countClick > 1){
      this.dateSelectedFinal.dateSelected = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        daySelected);

        //Validate date Range, less to Major
        if(this.validateIfFinalDateIsLessThanInitialDate()) 
          return;
        
        //Begin to select range
        this.validIfMonthInitialIsEqualsMonthFinal(lista);
        
    } else {
      this.dateSelectedInitial.dateSelected = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        daySelected);
    }

    
   // console.log(this.hashCOntentCalendar.nativeElement);
  
        
    // this.count++;

    // if(this.count > 1) {
    //   this.dateEnd = new Date(
    //     this.date.getFullYear(),
    //     this.date.getMonth(),
    //     daySelected);

    //     if(this.dateEnd < this.dateInit) {
    //       this.dateInit = this.dateEnd;
    //       // this.dateEnd = null;
    //     }

    //     if(this.dateEnd != null) {
    //       this.inputValueDateInit = this.dateInit;
    //       this.inputValueDateEnd = this.dateEnd;
    //       this.count = 0;
    //       //this.showSelectDateFilter();
    //       this.sendDateRangeToFather();
    //     }
        
    // } else {
    //   this.dateInit = new Date(
    //     this.date.getFullYear(),
    //     this.date.getMonth(),
    //     daySelected, 10,20,15);
       
    // }

  }
  resetDateRange(lista: any) {
    this.limpiarItems(lista);
    this.dateSelectedFinal = new Calendar();
    this.dateSelectedInitial = new Calendar();
    this.initial = null;
    this.final = null;
    this.countClick = 0;
  }

  validateIfFinalDateIsLessThanInitialDate(): boolean {
    if(this.dateSelectedFinal.dateSelected < this.dateSelectedInitial.dateSelected){
      this._renderer.removeStyle(this.initial ,"background-color");
      this._renderer.removeStyle(this.initial ,"border-radius");
      this.dateSelectedInitial.dateSelected = this.dateSelectedFinal.dateSelected;
      this.countClick = 1;
      return true;
    }

    return false;
  }

  flagMonthInitialIsEqualsMonthSelected: boolean = false;
  validChangeIfMonthInitialIsEqualsMonthSelected(lista: NodeListOf<Element>) {
    console.log(this.dateSelectedInitial.itemHTML);
    console.log(this.dateSelectedFinal.itemHTML);

    if(this.dateSelectedInitial.itemHTML == undefined) return;

    //if(this.date.getMonth() == this.dateSelectedInitial.dateSelected.getMonth()) {
    if(this.validateMonthAndYearINITIALWithDateSelected()) {
      if(this.dateSelectedFinal.itemHTML == undefined) {
        this._renderer.setStyle(this.initial ,"background-color","#88beb2");
        this._renderer.setStyle(this.initial ,"border-radius","50%");
        return;
      }
      //if(this.date.getMonth() == this.dateSelectedFinal.dateSelected.getMonth()) {
      if(this.validateMonthAndYearFINALWithDateSelected()) {
        this.initial = this.dateSelectedInitial.itemHTML;
        this.final = this.dateSelectedFinal.itemHTML;
        this.getColorItemsByFromTo(lista);
      } else {
        this._renderer.removeStyle(this.initial ,"background-color");
        this._renderer.removeStyle(this.initial ,"border-radius");
        this.limpiarItems(lista);
        
        if(this.dateSelectedFinal.itemHTML == undefined) return;

        this.initial = this.dateSelectedInitial.itemHTML;
        this.final = lista[lista.length-1];
        this.getColorItemsByFromTo(lista);
      }

    } else {
      
      //Delete style WHEN change MONTH
      this._renderer.removeStyle(this.initial ,"background-color");
      this._renderer.removeStyle(this.initial ,"border-radius");
      this.limpiarItems(lista);
      //if(this.date.getMonth() == this.dateSelectedFinal.dateSelected.getMonth()) {
      if(this.validateMonthAndYearFINALWithDateSelected()) {
       // this.limpiarItems(lista);
        this.initial = lista[0];
        this.final = this.dateSelectedFinal.itemHTML;
        this.getColorItemsByFromTo(lista);
      } else {
        //this.limpiarItems(lista);
        if(this.dateSelectedFinal.itemHTML == undefined) return;
        //if(this.date.getMonth() > this.dateSelectedInitial.dateSelected.getMonth() && 
          // this.date.getMonth() < this.dateSelectedFinal.dateSelected.getMonth()) {
        console.log("init"+this.dateSelectedInitial.dateSelected);
        console.log("ifin"+this.dateSelectedFinal.dateSelected);
        if(this.validateIfMonthSelectedBETWEENMonthAndYearINITIALandFINAL()){
         // alert("entrre");
          this.initial = lista[0];
          this.final = lista[lista.length-1];
          this.getColorItemsByFromTo(lista);

        } else {
          this.limpiarItems(lista);
        }

      }

    }

  }

  validIfMonthInitialIsEqualsMonthFinal(lista: NodeListOf<Element>) {
    
    //if(this.dateSelectedFinal.dateSelected.getMonth() == this.dateSelectedInitial.dateSelected.getMonth()) {
    if(this.validateFINALMonthAndYearWithINITIALMonthAndYear()){
      this.limpiarItems(lista);
      this.initial = this.dateSelectedInitial.itemHTML;
      this.final = this.dateSelectedFinal.itemHTML;
      this.getColorItemsByFromTo(lista);
    } else {
      this._renderer.removeStyle(this.initial ,"background-color");
      this._renderer.removeStyle(this.initial ,"border-radius");
      this.initial = lista[0];
      this.final = this.dateSelectedFinal.itemHTML;
      this.getColorItemsByFromTo(lista);
    }
  }

  getColorItemsByFromTo(lista: NodeListOf<Element>) {
    setTimeout(()=> {
        for (let index = 0; index < lista.length; index++) {
          if(this.initial == lista[index]){
            this.indiceDesde = index;
            break;
          }
        }

        for (let index = this.indiceDesde; index < lista.length; index++) {
      
            this._renderer.setStyle(lista[index] ,"background-color","#dadada73");
            if(this.final == lista[index]){
                if(this.validateIfFinalIsInNextMonth()){
                  this._renderer.setStyle(this.final ,"background-color","#88beb2");
                  this._renderer.setStyle(this.final ,"border-radius","50%");
                }
                if(this.validateIfInitialIsInNextMonth()) {
                  this._renderer.setStyle(this.initial ,"background-color","#88beb2");
                  this._renderer.setStyle(this.initial ,"border-radius","50%");
                }
                break;
            }  
        }
      },10);
  }

  validateIfFinalIsInNextMonth(): boolean {
    //if(this.date.getMonth() == this.dateSelectedFinal.dateSelected.getMonth()) {
    if(this.validateMonthAndYearFINALWithDateSelected()) {
      return true;
    }
    return false;
  }
  
  validateIfInitialIsInNextMonth(): boolean {
    //if(this.date.getMonth() == this.dateSelectedInitial.dateSelected.getMonth()) {
    if(this.validateMonthAndYearINITIALWithDateSelected()) {
      return true;
    }
    return false;
  }


  limpiarItems(lista: NodeListOf<Element>) {
    for (let index = 0; index < lista.length; index++) {
      this._renderer.setStyle(lista[index] ,"background-color","#fff");
    }

    if(this.dateSelectedInitial.itemHTML != undefined ) {
      this._renderer.removeStyle(this.dateSelectedInitial.itemHTML ,"background-color");
      this._renderer.removeStyle(this.dateSelectedInitial.itemHTML ,"border-radius");
    }

    if(this.dateSelectedFinal.itemHTML != undefined)  {
      this._renderer.removeStyle(this.dateSelectedFinal.itemHTML ,"background-color");
      this._renderer.removeStyle(this.dateSelectedFinal.itemHTML ,"border-radius");
    }

  }

  validateFINALMonthAndYearWithINITIALMonthAndYear(): boolean{
    if(this.dateSelectedFinal.dateSelected.getMonth() == this.dateSelectedInitial.dateSelected.getMonth() &&
    this.dateSelectedFinal.dateSelected.getFullYear() == this.dateSelectedInitial.dateSelected.getFullYear())
      return true;

    return false;
  }

  validateMonthAndYearINITIALWithDateSelected(): boolean{
    if(this.date.getMonth() == this.dateSelectedInitial.dateSelected.getMonth() &&
      this.date.getFullYear() == this.dateSelectedInitial.dateSelected.getFullYear())
      return true;

    return false;
  }

  validateMonthAndYearFINALWithDateSelected(): boolean{
    if(this.date.getMonth() == this.dateSelectedFinal.dateSelected.getMonth() &&
      this.date.getFullYear() == this.dateSelectedFinal.dateSelected.getFullYear())
      return true;

    return false;
  }

  validateIfMonthSelectedBETWEENMonthAndYearINITIALandFINAL(): boolean{

    // if(this.date.getMilliseconds() > this.dateSelectedInitial.dateSelected.getMilliseconds()
    //   && this.date.getMilliseconds() < this.dateSelectedFinal.dateSelected.getMilliseconds()){
    //     return true;
    //   }
    if(this.date.getFullYear() == this.dateSelectedInitial.dateSelected.getFullYear()){
      if(this.date.getFullYear() == this.dateSelectedFinal.dateSelected.getFullYear()){
        if(this.date.getMonth() > this.dateSelectedInitial.dateSelected.getMonth() && 
            this.date.getMonth() < this.dateSelectedFinal.dateSelected.getMonth()){
          return true;
        }
      } else {
        if(this.date.getMonth() > this.dateSelectedInitial.dateSelected.getMonth()){
          return true;
        }
      }
      
    } else {
      if(this.date.getFullYear() == this.dateSelectedFinal.dateSelected.getFullYear()){
        if(this.date.getMonth() < this.dateSelectedFinal.dateSelected.getMonth()){
          return true;
        }
      } 
    }

    if(this.date.getFullYear() > this.dateSelectedInitial.dateSelected.getFullYear() &&
       this.date.getFullYear() < this.dateSelectedFinal.dateSelected.getFullYear()){
        return true;
    }
      
    return false;
  }



  sendDateRangeToFather() {

    this.dateSend.startDate = this.inputValueDateInit.getFullYear() + "-" + (this.inputValueDateInit.getMonth()+1) + "-" + this.inputValueDateInit.getDate();
    this.dateSend.finalDate = this.inputValueDateEnd.getFullYear() + "-" + (this.inputValueDateEnd.getMonth()+1) + "-" + this.inputValueDateEnd.getDate()+ " 23:59:59";

    this.sendDateRange.emit({
      "to":"dashboard",
      "from":"calendar",
      "id":this.dateSend
    });
  }

  catchDate(orden:number, mes:number, dia:number){

    this.date = new Date();
    let discountDay = 0;
    if(orden == 1) {
      discountDay = new Date().getDate();
    }

    //INIT
    this.inputValueDateInit = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + mes,
      new Date().getDate() + dia - discountDay
    );

    //END - YESTERDAY
    if(mes == 0 && dia == -1) {
      this.inputValueDateEnd = this.inputValueDateInit;
    } else if(mes == -1 && dia == 1) {
      //END - MONTH AGO
      this.inputValueDateEnd = new Date(
        this.date.getFullYear(),
        this.date.getMonth() + 0,
        new Date().getDate() + 0 - discountDay
      );
    } else {
      this.inputValueDateEnd = new Date();
    }
    //this.showSelectDateFilter();
    this.sendDateRangeToFather();
  }

  getLastDayByMonthAndYear() {
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    ).getDate();
  }

  goToPrev() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.renderCalendar();
    var lista =  document.querySelectorAll(".today_select");
    this.validChangeIfMonthInitialIsEqualsMonthSelected(lista);
  }

  goToNext() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.renderCalendar();
    var lista =  document.querySelectorAll(".today_select");
    this.validChangeIfMonthInitialIsEqualsMonthSelected(lista);

  }

  //ultimo día del mes anterior
  // const prevLastDay = new Date(
  //   date.getFullYear(),
  //   date.getMonth(),
  //   0
  // ).getDate();
}


export class DateSend {

  constructor(
    public startDate: string = "",
    public finalDate: string = ""
  ){}
}