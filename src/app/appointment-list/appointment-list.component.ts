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
import {SavedSearchedComponent} from "../saved-searched/saved-searched.component";
import {SavedSearchesService} from "../_service/saved-searchesService";
import {SortCriteria} from "../model/sortCriteria";
import {ActivatedRoute} from "@angular/router";


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
  allAppointments:Appointment[]=[]
  sortField: string = '';
  currentPage: number = 0;
  sortDirection: string = '';
  doctorServices: DoctorService[] = [];
  filterValue: string = '';
  sortingHistory: SortCriteria[] = [];
  totalAppointments: number = 0;

  columns: TableColumn[] = [
    {id: 'animalName', name: 'Animal Name', checked: true, sorted: false, direction: ''},
    {id: 'doctorName', name: 'Doctor Name', checked: true, sorted:false, direction:''},
    {id: 'appointmentDateTime', name: 'Appointment Date Time', checked: true, sorted:false, direction:''},
    {id: 'diagnosis', name: 'Diagnosis', checked: true, sorted:false, direction:'' },
    {id: 'totalCost', name: 'Total Cost', checked: true, sorted:false, direction:''},
    {id: 'status', name: 'Status', checked: true, sorted:false, direction:''},
  ];

  filterKeys: { column: string, value: string }[] = [];
  displayedColumns: string[] = this.columns.filter(column => column.checked).map(column => column.id);
  @ViewChild(MatSort) sort: MatSort | undefined;

  appliedFilters: string[] = [];

  appointmentsDataSource: MatTableDataSource<Appointment>;
  private userId: number | undefined;


  constructor(private appointmentService: AppointmentService,private savedSearchService:SavedSearchesService, private doctorServiceService: DoctorServiceService,
              private route: ActivatedRoute, public dialog: MatDialog) {
    this.appointmentsDataSource = new MatTableDataSource(this.appointments);
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        this.userId = Number(params.get('id'));
        console.log(this.userId);
      });

    this.fetchAppointments();
    this.fetchDoctorServices();
    this.fetchAllAppointment();


  }

  fetchAllAppointment(){
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.allAppointments = data
        console.log(this.allAppointments)
        // Update appointmentsTable data
      },
      error: (err) => {
        console.error('Error fetching all appointments', err);
      }
    });
  }
  fetchAppointments(): void {
    console.log(this.filterValue)
    this.appointmentService.getFilteredAppointments(
      this.filterKeys,
      this.sortField,
      this.sortDirection,
      this.currentPage
    ).subscribe({
      next: (data) => {
        this.appointments = data.content;
        this.totalAppointments = data.totalElements;
        console.log(this.appointments)
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
  updateColumnSorting(columnId: string, direction: string): void {
    const column = this.columns.find(col => col.id === columnId);
    if (column) {
      column.sorted = true;
      column.direction = direction;
    }

    const index = this.sortingHistory.findIndex(criteria => criteria.column === columnId);

    if (index !== -1) {
      this.sortingHistory[index].direction = direction;
    } else {
      this.sortingHistory.push({ column: columnId, direction: direction });
    }

  }

  onSortChange(sortField: string, sortDirection: string): void {
    console.log(this.sortField)
    this.sortField = sortField;
    this.sortDirection = sortDirection;
    this.updateColumnSorting(sortField, sortDirection);
    console.log(this.sortingHistory)
    this.fetchAppointments();
  }

  fetchDoctorServices(): void {
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
    if (this.filterValue) {
      console.log(this.checkIfFilterMatchesColumn(this.filterValue))
      const matchedColumn =this.checkIfFilterMatchesColumn(this.filterValue);
      if (matchedColumn) {
        this.appliedFilters = [...new Set([...this.appliedFilters, this.filterValue])];
        const filterPair = { column: matchedColumn, value: this.filterValue };
        const existingPairIndex = this.filterKeys.findIndex(pair => pair.column === filterPair.column);

        if (existingPairIndex !== -1) {
          this.filterKeys[existingPairIndex].value = filterPair.value;
        } else {
          this.filterKeys.push(filterPair);
        }

      }
      console.log(this.filterKeys)
    }
    this.filterValue ='';
    this.fetchAppointments();
  }

  removeFilter(filter: string) {
    this.appliedFilters = this.appliedFilters.filter(f => f !== filter);
    this.filterKeys = this.filterKeys.filter(pair => pair.value !== filter);
    this.fetchAppointments();
  }

  toggleColumn(column: TableColumn) {
    this.displayedColumns = this.columns.filter(col => col.checked).map(col => col.id);
  }

  checkIfFilterMatchesColumn(filter: string): string | null {
    const filterLowerCase = filter.toLowerCase();
    this.fetchAllAppointment()
    for (const appointment of this.allAppointments) {
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
    return null;
  }


  saveFilter() {
    console.log(this.filterKeys);
    const dialogRef = this.dialog.open(SavedSearchedComponent,{
        data:{
          filterKeys: this.filterKeys,
          appointment: this.appointments,
          displayedColumns: this.displayedColumns,
          savedSearchService: this.savedSearchService,
          sortingHistory: this.sortingHistory,
          userId:this.userId,
          pageNumber: this.currentPage
        }

    }
    );
  }

}
