import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Customer } from '../model/customer';
import { catchError, retry } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class DataInmobiliariaService {

  basePath = 'https://inmocredit-service.onrender.com/api/data-inmobiliaria';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }


  constructor(private http: HttpClient) { }

  //API Error Handling
  handleError(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      // Default error handling
      console.log(`An error occurred: ${error.error.message}`)
    } else {
      // Unsuccessful response error code returned from backend
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Return Observable with Error Message to Client
    return throwError('Something happened with request, please try again later');
  }
  
  //Create Customer
  create(item: any): Observable<Customer>{
    return this.http.post<Customer>(this.basePath, JSON.stringify(item), this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
  }

  //Get All Students
  getAll(): Observable<any>{
    return this.http.get(this.basePath, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
  }
}