import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

declare const gapi:any; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public formSubmitted = false;
  // auth2: any;

  sub$: Subscription;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [ false ]
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router) { }


  ngOnInit(): void {
    // this.renderButton();
  }

  ngOnDestroy(): void {
    if( this.sub$ ){
      this.sub$.unsubscribe();
    }
  }


  login() {
    this.sub$ = this.usuarioService.login( this.loginForm.value )
      .subscribe( resp => {
        if( this.loginForm.get('remember').value ) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/');

      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      })
  }


  // renderButton() {
  //   gapi.signin2.render('my-signin2', {
  //     'scope': 'profile email',
  //     'width': 240,
  //     'height': 50,
  //     'longtitle': true,
  //     'theme': 'light'
  //   });

  //   this.startApp();
  // }

  // startApp() {
  //   await this.usuarioService.googleInit();
  //   this.auth2 = this.usuarioService.auth2;

  //   this.attachSignin(document.getElementById('my_signin2'));
    
  // }

  // attachSignin(element) {
  //   this.auth2.attachClickHandler(element, {},
  //       (googleUser) => {
  //          const id_token = googleUser.getAuthResponse().id_token;

  //          this.sub$ = this.usuarioService.loginGoogle( id_token ).subscribe();

  //          this.router.navigateByUrl('/');

  //       }, (error) => {
  //         alert(JSON.stringify(error, undefined, 2));
  //       });
  // }

}
