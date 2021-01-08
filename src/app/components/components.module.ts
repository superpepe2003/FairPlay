import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalClienteComponent } from './modal-cliente/modal-cliente.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalProductoComponent } from './modal-producto/modal-producto.component';
import { ModalTurnoComponent } from './modal-turno/modal-turno.component';
import { NgSelect2Module } from 'ng-select2';
import { ModalListaTurnosComponent } from './modal-lista-turnos/modal-lista-turnos.component';
import { PipesModule } from '../pipes/pipes.module';
import { ModalListadoTurnosComponent } from './modal-listado-turnos/modal-listado-turnos.component';



@NgModule({
  declarations: [  ModalClienteComponent, ModalProductoComponent, ModalTurnoComponent, ModalListaTurnosComponent, ModalListadoTurnosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelect2Module,
    PipesModule
  ],
  exports: [  ],
  entryComponents: [ ModalClienteComponent, ModalProductoComponent, ModalTurnoComponent, ModalListaTurnosComponent ]
})
export class ComponentsModule { }
