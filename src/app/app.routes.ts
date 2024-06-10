import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {AppointmentListComponent} from "./appointment-list/appointment-list.component";
import {DoctorServiceListComponent} from "./doctor-service-list/doctor-service-list.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {SavedSearchesListComponent} from "./saved-searches-list/saved-searches-list.component";
import {AddAppointmentComponent} from "./add-appointment/add-appointment.component";


export const routes: Routes = [
  { path: '', component:LoginComponent },
  { path: 'home/:id', component:HomeComponent},
  { path: 'appointments-list/:id', component: AppointmentListComponent },
  { path: 'doctor-service-list', component:DoctorServiceListComponent},
  {path:  'register', component:RegisterComponent},
  {path: 'login', component:LoginComponent},
  {path: 'saved-searches-list/:id', component:SavedSearchesListComponent},
  {path: 'add-appointment/:id', component: AddAppointmentComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
