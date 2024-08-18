import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { LOGIN_DATA, PATH_TO_PAGE } from '../../../constants/constant';
import { ApiService } from '../../../services/api.service';
import { ILogin, ILoginDto } from '../interfaces/login.interface';
import { Role } from '../../../models/enums/role.enum';
import { StorageService } from '../../../services/storage.service';

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
        map((response: ILoginDto) => {
          if (!response) return [];
          this.isAuthenticated.next(response.isSucceed);
          const currentPage = this.accessToPageByRole(response.data.role) as string;
          this.redirectTo(currentPage);
          const loginData = this.storageService.setData(LOGIN_DATA, response) as Promise<ILoginDto>;
          return from(loginData);
        })
      )
  }

  logout(): void {
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
