import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {ValidateUserRequest,ValidateUserResponse} from './pin.model'

@Injectable({
  providedIn: 'root'
})
export class PinService {
  private readonly http = inject(HttpClient);
  private readonly baseURL: string;
  constructor() {
    this.baseURL = environment.baseURL ?? "";
  }

 validateUserDetails(
  req: ValidateUserRequest
): Observable<ValidateUserResponse> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  return this.http.post<ValidateUserResponse>(
    `${this.baseURL}/lsp-users-send-otp-admin`,
    req,
    httpOptions
  ).pipe(
    catchError(this.handleError)
  );
}

 SessionDetails(
): Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  return this.http.get<any>(
    `${this.baseURL}/token-admin`,
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
   return throwError(() => error);
  }

}
