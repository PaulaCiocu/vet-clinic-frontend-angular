import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {AppointmentListComponent} from "./appointment-list/appointment-list.component";
import {DoctorServiceListComponent} from "./doctor-service-list/doctor-service-list.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";


export const routes: Routes = [
  { path: '', component:HomeComponent },
  { path: 'home', component:HomeComponent},
  { path: 'appointments-list', component: AppointmentListComponent },
  { path: 'doctor-service-list', component:DoctorServiceListComponent},
  {path:  'register', component:RegisterComponent},
  {path: 'login', component:LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
