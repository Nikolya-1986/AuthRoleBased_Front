import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  postRequest<T>(pathToFile: string, data: T): Observable<T> {
    console.log({pathToFile});
    console.log(data)
    return <Observable<T>> this.httpClient.post(`${environment.baseUrl}${pathToFile}`, data, this.httpHeader);
  };

  private httpHeader = {
    headers: new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Origin, Authorization',
      'Access-Control-Allow-Methods': 'PUT, GET, HEAD, POST, DELETE, OPTIONS',
    }),
};

  private errorsBackend(errorHttp: HttpErrorResponse): Observable<any> {
    let message = '';
    if(errorHttp.error instanceof ErrorEvent) {
        message = errorHttp.error.message;
    }else {
        message = `Error Ccode: ${errorHttp.status}\nMessage: ${errorHttp.message}`;
    };
    console.log("Error:", errorHttp);
    return throwError(errorHttp);
};
}
