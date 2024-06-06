import {Component, OnInit, ViewChild} from '@angular/core';
import {AppointmentService} from "../_service/appointmentService";
import {Appointment, Status} from "../model/appointment";
import {
  MatCellDef, MatColumnDef,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";

import {MatFormField} from "@angular/material/form-field";
import {MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {CommonModule, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {FormsModule} from "@angular/forms";
import { DoctorService } from '../model/doctorService';
import {DoctorServiceService} from "../_service/doctorServiceService";
import {MatSort} from "@angular/material/sort";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {AppointmentDialogUpdateComponent} from "../appointment-dialog-update/appointment-dialog-update.component";

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatLabel,
    MatOption,
    MatTable,
    MatPaginator,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatCellDef,
    NgForOf,
    NgIf,
    MatHeaderRow,
    MatRow,
    MatColumnDef,
    TitleCasePipe,
    CommonModule,
    FormsModule,
    MatIcon
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent implements OnInit{
  appointments: Appointment[] = [];
  displayedColumns: string[] = ['id', 'status', 'doctorName', 'diagnosis', 'animalName', 'totalCost', 'appointmentDateTime'];
  sortField: string = this.displayedColumns[6];
  currentPage : number =0;
  sortDirection: 'asc' | 'desc' = 'desc';
  doctorServices: DoctorService[] = []; // Assuming you have a DoctorService model
  selectedServices: DoctorService[] = [];
  filterValue: string = '';
  totalAppointments: number = 0;

  newAppointmentData: Appointment = {
    animalName: '',
    doctorName: '',
    appointmentDateTime: new Date(),
    status: Status.CREATED,
    totalCost: 0
  }


  constructor(private appointmentService: AppointmentService, private doctorServiceService: DoctorServiceService, public dialog:MatDialog) { }


  ngOnInit(): void {
    this.fetchAppointments();
    this.fetchDoctorServices();

  }

  fetchAppointments(): void {
    console.log(this.filterValue)
    this.appointmentService.getFilteredAppointments(
      this.filterValue,
      this.currentPage,
      this.sortField,
      this.sortDirection
    ).subscribe({
      next: (data) => {
        this.appointments = data.content;
        this.totalAppointments = data.totalElements;
      },
      error: (err) => {
        console.error('Error fetching appointments', err);
      }
    });
  }

  onPageChange(page:number){
    console.log(page)
    this.currentPage = page-1;
    this.fetchAppointments()
  }

  onSortChange(sortField: string, sortDirection: 'asc' | 'desc'): void {
    console.log(this.sortField)
    this.sortField = sortField;
    this.sortDirection = sortDirection
    this.fetchAppointments();
  }

  addAppointment(): void {

    if(!this.newAppointmentData.doctorName || !this.newAppointmentData.animalName || this.selectedServices.length ==0){
      return;
    }
    const appointmentData : Appointment = {
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
        console.log('Appointment added successfully:', response);
        // Refresh the list of appointments
        this.fetchAppointments();

        this.newAppointmentData = {
          animalName: '',
          doctorName: '',
          appointmentDateTime: new Date(),
          status: Status.CREATED,
          diagnosis: '',
          totalCost: 0
        }
      },
      error: (err) => {
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


  openEditDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentDialogUpdateComponent, {
      data: {
        appointment,
        doctorServices: this.doctorServices,
        doctorServiceService: this.doctorServiceService,
        appointmentService: this.appointmentService,
        appointmentListComponent: this
      }
    });

  }

  applyFilter() {
    this.currentPage = 0; // Reset current page to 0 when applying filter
    this.fetchAppointments();
  }

  cancelFilter() {
    this.filterValue='';
    this.fetchAppointments();
  }
}
