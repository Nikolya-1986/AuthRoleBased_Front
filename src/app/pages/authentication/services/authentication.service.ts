import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, switchMap, tap } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { LOGIN_DATA, PAGE_BY_ROLE, PathToPage } from '../../../constants/constant';
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
    return <Observable<ILoginDto>> this.apiService.postRequest(PathToPage['Login'], data)
      .pipe(
        map((response: any) => response),
        switchMap((response) => {
          if (!response) return [];
          const currentPage = this.accessToPageByRole(response.data.role) as string;
          this.redirectTo(currentPage);
          return from(this.storage.set(LOGIN_DATA, response));
        }),
        tap((response) => {
          this.isAuthenticated.next(response.isSucceed);
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

  private accessToPageByRole(role: string): string | undefined {
    let pageByRole: string | undefined;
    switch (role) {
      case Role.User:
        pageByRole = PAGE_BY_ROLE.get(Role.User);
        break;
      case Role.Admin:
        pageByRole = PAGE_BY_ROLE.get(Role.Admin);
        break;
      case Role.Owner:
        pageByRole = PAGE_BY_ROLE.get(Role.Owner);
        break;
      default:
        pageByRole = PAGE_BY_ROLE.get(Role.User);
        break;
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
