import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';

import { FullCalendarModule } from '@fullcalendar/angular';

import { AdminGuard } from '../services/admin.guard';


import { ToastrModule } from 'ngx-toastr';
import { SesionComponent } from '../components/sesion/sesion.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { MainComponent } from '../components/main/main.component';
import { ClientNewComponent } from '../modules/admin/components/client-new/client-new.component';
import { ClientListComponent } from '../modules/admin/components/client-list/client-list.component';
import { ClientSearchComponent } from '../modules/admin/components/client-search/client-search.component';
import { CompanyComponent } from '../modules/admin/components/company/company.component';
import { ItemListComponent } from '../modules/admin/components/item-list/item-list.component';
import { ItemNewComponent } from '../modules/admin/components/item-new/item-new.component';
import { ItemSearchComponent } from '../modules/admin/components/item-search/item-search.component';
import { PagosListComponent } from '../modules/admin/components/pagos-list/pagos-list.component';
import { ReservationListComponent } from '../modules/admin/components/reservation-list/reservation-list.component';
import { ReservationNewComponent } from '../modules/admin/components/reservation-new/reservation-new.component';
import { ReservationPendingComponent } from '../modules/admin/components/reservation-pending/reservation-pending.component';
import { ReservationSearchComponent } from '../modules/admin/components/reservation-search/reservation-search.component';
import { UserListComponent } from '../modules/admin/components/user-list/user-list.component';
import { UserNewComponent } from '../modules/admin/components/user-new/user-new.component';
import { UserSearchComponent } from '../modules/admin/components/user-search/user-search.component';
import { UserUpdateComponent } from '../modules/admin/components/user-update/user-update.component';
import { CategoriaListComponent } from '../modules/admin/components/categoria-list/categoria-list.component';
import { CategoriaNewComponent } from '../modules/admin/components/categoria-new/categoria-new.component';
import { CategoriaSearchComponent } from '../modules/admin/components/categoria-search/categoria-search.component';
import { EmpleadoListComponent } from '../modules/admin/components/empleado-list/empleado-list.component';
import { EmpleadoNewComponent } from '../modules/admin/components/empleado-new/empleado-new.component';
import { EmpleadoSearchComponent } from '../modules/admin/components/empleado-search/empleado-search.component';
import { VentaListComponent } from '../modules/admin/components/venta-list/venta-list.component';
import { VentaNewComponent } from '../modules/admin/components/venta-new/venta-new.component';
import { VentaSearchComponent } from '../modules/admin/components/venta-search/venta-search.component';
import { VentaPendingComponent } from '../modules/admin/components/venta-pending/venta-pending.component';
import { InicioComponent } from '../modules/admin/components/inicio/inicio.component';
import { ReservationFinishedComponent } from '../modules/admin/components/reservation-finished/reservation-finished.component';
import { AuthService } from '../services/auth.service';
import { EmpresaComponent } from '../modules/empleado/components/empresa/empresa.component';
import { HomeComponent } from '../modules/empleado/components/home/home.component';
import { PagosComponent } from '../modules/empleado/components/pagos/pagos.component';
import { PrestamosFinishedComponent } from '../modules/empleado/components/prestamos-finished/prestamos-finished.component';
import { PrestamosListComponent } from '../modules/empleado/components/prestamos-list/prestamos-list.component';
import { PrestamosNewComponent } from '../modules/empleado/components/prestamos-new/prestamos-new.component';
import { PrestamosPendingComponent } from '../modules/empleado/components/prestamos-pending/prestamos-pending.component';
import { PrestamosSearchComponent } from '../modules/empleado/components/prestamos-search/prestamos-search.component';
import { Dashboard2Component } from '../components/empleado/dashboard2/dashboard2.component';
import { Main2Component } from '../components/empleado/main2/main2.component';
import { Navbar2Component } from '../components/empleado/navbar2/navbar2.component';
import { EmpleadoGuard } from '../services/empleado.guard';
import { User2UpdateComponent } from '../modules/empleado/components/user-update2/user2-update.component';
import { PagosSearchComponent } from '../modules/admin/components/pagos-search/pagos-search.component';
import { Pagos2SearchComponent } from '../modules/empleado/components/pagos2-search/pagos2-search.component';
import { WebSocketService } from '../services/websocket.service';
import { VentasList2Component } from '../modules/empleado/components/ventas-list2/ventas-list2.component';




@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainComponent,
    InicioComponent,
    NavbarComponent,
   SesionComponent,
    ClientNewComponent,
    ClientListComponent,
    ClientSearchComponent,
    CompanyComponent,
    ItemListComponent,
    ItemNewComponent,
    ItemSearchComponent,
    PagosListComponent,
    ReservationFinishedComponent,
    ReservationListComponent,
    ReservationNewComponent,
    ReservationPendingComponent,
    ReservationSearchComponent,
    UserListComponent,
    UserNewComponent,
    UserSearchComponent,
    UserUpdateComponent,
    CategoriaListComponent,
    CategoriaNewComponent,
    CategoriaSearchComponent,
    //PARA EMPLEADOS
    EmpleadoListComponent,
    EmpleadoNewComponent,
    EmpleadoSearchComponent,
    VentaListComponent,
    VentaNewComponent,
    VentaSearchComponent,
    VentaPendingComponent,
    PagosSearchComponent,
  EmpresaComponent,
  HomeComponent,
  PagosComponent,
  PrestamosFinishedComponent,
  PrestamosListComponent,
  PrestamosNewComponent,
  PrestamosPendingComponent,
  PrestamosSearchComponent,
  Dashboard2Component,
  Main2Component,
  Navbar2Component,
 User2UpdateComponent,
 Pagos2SearchComponent,
  VentasList2Component

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FullCalendarModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right'
    }), // ToastrModule added
  ],
  providers: [AdminGuard,EmpleadoGuard,ToastrModule,WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
