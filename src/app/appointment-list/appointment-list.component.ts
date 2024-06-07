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
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {AppointmentDialogUpdateComponent} from "../appointment-dialog-update/appointment-dialog-update.component";
import {MatMultiSort, MatMultiSortModule} from "ngx-mat-multi-sort";
import {TableColumn} from "../model/TableColumn";
import {MatCheckbox} from "@angular/material/checkbox";
import {filter} from "rxjs";
import {MatMiniFabButton} from "@angular/material/button";


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
    MatIcon,
    MatMultiSortModule,
    MatSortHeader,
    MatSort,
    MatCheckbox,
    MatMiniFabButton
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  sortField: string = '';
  currentPage: number = 0;
  sortDirection: string = '';
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
  columns: TableColumn[] = [
    {id: 'id', name: 'ID', checked: true},
    {id: 'status', name: 'Status', checked: true},
    {id: 'doctorName', name: 'Doctor Name', checked: true},
    {id: 'diagnosis', name: 'Diagnosis', checked: true},
    {id: 'animalName', name: 'Animal Name', checked: true},
    {id: 'totalCost', name: 'Total Cost', checked: true},
    {id: 'appointmentDateTime', name: 'Appointment Date Time', checked: true}
  ];


  filterKeys: { column: string, value: string }[] = [];
  displayedColumns: string[] = this.columns.filter(column => column.checked).map(column => column.id);
  dataSource = new MatTableDataSource(this.appointments);
  @ViewChild(MatSort) sort: MatSort | undefined;

  appliedFilters: string[] = [];

  appointmentsDataSource: MatTableDataSource<Appointment>;


  constructor(private appointmentService: AppointmentService, private doctorServiceService: DoctorServiceService, public dialog: MatDialog) {
    this.appointmentsDataSource = new MatTableDataSource(this.appointments);
  }


  ngOnInit(): void {
    // @ts-ignore
    //this.dataSource.sort = this.sort
    this.fetchAppointments();
    this.fetchDoctorServices();

  }

  fetchAppointments(): void {
    console.log(this.filterValue)
    this.appointmentService.getFilteredAppointments(
      this.filterKeys,
      this.currentPage,
      this.sortField,
      this.sortDirection
    ).subscribe({
      next: (data) => {
        this.appointments = data.content;
        this.totalAppointments = data.totalElements;
        // Update appointmentsTable data


      },
      error: (err) => {
        console.error('Error fetching appointments', err);
      }
    });
  }

  onPageChange(page: number) {
    console.log(page)
    this.currentPage = page - 1;
    this.fetchAppointments()
  }

  onSortChange(sortField: string, sortDirection: string): void {
    console.log(this.sortField)
    this.sortField = sortField;
    this.sortDirection = sortDirection
    this.fetchAppointments();
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


  // applyFilter(event:Event) {
  //   this.filterValue = (event.target as HTMLInputElement).value;
  //   this.currentPage = 0; // Reset current page to 0 when applying filter
  //   this.fetchAppointments();
  // }

// Function to apply filter
  applyFilter() {

    if (this.filterValue) {

      console.log(this.checkIfFilterMatchesColumn(this.filterValue))
      const matchedColumn =this.checkIfFilterMatchesColumn(this.filterValue);

      if (matchedColumn) {
        this.appliedFilters = [...new Set([...this.appliedFilters, this.filterValue])];
        const filterPair = { column: matchedColumn, value: this.filterValue };

        // Check if the column already exists in filterKeys
        const existingPairIndex = this.filterKeys.findIndex(pair => pair.column === filterPair.column);

        if (existingPairIndex !== -1) {
          // Update the value if the column already exists
          this.filterKeys[existingPairIndex].value = filterPair.value;
        } else {
          // Add the filter pair if the column does not exist
          this.filterKeys.push(filterPair);
        }



      }

      console.log(this.filterKeys)

    }
    // Call your filter function passing the filters
    this.fetchAppointments();
  }

  cancelFilter() {
    this.filterValue = '';
    this.fetchAppointments();
  }

  removeFilter(filter: string) {
    this.appliedFilters = this.appliedFilters.filter(f => f !== filter);
    // Remove the corresponding filter pair from filterKeys
    this.filterKeys = this.filterKeys.filter(pair => pair.value !== filter);
    // Call your filter function passing the updated filters
    this.fetchAppointments();
  }

  toggleColumn(column: TableColumn) {
    this.displayedColumns = this.columns.filter(col => col.checked).map(col => col.id);
  }

  checkIfFilterMatches(filter: string): boolean {
    const filterLowerCase = filter.toLowerCase();
    return this.appointments.some(appointment => {
      return (
        (appointment.animalName && appointment.animalName.toLowerCase().includes(filterLowerCase)) ||
        (appointment.doctorName && appointment.doctorName.toLowerCase().includes(filterLowerCase)) ||
        (appointment.appointmentDateTime && appointment.appointmentDateTime.toString().toLowerCase().includes(filterLowerCase)) ||
        (appointment.status && appointment.status.toLowerCase().includes(filterLowerCase)) ||
        (appointment.diagnosis && appointment.diagnosis.toLowerCase().includes(filterLowerCase)) ||
        (appointment.totalCost && appointment.totalCost.toString().toLowerCase().includes(filterLowerCase))
      );
    });
  }
  checkIfFilterMatchesColumn(filter: string): string | null {
    const filterLowerCase = filter.toLowerCase();

    for (const appointment of this.appointments) {
      if (appointment.animalName && appointment.animalName.toLowerCase().includes(filterLowerCase)) {
        return 'animalName';
      }
      if (appointment.doctorName && appointment.doctorName.toLowerCase().includes(filterLowerCase)) {
        return 'doctorName';
      }
      if (appointment.appointmentDateTime && appointment.appointmentDateTime.toString().toLowerCase().includes(filterLowerCase)) {
        return 'appointmentDateTime';
      }
      if (appointment.status && appointment.status.toLowerCase().includes(filterLowerCase)) {
        return 'status';
      }
      if (appointment.diagnosis && appointment.diagnosis.toLowerCase().includes(filterLowerCase)) {
        return 'diagnosis';
      }
      if (appointment.totalCost && appointment.totalCost.toString().toLowerCase().includes(filterLowerCase)) {
        return 'totalCost';
      }
    }

    return null; // Return null if no match is found
  }



}
