import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { LOGIN_DATA, PAGE_BY_ROLE, PATH_TO_PAGE } from '../../../constants/constant';
import { ApiService } from '../../../services/api.service';
import { ILogin, ILoginDto } from '../interfaces/login.interface';
import { Role } from '../../../models/enums/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService,
    private storage: Storage,
    private router: Router,
  ) {
    this.storage.create();
  }

  login(data: ILogin): Observable<ILoginDto> {
    return <Observable<ILoginDto>> <unknown>this.apiService.postRequest(PATH_TO_PAGE['Login'], data)
      .pipe(
        map((response: any) => {
          if (!response) return [];
          this.isAuthenticated.next(response.isSucceed);
          const currentPage = this.accessToPageByRole(response.data.role) as string;
          this.redirectTo(currentPage);
          return from(this.storage.set(LOGIN_DATA, response));
        })
      )
  }

  logout(): void {
    this.storage.remove(LOGIN_DATA).then(() => {
      this.isAuthenticated.next(false);
    });
  }

  redirectTo(uri: string): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate([uri]));
  }

  private accessToPageByRole(roles: string[]): string | undefined {
    let pageByRole: string | undefined;
    if (roles.includes(Role.User) && !roles.includes(Role.Admin) && !roles.includes(Role.Owner)) {
      pageByRole = PAGE_BY_ROLE.get(Role.User);
    }
    if (roles.includes(Role.User) && roles.includes(Role.Admin) && !roles.includes(Role.Owner)) {
      pageByRole = PAGE_BY_ROLE.get(Role.Admin);
    }
    if (roles.includes(Role.User) && !roles.includes(Role.Admin) && roles.includes(Role.Owner)) {
      pageByRole = PAGE_BY_ROLE.get(Role.Owner);
    }
    return pageByRole;
  }

  getUserData(): Promise<any> {
    return this.storage.get(LOGIN_DATA);
  }
}
