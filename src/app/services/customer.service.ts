import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Customer } from '../model/customer';
import { catchError, retry } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  //basePath = 'https://appbookingsasencio.herokuapp.com/api/customers';
  basePath = 'http://localhost:8080/api/customers';
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
  getAllCustomers(): Observable<any>{
    return this.http.get(this.basePath, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
  }
  
  //Update Student
  update(id: any, item: any): Observable<Customer>{
    return this.http.put<Customer>(`${this.basePath}/${id}`, JSON.stringify(item), this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
  }
  
  //Delete Student
  delete(id: any){
    return this.http.delete(`${this.basePath}/${id}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
  }

  //Get Customer by id
  getById(id: number): Observable<any>{
    return this.http.get<Customer>(`${this.basePath}/${id}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
    }

  getCustomerByLastName(lastName: string) : Observable<any>{
    return this.http.get(`${this.basePath}/searchLastname/${lastName}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
  }

  getCustomerByDni(dni: string): Observable<any>{
    return this.http.get(`${this.basePath}/searchByDni/${dni}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
  }

  getCustomerByFirstName(firstName: string): Observable<any>{
    return this.http.get(`${this.basePath}/searchFirstname/${firstName}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
  }

  getCustomerByFirstNameAndLastName(firstName: string, lastName: string): Observable<any> {
    return this.http.get(`${this.basePath}/searchFirstnameAndLastname/${firstName}/${lastName}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError));
  }
}