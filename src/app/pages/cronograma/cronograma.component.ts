import { Component, OnInit } from '@angular/core';
import { Payment } from './model/payment';
import { DataService } from './service/dataService';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css']
})
export class CronogramaComponent implements OnInit {

  displayedColumns: String[] = ['periodo', 'saldoinicial', 'interes', 'amortizacion', 'segdes', 'segInm', 'cuota', 'saldofinal']
  dataSource:Payment[] = [];
  moneda = "";

  TIR = 0;
  TCEA = 0;
  TREA = 0;
  VAN = 0;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataSource = this.dataService.getElementData();
    if(this.dataService.getMoneda() == "Soles"){
      this.moneda = "S/";
    } else{
      this.moneda = "$";
    }
    this.VAN = Number(this.dataService.getVAN().toFixed(2));
    this.TIR = Number(this.dataService.getTIR().toFixed(2));
  }

}
