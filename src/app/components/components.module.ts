import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalClienteComponent } from './modal-cliente/modal-cliente.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalProductoComponent } from './modal-producto/modal-producto.component';
import { ModalTurnoComponent } from './modal-turno/modal-turno.component';



@NgModule({
  declarations: [  ModalClienteComponent, ModalProductoComponent, ModalTurnoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  exports: [  ],
  entryComponents: [ ModalClienteComponent, ModalProductoComponent, ModalTurnoComponent ]
})
export class ComponentsModule { }
