import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { PathToPage } from '../../../constants/constant';
import { ApiService } from '../../../services/api.service';
import { ILogin, ILoginDto } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private apiService: ApiService,
  ) { }

  login(data: ILogin): Observable<ILoginDto> {
    return <Observable<ILoginDto>> this.apiService.postRequest(PathToPage['Login'], data)
      .pipe(
        map((response: any) => {
          if (response) return response;
        })
      )
  }
}
