import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, retry, throwError } from "rxjs";
import { Offer } from '../model/offer';


@Injectable({
  providedIn: 'root'
})
export class OffersService {


  basePath = 'http://localhost:3000/api/v1/offers';

  @Output() setCount: EventEmitter<any>=new EventEmitter();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Default Error Handling
      console.log(`An error occurred ${error.status}, body was: ${error.error}`);
    } else {
      // Unsuccessful Response Error Code returned from Backend
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Return Observable with Error Message to Client
    return throwError(() => new Error('Something happened with request, please try again later.'));
  }

 // Create offer
 create(item: any): Observable<Offer> {
  return this.http.post<Offer>(this.basePath, JSON.stringify(item), this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
}

// Get offer by id
getById(id: any): Observable<Offer> {
  return this.http.get<Offer>(`${this.basePath}/${id}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
}

// Get all offers
getAll(): Observable<Offer> {
  return this.http.get<Offer>(this.basePath, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
}

update(id: any, item: any): Observable<Offer> {
  return this.http.put<Offer>(`${this.basePath}/${id}`, JSON.stringify(item),this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
}

// Delete student
delete(id: any): Observable<Offer> {
  return this.http.delete<Offer>(`${this.basePath}/${id}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
}

}
