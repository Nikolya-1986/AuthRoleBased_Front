import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, switchMap, tap } from 'rxjs';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { LOGIN_DATA, PAGE_BY_ROLE, PathToPage } from '../../../constants/constant';
import { ApiService } from '../../../services/api.service';
import { ILogin, ILoginDto } from '../interfaces/login.interface';
import { Role } from '../../../models/enums/role.enum';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService,
    private storage: Storage,
    private router: Router,
    private storageService: StorageService,
  ) {
    this.storage.create();
  }

  login(data: ILogin): Observable<ILoginDto> {
    return <Observable<ILoginDto>> this.apiService.postRequest(PathToPage['Login'], data)
      .pipe(
        map((response: any) => response),
        switchMap((response: any) => {
          if (!response) return [];
          const currentPage = this.accessToPageByRole(response.data.role) as string;
          this.redirectTo(currentPage);
          return from(this.storage.set(LOGIN_DATA, response));
          // return from(this.storageService.setObject(LOGIN_DATA, response));
        }),
        tap((response: any) => {
          console.log(response)
          this.isAuthenticated.next(response.isSucceed);
        })
      )
  }

  logout(): void {
    this.storageService.removeItem(LOGIN_DATA).then(() => {
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

  // isLoggedIn() {
  //   this.storage.get('USER_INFO').then((response) => {
  //     if (response) {
  //       console.log(response)
  //       this.isAuthenticated.set(true);
  //     }
  //   });
  // }
}
