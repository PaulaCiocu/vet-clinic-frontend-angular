import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClientModule, provideHttpClient, withFetch} from "@angular/common/http";
import {AppointmentService} from "./_service/appointmentService";
import {DoctorServiceService} from "./_service/doctorServiceService";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  providers:[AppointmentService, DoctorServiceService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vet-clinic';
}
