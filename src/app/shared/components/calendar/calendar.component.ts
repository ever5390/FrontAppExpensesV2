import { Component, OnInit, Output, EventEmitter, Renderer2, ViewChild, ElementRef, Input } from '@angular/core';
import { PeriodModel } from '@data/models/business/period.model';
import { CONSTANTES } from 'app/data/constantes';
import { Calendar } from 'app/data/models/calendar.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  period: PeriodModel = new PeriodModel();

  @Input() receivedComponentParent: String = '';
  @Output() sendResponseFromCalendarToParent : EventEmitter<any> = new EventEmitter();
  
  flagFilterOptions: boolean = false;
  flagPeriodOptions: boolean = false;

  hour: number = new Date().getHours();
  minute: number = new Date().getMinutes();
  showBlockHourMinute: boolean = true;


  date : Date =  new Date();
  dateSend: DateSend = new DateSend();
  showDateFull : string ='';
  showDateMonthAndYearCurrent: string = '';
  daysMonthPrev: number[] = [];
  daysMonthCurrent: number[] = [];
  daysMonthNext: number[] = [];
  today: number = 0;
  month: number = 0;
  year: number = 0;
  count: number = 0;
  
  dateEnd: Date = new Date();
  dateInit: Date = new Date();
  inputValueDateInit: Date = new Date();
  inputValueDateEnd: Date = new Date();

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
  flagMonthInitialIsEqualsMonthSelected: boolean = false;

  countClick: number = 0;
  indiceDesde: number = 0;
  initial: any;
  final:any;

  showFilters: boolean = false;
  
  @ViewChild("hashCOntentCalendar")
  hashCOntentCalendar!: ElementRef<any>;

  @ViewChild("hashIDFilters")
  hashIDFilters: ElementRef<any> | undefined;

  @ViewChild("containerAll") 
  containerAll: ElementRef | any;

  constructor(private _renderer: Renderer2,) {
    this._renderer.listen('window','click',(e: Event)=> {
        if(this.containerAll && e.target === this.containerAll.nativeElement) {
          this.hiddenCalendar();
        }
    });
  }

  hiddenCalendar() {
    this.sendResponseFromCalendarToParent.emit(false);
  }

  ngOnInit(): void {
    //this.catchDate(1,0,1);

    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);

    if(this.receivedComponentParent == CONSTANTES.CONST_COMPONENT_PERIOD){
      this.flagPeriodOptions = true;
    }

    if(this.receivedComponentParent == CONSTANTES.CONST_COMPONENT_HEADER){
      this.flagFilterOptions = true;
      this.showBlockHourMinute = false;
    }

    this.renderCalendar();
  }

  ngAfterViewInit() {
    this._renderer.listen(this.hashCOntentCalendar.nativeElement,'click', (e: Event)=> {    
      this.seteandoInterfaceDateAndTargetByElementClick(e);
    });

  }

  showSpecificsFilters() {
    
    this.showFilters = !this.showFilters;
    
    if(this.showFilters)
      this._renderer.addClass(this.hashIDFilters?.nativeElement, "st_fast_filters_show");
  
    if(!this.showFilters)
      this._renderer.removeClass(this.hashIDFilters?.nativeElement, "st_fast_filters_show");

  }

  seteandoInterfaceDateAndTargetByElementClick(e: Event) {
    var lista =  document.querySelectorAll(".today_select");

    for (let index = 0; index < lista.length; index++) {
      if(e.target == lista[index]) {
          //catching to target select and painting 
          if(this.countClick == 1) {
            this.initial = e.target;
            this.seteandoStylesToTargetSelected(this.initial);
            this.dateSelectedInitial.itemHTML = this.initial;
          }

          if(this.countClick == 2) {
            this.final = e.target;
            this.seteandoStylesToTargetSelected(this.final);
            this.dateSelectedFinal.itemHTML = this.final;
          }
          break;
      }
    }
  }

  seteandoStylesToTargetSelected(targetSelected: any) {
    this._renderer.setStyle( targetSelected ,"background-color","#88beb2");
    this._renderer.setStyle( targetSelected ,"border-radius","50%");
  }

  getDateByDaySelected(daySelected: any) {
    var lista =  document.querySelectorAll(".today_select");
    
    //Reset if exceeds the value
    if(this.countClick>1) {
      this.resetDateRange(lista);
    }

    //Imcrement count click
    this.countClick++;

    //Catching FinalDate
    if(this.countClick > 1){
      this.dateSelectedFinal.dateSelected = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        daySelected);

        //Validate date Range, less to Major, not major to less
        if(this.validateIfFinalDateIsLessThanInitialDate()) 
          return;
        
        //Begin to select range
        this.validIfMonthInitialIsEqualsMonthFinal(lista);

        //Emite dates to Parent
        this.sendDateRangeToFather("two");
        
        return;
    }
    
    //Catching initDate
    this.dateSelectedInitial.dateSelected = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        daySelected);

    if(this.receivedComponentParent != CONSTANTES.CONST_COMPONENT_HEADER) {
      //Emite dates to Parent
      this.sendDateRangeToFather("only");
      return;
    }
    
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

  validChangeIfMonthInitialIsEqualsMonthSelected( lista: NodeListOf<Element> ) {

    //Validate if select day by click
    if(this.dateSelectedInitial.itemHTML == undefined) 
      return;

    if(this.validateMonthAndYearINITIALEqualsMothAndYearSELECTED()) {
      if(this.dateSelectedFinal.itemHTML == undefined) {
        this._renderer.setStyle(this.initial ,"background-color","#88beb2");
        this._renderer.setStyle(this.initial ,"border-radius","50%");
        return;
      }
      if(this.validateMonthAndYearFINALEqualsMothAndYearSELECTED()) {
        this.initial = this.dateSelectedInitial.itemHTML;
        this.final = this.dateSelectedFinal.itemHTML;
        this.receiveFromAndToAndPaint(lista);
      } else {
        this._renderer.removeStyle(this.initial ,"background-color");
        this._renderer.removeStyle(this.initial ,"border-radius");
        this.limpiarItems(lista);
        
        //Validate if select day by click
        if(this.dateSelectedFinal.itemHTML == undefined) 
          return;

        this.initial = this.dateSelectedInitial.itemHTML;
        this.final = lista[lista.length-1];

        //Painting date range
        this.receiveFromAndToAndPaint(lista);
      }

    } else {
      //Delete style WHEN change MONTH
      this.limpiarItems(lista);

      if(this.dateSelectedFinal.itemHTML == undefined) 
          return;
      if(this.validateMonthAndYearFINALEqualsMothAndYearSELECTED()) {
        this.initial = lista[0];
        this.final = this.dateSelectedFinal.itemHTML;
        
        //Painting date range
        this.receiveFromAndToAndPaint(lista);
      } else {

        if(this.dateSelectedFinal.itemHTML == undefined) 
          return;

          if(this.validateIFmonthAndYearSelectedIsBETWEENmonthAndYearINTITIALandFINAL()){
          this.initial = lista[0];
          this.final = lista[lista.length-1];

          //Painting date range
          this.receiveFromAndToAndPaint(lista);
        } else {
          this.limpiarItems(lista);
        }

      }

    }

  }

  validIfMonthInitialIsEqualsMonthFinal(lista: NodeListOf<Element>) {
    
    if(this.validateMonthAndYearFINALEqualsMonthANdYearINITIAL()){
      this.limpiarItems(lista);
      this.initial = this.dateSelectedInitial.itemHTML;
      this.final = this.dateSelectedFinal.itemHTML;

       //Painting date range
      this.receiveFromAndToAndPaint(lista);
    } else {
      this._renderer.removeStyle(this.initial ,"background-color");
      this._renderer.removeStyle(this.initial ,"border-radius");
      this.limpiarItems(lista);
      this.initial = lista[0];
      this.final = this.dateSelectedFinal.itemHTML;

       //Painting date range
      this.receiveFromAndToAndPaint(lista);
    }
  }

  receiveFromAndToAndPaint(lista: NodeListOf<Element>) {
    setTimeout(()=> {
      
      //Catching INDEX by initial date selected
        for (let index = 0; index < lista.length; index++) {
          if(this.initial == lista[index]){
            this.indiceDesde = index;
            break;
          }
        }

        //Catching INDEX and painting date range by initial date selected and final
        for (let index = (this.indiceDesde); index < lista.length; index++) {

            this._renderer.setStyle(lista[index] ,"background-color","#dadada73");

            //date limit to range
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

      },2);
  }

  validateIfFinalIsInNextMonth(): boolean {
    if(this.validateMonthAndYearFINALEqualsMothAndYearSELECTED())
      return true;

    return false;
  }
  
  validateIfInitialIsInNextMonth(): boolean {
    if(this.validateMonthAndYearINITIALEqualsMothAndYearSELECTED())
      return true;

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

  validateMonthAndYearFINALEqualsMonthANdYearINITIAL(): boolean{
    if(this.dateSelectedFinal.dateSelected.getMonth() == this.dateSelectedInitial.dateSelected.getMonth() &&
    this.dateSelectedFinal.dateSelected.getFullYear() == this.dateSelectedInitial.dateSelected.getFullYear())
      return true;

    return false;
  }

  validateMonthAndYearINITIALEqualsMothAndYearSELECTED(): boolean{
    if(this.date.getMonth() == this.dateSelectedInitial.dateSelected.getMonth() &&
      this.date.getFullYear() == this.dateSelectedInitial.dateSelected.getFullYear())
      return true;

    return false;
  }

  validateMonthAndYearFINALEqualsMothAndYearSELECTED(): boolean{
    if(this.date.getMonth() == this.dateSelectedFinal.dateSelected.getMonth() &&
      this.date.getFullYear() == this.dateSelectedFinal.dateSelected.getFullYear())
      return true;

    return false;
  }

  validateIFmonthAndYearSelectedIsBETWEENmonthAndYearINTITIALandFINAL(): boolean{

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

  renderCalendar() {
    this.today = new Date().getDate();
    this.month = new Date().getMonth();
    this.year = new Date().getFullYear();

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

  sendDateRangeToFather(order: string) { //CLICK EN DÍAS
    this.dateSend.startDate = this.dateSelectedInitial.dateSelected;
    this.dateSend.finalDate = this.dateSelectedFinal.dateSelected;
    // this.dateSend.finalDate = (order == "only")?this.dateSelectedInitial.dateSelected:this.dateSelectedFinal.dateSelected;
    if(order == "only") {
      this.dateSend.finalDate = this.dateSelectedInitial.dateSelected;
      this.dateSend.finalDate = new Date( this.dateSend.finalDate.getFullYear(), this.dateSend.finalDate.getMonth(),  this.dateSend.finalDate.getDate(),this.hour,this.minute,0);
    
      if(this.receivedComponentParent == CONSTANTES.CONST_COMPONENT_EXPENSEREGISTER){
        //Validar que la fecha se encuentre en el rango del inicio y fin del periodo actual seleccionado
        if(new Date(this.dateSend.finalDate).getTime() < new Date(this.period.startDate).getTime() 
          || new Date(this.dateSend.finalDate).getTime() > new Date().getTime()) {
          Swal.fire("","La fecha seleccionada debe encontrarse dentro del rango del periodo y no puede ser posterior a hoy.","info");
        }
      }
    }
    console.log(this.receivedComponentParent);
    console.log(this.dateSend);    
    this.sendResponse(this.dateSend);
  }

  catchDateSingleSelectPeriod(type: string) {//MODIFICAR FINAL DATE DE PERIODO

    if(type == "quincenal") {
      this.dateSend.finalDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        15
      )
    }

    if(type == "mensual") {
      this.dateSend.finalDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth()+1,
        0
      )
    }
    this.dateSend.finalDate = new Date( this.dateSend.finalDate.getFullYear(), this.dateSend.finalDate.getMonth(),  this.dateSend.finalDate.getDate(),this.hour,this.minute,0);
    this.sendResponse(this.dateSend);
  }

  catchDate(orden:number, monthDiscount:number, dayDiscount:number){
    let dataSend:any = [];
    var action = null;
    switch (orden) {
      case 0://Resta en ambos : hoy y ayer
        this.inputValueDateInit = this.getDateWithMinusDay(monthDiscount, dayDiscount);
        this.inputValueDateEnd = this.getDateWithMinusDay(monthDiscount, dayDiscount);
        break;
      case 1:// resta días, Hasta fecha de hoy
        this.inputValueDateInit = this.getDateWithMinusDay(monthDiscount, dayDiscount);
        this.inputValueDateEnd = this.getDateWithMinusDay(monthDiscount, 0);
        break;
      case 2:// mes pasado
        this.inputValueDateInit = this.getDateWithMinusDay(monthDiscount, -(new Date().getDate()-1));
        this.inputValueDateEnd = this.getDateWithMinusDay(0, 0);
        break;
      case 3:// resta meses
        this.inputValueDateInit = this.getDateWithMinusDay(monthDiscount, -(new Date().getDate()-1));
        this.inputValueDateEnd = this.getDateWithMinusDay(0, - [new Date().getDate()]);
        break;
      default:
        break;
    }
    dataSend.startDate = this.inputValueDateInit;
    dataSend.finalDate = this.inputValueDateEnd;

    this.sendResponse(dataSend);
  }

  private sendResponse(dataSend: any) {       
    this.sendResponseFromCalendarToParent.emit({
      "component": CONSTANTES.CONST_COMPONENT_CALENDAR,
      "dateRange": dataSend
    });
  }

  addHourAndMinutes(order: string) {
    console.log(order + "--" + this.hour);
  }

  getDateWithMinusDay(monthDiscount: number, dayDiscount: number ): Date {
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth() + monthDiscount,
      new Date().getDate() + dayDiscount
    );
  }

  goToPrev() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.renderCalendar();
    this.catchingCompleteCountBoxByDayByMonth();

  }

  goToNext() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.renderCalendar();
    this.catchingCompleteCountBoxByDayByMonth();
  }

  catchingCompleteCountBoxByDayByMonth() {
    var lista =  document.querySelectorAll(".today_select");
    this.limpiarItems(lista);
    setTimeout(()=> {
      lista =  document.querySelectorAll(".today_select");
      this.validChangeIfMonthInitialIsEqualsMonthSelected(lista);
    },50);
  }

  goToToday() {
    this.date = new Date();
    this.renderCalendar();
    this.catchingCompleteCountBoxByDayByMonth();
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
    public startDate: Date = new Date(),
    public finalDate: Date = new Date()
  ){}
}