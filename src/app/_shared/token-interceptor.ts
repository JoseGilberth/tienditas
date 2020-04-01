import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { configuraciones } from 'src/environments/configuraciones';


@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req.clone({});

        try {
            let access_token = localStorage.getItem(configuraciones.datos.access_token);
            access_token.length.toString();
            if (access_token != "" || access_token.length > 4) {
                authReq = req.clone({
                    headers: new HttpHeaders({
                        'Authorization': 'Bearer ' + access_token
                    })
                });
            }
        } catch{
        }

        return next.handle(authReq).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    localStorage.setItem(configuraciones.datos.access_token, "");
                    this.router.navigate(['login']);
                }
                return throwError(error);
            }));
    }
}