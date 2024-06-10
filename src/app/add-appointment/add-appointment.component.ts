import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Appointment, Status} from "../model/appointment";
import {DoctorService} from "../model/doctorService";
import {SortCriteria} from "../model/sortCriteria";
import {TableColumn} from "../model/TableColumn";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {AppointmentService} from "../_service/appointmentService";
import {SavedSearchesService} from "../_service/saved-searchesService";
import {DoctorServiceService} from "../_service/doctorServiceService";
import {MatDialog} from "@angular/material/dialog";
import {AppointmentDialogUpdateComponent} from "../appointment-dialog-update/appointment-dialog-update.component";
import {SavedSearchedComponent} from "../saved-searched/saved-searched.component";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    NgForOf
  ],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css'
})
export class AddAppointmentComponent implements OnInit{
  appointments: Appointment[] = [];
  doctorServices: DoctorService[] = [];
  selectedServices: DoctorService[] = [];
  userID:number |  undefined;

  newAppointmentData: Appointment = {
    animalName: '',
    doctorName: '',
    appointmentDateTime: new Date(),
    status: Status.CREATED,
    totalCost: 0,
    serviceIds:[]
  }

  constructor(private appointmentService: AppointmentService, private doctorServiceService: DoctorServiceService, private router: Router,
              private route:ActivatedRoute) {

  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.userID = Number(params.get('id'));
      // Use this.userId to fetch user-specific data or perform other operations
      console.log(this.userID);
    });
    //this.fetchAppointments();
    this.fetchDoctorServices();

  }

  addAppointment(): void {

    if (!this.newAppointmentData.doctorName || !this.newAppointmentData.animalName || this.selectedServices.length == 0) {
      return;
    }
    const appointmentData: Appointment = {
      animalName: this.newAppointmentData.animalName,
      doctorName: this.newAppointmentData.doctorName,
      appointmentDateTime: this.newAppointmentData.appointmentDateTime,
      status: Status.CREATED,
      diagnosis: '',
      totalCost: 0,
      serviceIds: []
    };

    if (this.selectedServices.length > 0) {
      appointmentData.serviceIds = this.selectedServices
        .map(service => service.id)
        .filter((id): id is number => id !== undefined);
    }


    console.log(appointmentData)

    this.appointmentService.addAppointment(appointmentData).subscribe({
      next: (response) => {
        //alert('Appointment added successfully!')
        console.log('Appointment added successfully:', response);
        // Refresh the list of appointments

        this.newAppointmentData = {
          animalName: '',
          doctorName: '',
          appointmentDateTime: new Date(),
          status: Status.CREATED,
          diagnosis: '',
          totalCost: 0,
          serviceIds:[]
        }

        this.router.navigate([`/appointments-list/${this.userID}`]);
      },
      error: (err) => {
        alert('Error adding appointment:')
        console.error('Error adding appointment:', err);
        // Handle error messages or display them to the user
      }
    });
  }

  fetchDoctorServices(): void {
    // Call the service to fetch doctor services
    this.doctorServiceService.getServices().subscribe({
      next: (data) => {
        this.doctorServices = data;
        console.log('Doctor services:', this.doctorServices);
      },
      error: (err) => {
        console.error('Error fetching doctor services', err);
      }
    });
  }

  formatDateTime(date: Date): string {
    // Format the date as "yyyy-MM-ddTHH:mm" for input[type=datetime-local]
    const isoString = date.toISOString();
    return isoString.substring(0, 16);
  }

  parseDateTime(dateTimeString: string): Date {
    // Parse the input string to Date object
    return new Date(dateTimeString);
  }

  isSelected(service: DoctorService): boolean {
    return this.selectedServices.some(selectedService => selectedService.id === service.id);
  }

  toggleSelection(service: DoctorService): void {
    const index = this.selectedServices.findIndex(selectedService => selectedService.id === service.id);
    if (index !== -1) {
      // Service is already selected, remove it
      this.selectedServices.splice(index, 1);
    } else {
      // Service is not selected, add it
      this.selectedServices.push(service);
    }
  }



}
