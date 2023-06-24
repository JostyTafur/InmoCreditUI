import { Injectable } from '@angular/core';
import { Payment } from '../model/payment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private elementData: Payment[] = [];
  private elementMoneda:string = "";
  private VAN:number = 0;
  private TIR:number = 0;
  private TCEA:number = 0;

  setElementData(data: Payment[]) {
    this.elementData = data;
  }

  getElementData(): Payment[] {
    return this.elementData;
  }

  setMoneda(moneda:string){
    this.elementMoneda = moneda;
  }

  getMoneda():string{
    return this.elementMoneda;
  }

  setVAN(van:number){
    this.VAN = van;
  }

  getVAN():number{
    return this.VAN;
  }

  setTIR(tir:number){
    this.TIR = tir;
  }

  getTIR():number{
    return this.TIR;
  }

  setTCEA(tcea:number){
    this.TCEA = tcea;
  }

  getTCEA():number{
    return this.TCEA;
  }
}