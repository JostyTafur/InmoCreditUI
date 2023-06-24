import { Component, OnInit } from '@angular/core';
import { DataInmobiliariaService } from 'src/app/services/datainmobiliaria.service';
import { DataInmobiliaria } from './model/DataInmobiliaria';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  cardList: DataInmobiliaria[] = [];

  constructor(private dataInmService: DataInmobiliariaService) {

   }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(){
    this.dataInmService.getAll().subscribe(
      (data: any[]) =>{
        this.cardList = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setMoneyTipe(moneda:string):string{
    if(moneda == "Soles"){
      return "S/";
    } else{
      return "$";
    }
  }
}
