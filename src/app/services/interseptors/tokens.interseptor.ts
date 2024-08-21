import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";

import { AuthenticationService } from "../../pages/authentication/services/authentication.service";
import { IUpdateTokens } from "../../pages/authentication/interfaces/login.interface";

export const tokensInterseptor: HttpInterceptorFn = (
    request: HttpRequest<any>,
    next: HttpHandlerFn,
    authenticationService: AuthenticationService = inject(AuthenticationService),
    jwtHelper: JwtHelperService = inject(JwtHelperService),
) => {
    const accessToken = localStorage.getItem('accessToken') as string;
    const refreshToken = localStorage.getItem('refreshToken');
    const expiredAccessToken = jwtHelper.isTokenExpired(accessToken);
    // const expiredRefreshToken = jwtHelper.isTokenExpired(refreshToken);
    if(request.url.split('=')[2] === 'updateTokens') {
        return next(request);
    }
    if (accessToken && !expiredAccessToken) {
        request = setAuthorizationHeader(request, accessToken);
        return next(request);
    }
    if (accessToken && expiredAccessToken) {
        return handleTokenExpired(request, next, refreshToken, authenticationService);
    }
    // if (expiredAccessToken && expiredRefreshToken) {
    //     authenticationService.logout();
    //     return NEVER;
    // }
    // If there is no token, pass the original request
    // return next(request);
    return next(request).pipe(
        catchError((error) => {
            if (error.status === 401) {
              return handleTokenExpired(request, next, refreshToken);
            }
            return throwError(error);
        })
    )
};

const setAuthorizationHeader = (request: HttpRequest<any>, token: string): HttpRequest<any> => {
    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
}

const handleTokenExpired = (
    request: HttpRequest<any>,
    next: HttpHandlerFn,
    token: string | null,
    authenticationService: AuthenticationService = inject(AuthenticationService),
): Observable<HttpEvent<any>> => {
    return authenticationService.refreshPairTokens(token).pipe(
        switchMap((response: IUpdateTokens) => {
            if (response.isSucceed && response.data.accessToken) {
                request = setAuthorizationHeader(request, response.data.accessToken);
                return next(request);
            } else {
                authenticationService.logout();
                 return throwError('Reauthentication failed.');
            }
          })
    );
}
