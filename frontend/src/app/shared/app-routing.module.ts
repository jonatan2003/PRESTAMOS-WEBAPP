import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AdminGuard } from '../services/admin.guard';

import { SesionComponent } from '../components/sesion/sesion.component';
import { MainComponent } from '../components/main/main.component';
import { InicioComponent } from '../modules/admin/components/inicio/inicio.component';
import { ClientListComponent } from '../modules/admin/components/client-list/client-list.component';
import { ClientNewComponent } from '../modules/admin/components/client-new/client-new.component';
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
import { CategoriaNewComponent } from '../modules/admin/components/categoria-new/categoria-new.component';
import { CategoriaListComponent } from '../modules/admin/components/categoria-list/categoria-list.component';
import { CategoriaSearchComponent } from '../modules/admin/components/categoria-search/categoria-search.component';
import { EmpleadoNewComponent } from '../modules/admin/components/empleado-new/empleado-new.component';
import { EmpleadoListComponent } from '../modules/admin/components/empleado-list/empleado-list.component';
import { EmpleadoSearchComponent } from '../modules/admin/components/empleado-search/empleado-search.component';
import { VentaNewComponent } from '../modules/admin/components/venta-new/venta-new.component';
import { VentaListComponent } from '../modules/admin/components/venta-list/venta-list.component';
import { VentaSearchComponent } from '../modules/admin/components/venta-search/venta-search.component';
import { VentaPendingComponent } from '../modules/admin/components/venta-pending/venta-pending.component';
import { ReservationFinishedComponent } from '../modules/admin/components/reservation-finished/reservation-finished.component';


import { AuthService } from '../services/auth.service';
import { HomeComponent } from '../modules/empleado/components/home/home.component';
import { PagosComponent } from '../modules/empleado/components/pagos/pagos.component';
import { PrestamosListComponent } from '../modules/empleado/components/prestamos-list/prestamos-list.component';
import { PrestamosNewComponent } from '../modules/empleado/components/prestamos-new/prestamos-new.component';
import { PrestamosPendingComponent } from '../modules/empleado/components/prestamos-pending/prestamos-pending.component';
import { PrestamosSearchComponent } from '../modules/empleado/components/prestamos-search/reservation-search.component';
import { PrestamosFinishedComponent } from '../modules/empleado/components/prestamos-finished/prestamos-finished.component';
import { Main2Component } from '../components/empleado/main2/main2.component';
import { EmpleadoGuard } from '../services/empleado.guard';
import { EmpresaComponent } from '../modules/empleado/components/empresa/empresa.component';
import { User2UpdateComponent } from '../modules/empleado/components/user-update2/user2-update.component';
import { PagosSearchComponent } from '../modules/admin/components/pagos-search/pagos-search.component';
import { Pagos2SearchComponent } from '../modules/empleado/components/pagos2-search/pagos2-search.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SesionComponent },

  // { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'admin',
    component: MainComponent,
    canActivate: [AdminGuard,],
    children: [
      { path: '', component: InicioComponent},
      { path: 'client-list', component: ClientListComponent},
      { path: 'client-new', component: ClientNewComponent },
      { path: 'client-search', component: ClientSearchComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'item-list', component: ItemListComponent },
      { path: 'item-new', component: ItemNewComponent },
      { path: 'item-search', component: ItemSearchComponent },
      { path: 'pagos-list', component: PagosListComponent},
      { path: 'pagos-search', component: PagosSearchComponent},
      { path: 'reservation-list', component: ReservationListComponent },
      { path: 'reservation-new', component: ReservationNewComponent},
      { path: 'reservation-pending', component: ReservationPendingComponent },
      { path: 'reservation-search', component: ReservationSearchComponent },
      { path: 'reservation-finished', component: ReservationFinishedComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'user-new', component: UserNewComponent },
      { path: 'user-search', component: UserSearchComponent },
      { path: 'user-update', component: UserUpdateComponent },
      { path: 'categoria-new', component: CategoriaNewComponent },
      { path: 'categoria-list', component: CategoriaListComponent },
      { path: 'categoria-search', component: CategoriaSearchComponent },
      { path: 'empleado-new', component: EmpleadoNewComponent },
      { path: 'empleado-list', component: EmpleadoListComponent },
      { path: 'empleado-search', component: EmpleadoSearchComponent },
      { path: 'venta-new', component: VentaNewComponent },
      { path: 'venta-list', component: VentaListComponent },
      { path: 'venta-search', component: VentaSearchComponent },
      { path: 'venta-pending', component: VentaPendingComponent },
      { path: '', component: MainComponent},
      { path: '**', component: MainComponent },


      // Otras rutas secundarias
    ]
  },
  {
    path: 'empleado',
    component: Main2Component,
    canActivate: [EmpleadoGuard],
    children: [
      { path: '', component: HomeComponent},
      { path: 'empresa', component: EmpresaComponent},
      { path: 'pagos-list', component: PagosComponent },
      { path: 'pagos-search', component: Pagos2SearchComponent },
      { path: 'prestamos-list', component: PrestamosListComponent },
      { path: 'prestamos-new', component: PrestamosNewComponent},
      { path: 'prestamos-pending', component: PrestamosPendingComponent },
      { path: 'prestamos-search', component: PrestamosSearchComponent },
      { path: 'prestamos-finished', component: PrestamosFinishedComponent },
      { path: 'user-update', component: User2UpdateComponent },

      { path: '', component: Main2Component},
      { path: '**', component: Main2Component },


      // Otras rutas secundarias
    ]
  },



  { path: '**',  redirectTo: '/login',  pathMatch: 'full' },
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }