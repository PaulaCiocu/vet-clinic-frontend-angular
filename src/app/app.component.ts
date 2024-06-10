import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClientModule, provideHttpClient, withFetch} from "@angular/common/http";
import {AppointmentService} from "./_service/appointmentService";
import {DoctorServiceService} from "./_service/doctorServiceService";
import {AuthService} from "./_service/authService";
import {SavedSearchesService} from "./_service/saved-searchesService";
import {SavedSearchedComponent} from "./saved-searched/saved-searched.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  providers:[AppointmentService, DoctorServiceService, AuthService, SavedSearchesService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vet-clinic';
}
