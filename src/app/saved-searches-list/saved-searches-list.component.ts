import {Component, Injectable, OnInit} from '@angular/core';
import {SavedSearchesService} from "../_service/saved-searchesService";
import {SavedSearch} from "../model/saved-search";
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {FilterKey} from "../model/filterKey";
import {SortCriteria} from "../model/sortCriteria";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
  MatCellDef,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {Appointment} from "../model/appointment";
import {AppointmentService} from "../_service/appointmentService";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-saved-searches-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatSortHeader,
    TitleCasePipe,
    MatColumnDef,
    MatHeaderCellDef,
    DatePipe,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatSort,
    MatTable
  ],
  templateUrl: './saved-searches-list.component.html',
  styleUrl: './saved-searches-list.component.css'
})

export class SavedSearchesListComponent implements OnInit{

  savedSearches: SavedSearch[] =[];
  appointments:Appointment[] =[];
  appointmentsBySearch: { [name: string]: Appointment[] } = {};
  filteredSearches: { [name: string]: FilterKey[] } = {};
  filterKeys: { column: string, value: string }[] = [];
  sortingHistorySearches :{ [name: string]: SortCriteria[] } = {}
  columnVisibility: { [name: string]: string[] } = {};
  userID:number | undefined;

  constructor(private savedSearchesService:SavedSearchesService, private appointmentService: AppointmentService, private route:ActivatedRoute) {

  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.userID = Number(params.get('id'));
      // Use this.userId to fetch user-specific data or perform other operations
      console.log(this.userID);
    });
    this.fetchSearches();

  }

  fetchSearches(){
    this.savedSearchesService.getSavedSearches().subscribe({
      next: (data) => {
        this.savedSearches = data;
        this.savedSearches.forEach(search => {
          if(search.userID == this.userID){
            console.log("Same ids");
            this.filteredSearches[search.name] = search.filterKeys?.map(filterKey => {
              return { column: filterKey.column, filterValue: filterKey.filterValue };
            }) || [];
            this.columnVisibility[search.name] = search.columnVisibility?.map(visible => visible.column) || [];


            // Populate sortingHistorySearches
            this.sortingHistorySearches[search.name] = search.sortCriteria || [];

            this.filterKeys = search.filterKeys?.map(filterKey => {
              return { column: filterKey.column, value: filterKey.filterValue };
            }) || [];

            const firstSortCriteria = this.sortingHistorySearches[search.name][0] || null;
            this.appointmentService.getFilteredAppointmentsMultipleCriteria(
              this.filterKeys,
              0,
              this.sortingHistorySearches[search.name]
            ).subscribe({
              next: (data) => {
                console.log("Appointments retrieved succesfull");
                console.log(search.userID)
                console.log(this.filterKeys);
                this.appointmentsBySearch[search.name] = data.content;
                console.log(data.content)


              },
              error: (err) => {
                console.error('Error fetching appointments', err);
              }
            });
          }

        });
        //console.log(this.appointments)
        //console.log(this.savedSearches);
        //console.log(this.filteredSearches);
        //console.log(this.sortingHistorySearches)
      },
      error: (err) => {
        console.error('Error fetching searches', err);
      }
    });
  }







  protected readonly Object = Object;

}
