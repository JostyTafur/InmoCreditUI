import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Payment } from '../cronograma/model/payment';
import { DataService } from '../cronograma/service/dataService';
import { DataInmobiliariaDTO } from './model/DataInmobiliariaDTO';
import { TokenService } from 'src/app/services/token.service';
import { DataInmobiliariaService } from 'src/app/services/datainmobiliaria.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit, OnChanges {

  data:DataInmobiliariaDTO;

  valInm: number = 0;
  initialCuota: number = 0;
  apoyo: string = "";
  moneda:string = "";
  sostein:string = "";
  bbp:number = 0;
  entFinanciera:string = "";
  tasaInteres: string = "";
  tipoTasaNom:string = '360';
  tipoCap:string = '1';
  valTasa:number = 0;
  plazoTotal:number = 0;
  segDes:number = 0;
  segInm:number = 0;
  gracia: string = "No";
  perTotal: number = 0;
  perParcial: number = 0;
  cuotaMax = 0;
  cuotaMin = 0;

  flows:number[]= [];

  form = new FormGroup({
    valInmueble: new FormControl(null, [Validators.required, Validators.min(65200), Validators.max(464200)]),
    cuotaInicial: new FormControl(null, [Validators.required]),
    timeGraciaParc: new FormControl(null,[Validators.required, Validators.min(0)]),
    timeGraciaTotal: new FormControl(null,[Validators.required, Validators.min(0)]),
    entFinanciera: new FormControl(null, Validators.required),
    tipoTasaNom: new FormControl(null, Validators.required),
    tipoCap: new FormControl(null, Validators.required),
    valorTasa: new FormControl(null, [Validators.required, Validators.min(0.1)]),
    plazoMeses: new FormControl(null, [Validators.required, Validators.min(60), Validators.max(300)]),
    segDes: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    segInmueble: new FormControl(null,[Validators.required, Validators.min(0.01)])
  });

  disableBBP = true;
  disableNominal = false;
  disableGracia = false;
  payments: Payment[] = [];
  username:string = "";

  constructor(private router:Router, private _snackBar: MatSnackBar, private dataService:DataService, private tokenService:TokenService, private dataInm:DataInmobiliariaService) {
    this.data = {} as DataInmobiliariaDTO;
  }

  ngOnInit(): void {
    this.username = this.tokenService.getUserName()|| "";

    this.form.get('valInmueble')?.valueChanges.subscribe((value) => { // Calculate cuotaMin based on valMin
      this.cuotaMin = value * 0.075;
      this.cuotaMax = value * 0.3;

      // Update cuotaInicial validators
      this.form.get('cuotaInicial')?.setValidators([
        Validators.required,
        Validators.min(this.cuotaMin),
        Validators.max(this.cuotaMax)
      ]);

      // Trigger validation update
      this.form.get('cuotaInicial')?.updateValueAndValidity();
    });
    
  }

  ngOnChanges(changes: SimpleChanges){
    
  }

  onSubmit(formulario: FormGroupDirective){
    if(formulario.form.valid){
      this.calculatePayments();
      this.dataService.setElementData(this.payments);
      this.dataService.setMoneda(this.moneda);
      this.addData();
      this.router.navigateByUrl('/cronograma');
    } else{
      formulario.form.markAsDirty();
    }
  }

  calculatePayments(){
    let percentTasa = 0;
    let VAN = 0;
    if(this.tasaInteres == "nominal"){
      percentTasa = Math.pow(1 + ((this.valTasa/100)/(Number(this.tipoTasaNom)/Number(this.tipoCap))),(30/Number(this.tipoCap))) - 1;
    } else{
      percentTasa = Math.pow((1+this.valTasa/100),(30/360))-1;
    }
    let index = 0;
    let valInicial = 0;
    if(this.apoyo == "Yes"){
      valInicial = this.valInm - this.initialCuota;
    } else {
      valInicial = this.valInm - this.initialCuota - this.bbp;
    }
    let plazo = this.plazoTotal - this.perParcial - this.perTotal;
    let seguroDes = this.segDes/100;
    let seguroInmueble = this.segInm/100 * this.valInm/12;
    let percentTasaTotal = percentTasa + seguroDes;
    let cuota = (valInicial * ((percentTasaTotal * Math.pow((1 + percentTasaTotal), (plazo))) / (Math.pow((1 + percentTasaTotal), (plazo)) - 1))) + seguroInmueble;
    let saldoInit = 0

    while(index <= this.plazoTotal){
      if(index == 0){
        this.payments.push({periodo: index, saldoinicial: valInicial, interes: 0, amortizacion: 0, cuota: 0, segdes: 0, segInm: 0, saldofinal: valInicial})
        saldoInit = valInicial;
        VAN += saldoInit;
      }else if(this.perTotal > 0){
        this.payments.push({periodo: index, saldoinicial: Number(saldoInit.toFixed(2)), interes: 0, amortizacion: 0, cuota: 0, segdes: 0, segInm: 0, saldofinal: Number((valInicial*(1+percentTasa)).toFixed(2))})
        this.perTotal-=1;
        if(this.perTotal != 0){
          saldoInit = valInicial*(1+percentTasa);
        }
        cuota = (saldoInit * ((percentTasaTotal * Math.pow((1 + percentTasaTotal), (plazo))) / (Math.pow((1 + percentTasaTotal), (plazo)) - 1))) + seguroInmueble
        this.flows.push(0);
      } else if(this.perParcial > 0){
          this.payments.push({periodo: index, saldoinicial: Number(saldoInit.toFixed(2)), interes: Number((saldoInit*percentTasa).toFixed(2)), amortizacion: 0, cuota: Number((saldoInit*percentTasa + seguroDes*saldoInit + seguroInmueble).toFixed(2)), segdes: Number((seguroDes*saldoInit).toFixed(2)), segInm: Number((seguroInmueble).toFixed(2)), saldofinal: Number(saldoInit.toFixed(2))});
          this.perParcial-=1;
          cuota = (saldoInit * ((percentTasaTotal * Math.pow((1 + percentTasaTotal), (plazo))) / (Math.pow((1 + percentTasaTotal), (plazo)) - 1))) + seguroInmueble
          VAN -= (saldoInit*percentTasa + seguroDes*saldoInit + seguroInmueble)/(Math.pow((1 + percentTasa), index));
          this.flows.push(-(saldoInit*percentTasa + seguroDes*saldoInit + seguroInmueble));
      } else {
        this.payments.push({periodo: index, saldoinicial: Number(saldoInit.toFixed(2)), interes: Number((saldoInit*percentTasa).toFixed(2)), amortizacion: Number((cuota-saldoInit*percentTasa - seguroDes*saldoInit - seguroInmueble).toFixed(2)), cuota: Number(cuota.toFixed(2)), segdes: Number((seguroDes*saldoInit).toFixed(2)), segInm: Number((seguroInmueble).toFixed(2)),saldofinal: Number((saldoInit - (cuota-saldoInit*percentTasa - seguroDes*saldoInit - seguroInmueble)).toFixed(2))})
        saldoInit = saldoInit - (cuota-saldoInit*percentTasa - seguroDes*saldoInit - seguroInmueble);
        VAN -= (cuota)/(Math.pow((1 + percentTasa), index));
        this.flows.push(-cuota);
      }

      index +=1;
    }
    this.dataService.setVAN(VAN);
  }

  calculateBBP(){
    if(this.valInm >= 65200 && this.valInm <= 93100){
      this.bbp = 25700;
    } else if(this.valInm > 93100 && this.valInm <= 139400){
      this.bbp = 21400;
    } else if(this.valInm > 139400 && this.valInm <= 232200){
      this.bbp = 19600;
    } else if(this.valInm > 232200 && this.valInm <= 343900){
      this.bbp = 10800;
    }

    if(this.sostein == "Yes"){
      this.bbp += 5400;
    }
  }

  clean(){
    this.valInm = 0;
    this.initialCuota = 0;
    this.apoyo = "";
    this.moneda = "";
    this.sostein = "";
    this.bbp = 0;
    this.entFinanciera = '';
    this.tasaInteres = '';
    this.tipoTasaNom = '360';
    this.tipoCap = '1';
    this.valTasa = 0;
    this.segDes = 0;
    this.segInm = 0;
    this.perTotal = 0;
    this.perParcial = 0;
  }

  actualizeDisabledBBP(){
    if(this.apoyo === 'Yes'){
      this.disableBBP = true;
      this.bbp = 0;
    } else {
      this.disableBBP = false;
    }
  }

  actualizeDisableNominal(){
    if(this.tasaInteres === 'efectiva'){
      this.disableNominal = true;
    } else {
      this.disableNominal = false;
    }
  }

  actualizeDisableGracia(){
    if(this.gracia === 'No'){
      this.form.get("timeGraciaParc")?.disable;
      this.form.get("timeGraciaTotal")?.disable;
    } else {
      this.form.get("timeGraciaParc")?.enable;
      this.form.get("timeGraciaTotal")?.enable;
    }
  }

  addData(){
    this.data.apoyoHabitacional = this.apoyo;
    this.data.cuotaInicial = this.initialCuota;
    this.data.entidadFinanciera = {
      nombreEntidad: this.entFinanciera,
      plazo : this.plazoTotal,
      segDesgravamen : this.segDes,
      segInmueble: this.segDes,
      tipoTasa: this.tasaInteres,
      tipoCapitalizacion :"",
      tipoTasaNominal: "",
      valorTasa : this.valTasa,
    };
    if(this.tasaInteres != "efectiva"){
      switch(this.tipoTasaNom){
        case "1": this.data.entidadFinanciera.tipoTasaNominal = "Diario"; break;
        case "15": this.data.entidadFinanciera.tipoTasaNominal = "Quincenal"; break;
        case "30": this.data.entidadFinanciera.tipoTasaNominal = "Mensual"; break;
        case "60": this.data.entidadFinanciera.tipoTasaNominal = "Bimenstral"; break;
        case "90": this.data.entidadFinanciera.tipoTasaNominal = "Trimestral"; break;
        case "120": this.data.entidadFinanciera.tipoTasaNominal = "Cuatrimestral"; break;
        case "180": this.data.entidadFinanciera.tipoTasaNominal = "Semestral"; break;
        case "360": this.data.entidadFinanciera.tipoTasaNominal = "Anual"; break;
      }

      switch(this.tipoCap){
        case "1": this.data.entidadFinanciera.tipoCapitalizacion = "Diario"; break;
        case "15": this.data.entidadFinanciera.tipoCapitalizacion = "Quincenal"; break;
        case "30": this.data.entidadFinanciera.tipoCapitalizacion = "Mensual"; break;
        case "60": this.data.entidadFinanciera.tipoCapitalizacion = "Bimenstral"; break;
        case "90": this.data.entidadFinanciera.tipoCapitalizacion = "Trimestral"; break;
        case "120": this.data.entidadFinanciera.tipoCapitalizacion = "Cuatrimestral"; break;
        case "180": this.data.entidadFinanciera.tipoCapitalizacion = "Semestral"; break;
        case "360": this.data.entidadFinanciera.tipoCapitalizacion = "Anual"; break;
      }
    }
    this.data.moneda = this.moneda;
    this.data.perParcial =this.perParcial;
    this.data.perTotal = this.perTotal;
    this.data.sostenibilidad = this.sostein;
    this.data.totalBBP = this.bbp;
    this.data.username = this.username;
    this.data.valorInmueble = this.valInm;
    this.dataInm.create(this.data).subscribe();
  }
}
