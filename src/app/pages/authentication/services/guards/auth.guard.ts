import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../authentication.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
        private authenticationService: AuthenticationService,
    ) {}

	canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (localStorage.getItem('accessToken') === null) {
			this.authenticationService.redirectTo('login');
			return false;
		}
		return true;
	}
}