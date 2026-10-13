import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {ResetPinRequest,ResetPinResponse} from './pin-reset.model';
@Injectable({
  providedIn: 'root'
})
export class PinResetService {
  baseURL = '';
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  constructor() {
    this.baseURL = environment.baseURL ?? "";
  }



resettingPin(
  req: ResetPinRequest
): Observable<ResetPinResponse> {

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  return this.http.patch<ResetPinResponse>(
    `${this.baseURL}/lsp-users-update-pin-admin`,
    req,
    httpOptions
  ).pipe(
    catchError(this.handleError)
  );
}  


  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(error.error);
  }

}
