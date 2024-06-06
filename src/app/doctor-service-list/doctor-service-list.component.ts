import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {DoctorService} from "../model/doctorService";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {DoctorServiceService} from "../_service/doctorServiceService";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-doctor-service-list',
  standalone: true,
  imports: [
    NgForOf,
    CurrencyPipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './doctor-service-list.component.html',
  styleUrl: './doctor-service-list.component.css'
})
export class DoctorServiceListComponent implements OnInit{

  doctorServices: DoctorService[] = []
  newService: DoctorService = { name: '', price: 0 };
  constructor(private doctorServiceService: DoctorServiceService) {

  }

  ngOnInit(): void {
      this.loadServices();
  }

  loadServices(){
    this.doctorServiceService.getServices().subscribe({
      next: (data) => {
        this.doctorServices = data;
        console.log(this.doctorServices);
      },
      error: (err) => {
        console.error('Error fetching appointments', err);
      }
    });
  }
  addService(): void {
    if(!this.newService.name || !this.newService.price){
      return;
    }
    this.doctorServiceService.addDoctorService(this.newService).subscribe({
      next: (service) => {
        this.doctorServices.push(service);
        this.loadServices();

        this.newService = { name: '', price: 0 };
      },
      error: (err) => {
        console.error('Error adding doctor service', err);
      }
    });
  }



}
