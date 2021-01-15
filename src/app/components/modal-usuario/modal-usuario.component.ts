import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../model/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  @Input() usuario: Usuario;
  @Input() isModificar = false;

  public usuarioForm = this.fb.group({
    nombre: ['', [ Validators.required ]],
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', ],
    password2: ['', ],
    role: [ '', [Validators.required ]]
  }, { validators: this.passwordIguales( 'password', 'password2') });

  formSubmitted = false;
  _fecha: NgbDate;
  nuevo = false;
  roles = [{ id: 'OPERADOR_ROLE', text: 'OPERADOR_ROLE'}, { id: 'ADMIN_ROLE', text: 'ADMIN_ROLE'}];
  _role= 'OPERADOR_ROLE';
  
  options = {
    theme: 'bootstrap4',
    width: '100%'
  };

  constructor( public modal: NgbModal,
               public fb: FormBuilder,
               private usuarioService: UsuarioService,
               public activeModal: NgbActiveModal,
               private toastr: ToastrService ) {
  }

  get role() {
    return this._role;
  }

  set role( r: string ) {
    if ( r.length > 0) {
      this.usuarioForm.patchValue({ role: r });
      this._role = r;
    }
  }

  getCampo( campo: string ) {
    return this.usuarioForm.get( campo ).value;
  }

  campoNoValido( campo: string ): boolean {

    if ( this.usuarioForm.get( campo ).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }


  ngOnInit(): void {
    this.role = this.roles[0].id;
    if ( this.isModificar ) {
      this.cargarCampos();
    } else {
      this.resetearCampos();
    }
  }

  crearUsuario() {
    this.formSubmitted = true;

    if( this.usuarioForm.invalid ){
      return;
    }

    let usuario: Usuario;
    usuario = this.usuarioForm.value;

    this.usuarioService.crearUsuario( usuario )
        .subscribe( resp => {
          this.resetearCampos();
          this.nuevo = true;
          this.formSubmitted = false;
          this.toastr.success('El usuario se creo correctamente', 
                              'Creado',
                              {
                                timeOut: 3000,
                              });
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  modificarUsuario() {
    this.formSubmitted = true;
    if( this.usuarioForm.invalid ) {
      return;
    }
  
    this.usuario.nombre = this.usuarioForm.get('nombre').value;
    this.usuario.email = this.usuarioForm.get('email').value;
    this.usuario.role = this.usuarioForm.get('role').value;

    this.usuarioService.actualizarUsuario( this.usuario )
          .subscribe( resp => {
            this.resetearCampos();
            this.isModificar = false;
            this.usuario = null;
            this.toastr.success('El usuario se modifico correctamente', 
                              'Modificado',
                              {
                                timeOut: 3000,
                              });
            this.activeModal.close();
            //this.cargaProductos();
          }, (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          });

  }

  resetearCampos() {
    this.usuarioForm.reset({
      nombre: '',
      email: '',
      password: '',
      password2: '',
      role: 'OPERADOR_ROLE'
    });
    this.nuevo = false;
  }

  cargarCampos() {
    this.usuarioForm.reset({
      nombre: this.usuario.nombre,
      email: this.usuario.email,
    });
    this.role = this.usuario.role;
  }

  passwordIguales( pass1: string, pass2: string) {
   
    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);
      if( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors( null );
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    }
    
  }

}
