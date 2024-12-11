import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { LOGIN_DATA, PATH_TO_PAGE } from '../../../constants/constant';
import { ApiService } from '../../../services/api.service';
import { ILogin, ILoginDto, IRegisterDto, IUpdateTokens } from '../interfaces/login.interface';
import { Role } from '../../../models/enums/role.enum';
import { StorageService } from '../../../services/storage.service';
import { ITokenPair } from '../interfaces/token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private router: Router,
  ) {}

  login(data: ILogin | any): Observable<ILoginDto> {
    return <Observable<ILoginDto>><unknown>this.apiService.postRequest(PATH_TO_PAGE['Login'], data)
      .pipe(
        map((response: ILoginDto | any) => {
          if (!response) return [];
          this.isAuthenticated.next(response.isSucceed);
          const currentPage = this.accessToPageByRole(response.data.role) as string;
          this.redirectTo(currentPage);
          const loginData = this.storageService.setData(LOGIN_DATA, response) as Promise<ILoginDto>;
          localStorage.setItem('accessToken', response.data.tokens.accessToken);
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
          return from(loginData);
        })
      )
  }

  register(data: ILogin | any): Observable<IRegisterDto> {
    return <Observable<IRegisterDto>><unknown>this.apiService.postRequest(PATH_TO_PAGE['Register'], data)
      .pipe(
        map((response: IRegisterDto | any) => {
          if (!response) return [];
          this.isAuthenticated.next(response.isSucceed);
          this.redirectTo(PATH_TO_PAGE['User']);
          localStorage.setItem('accessToken', response.data.tokens.accessToken);
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
          const loginData = this.storageService.setData(LOGIN_DATA, response) as Promise<IRegisterDto>;
          return from(loginData);
        })
      )
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.storageService.removeData(LOGIN_DATA).then(() => {
      this.isAuthenticated.next(false);
      this.redirectTo(PATH_TO_PAGE['Login']);
    });
  }

  redirectTo(uri: string): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate([uri]));
  }

  getUserData(): Observable<ILoginDto> {
    const data = this.storageService.getData(LOGIN_DATA) as Promise<ILoginDto>;
    return from(data);
  }

  getPairTokens(): Observable<ITokenPair> {
    const loginData = from(this.storageService.getData(LOGIN_DATA) as Promise<ILoginDto>);
    return loginData.pipe(
      map((res: ILoginDto) => res.data.tokens)
    )
  }

  refreshPairTokens(token: string | null): Observable<IUpdateTokens> {
    return <Observable<IUpdateTokens>>this.apiService.postRequest(PATH_TO_PAGE['UpdateTokens'], token)
    .pipe(
      tap((response: IUpdateTokens | any) => {
        if (response.isSucceed) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      })
    );
  }

  private accessToPageByRole(roles: string[]): string | undefined {
    let pageByRole: string | undefined;
    if (roles.includes(Role.User) && !roles.includes(Role.Admin) && !roles.includes(Role.Owner)) {
      pageByRole = PATH_TO_PAGE['User'];
    }
    if (roles.includes(Role.User) && roles.includes(Role.Admin) && !roles.includes(Role.Owner)) {
      pageByRole = PATH_TO_PAGE['Admin'];
    }
    if (roles.includes(Role.User) && !roles.includes(Role.Admin) && roles.includes(Role.Owner)) {
      pageByRole = PATH_TO_PAGE['Owner'];
    }
    return pageByRole;
  }
}
