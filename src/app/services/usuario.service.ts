
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario.model';
import { catchError, map, tap } from 'rxjs/operators';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';
import { LoginInterface } from '../interfaces/login.interface';


declare const gapi: any;
const base_url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) {

      // this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role() {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario._id || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  validarToken(): Observable<boolean> {
    
    return this.http.get(`${ base_url }/login/renew`, this.headers )
      .pipe(
      map( (resp: any) => {
        const {email, img = '', google , nombre, role, _id } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, _id);
        
        localStorage.setItem('token', resp.token);
        localStorage.setItem('menu', JSON.stringify( resp.menu ));

        return true;
      }),
      catchError( error => {
        return of(false) })
    );

  }

  login( login: LoginInterface ) {
    console.log( login );
    return this.http.post(`${ base_url }/login`, login )
              .pipe(
                tap( console.log ),
                tap( (resp: any) => {
                    localStorage.setItem('token', resp.token);
                    localStorage.setItem('menu', JSON.stringify( resp.menu ));
                })
              );

  }

  loginGoogle( token: string ) {

    return this.http.post(`${ base_url }/login/google`, { token })
            .pipe(
              tap( (resp: any) => {
                  localStorage.setItem('token', resp.token);
              })
            );

  }

  // googleInit() {

  //   return new Promise<void>( resolve => {

  //     gapi.load('auth2', () => {
  //       // Retrieve the singleton for the GoogleAuth library and set up the client.
  //       this.auth2 = gapi.auth2.init({
  //         client_id: '868238358415-ectetcd1knaf1r0i1nkqglmngrlgf4sa.apps.googleusercontent.com',
  //         cookiepolicy: 'single_host_origin',
  //       });
  //       resolve();
  //     });
  //   });
  // }

  logout() {

    //TODO: BORRAR MENU

    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.router.navigateByUrl('/login');
    // this.auth2.signOut().then( () => {
    //   this.ngZone.run( () => {
    //     this.router.navigateByUrl('/login');
    //   });
    // });

  }


  crearUsuario( usuario: Usuario ) {

    return this.http.post(`${ base_url }/usuarios`, usuario, this.headers)
              .pipe(
                tap( (resp: any) => {
                    localStorage.setItem('token', resp.token);
                })
              );

  }

  actualizarUsuario( usuario: Usuario ) {

    return this.http.put(`${ base_url }/usuarios/${ usuario._id }`, usuario, this.headers );

  }

  cargarUsuarios( desde: number = 0 ) {
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuarios>( url, this.headers )
              .pipe(
                map( resp => {
                  const usuarios = resp.usuarios.map(
                    user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user._id)
                  );

                  return {
                    total: resp.total,
                    usuarios
                  };
                })
              );
  }

  eliminarUsuario( uid ) {

    const url = `${ base_url }/usuarios/${ uid }`;
    return this.http.delete( url, this.headers );

  }

  guardarUsuario( usuario: Usuario ) {

    return this.http.put(`${ base_url }/usuarios/${ usuario._id }`, usuario, this.headers );

  }

}
