import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Appointment, Status} from "../model/appointment";
import {DoctorService} from "../model/doctorService";
import {DoctorServiceService} from "../_service/doctorServiceService";
import {AppointmentService} from "../_service/appointmentService";
import {AppointmentListComponent} from "../appointment-list/appointment-list.component";
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {
  MatCellDef,
  MatColumnDef, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {FormsModule} from "@angular/forms";
import {SavedSearch} from "../model/saved-search";
import {FilterKey} from "../model/filterKey";
import {SavedSearchesService} from "../_service/saved-searchesService";
import {SortCriteria} from "../model/sortCriteria";

@Component({
  selector: 'app-saved-searched',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    MatCellDef,
    MatColumnDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    TitleCasePipe,
    MatHeaderCellDef,
    FormsModule
  ],
  templateUrl: './saved-searched.component.html',
  styleUrl: './saved-searched.component.css'
})
export class SavedSearchedComponent{

  appointments:Appointment[]
  filterKeys: { column: string, value: string }[] = [];
  displayedColumns: string[];
  columnVisibility: { [name: string]: {column: string, filterValue: boolean}[] } = {};
  searchName: string='';
  filteredSearches: { [name: string]: {column: string, filterValue: string}[] } = {};
  savedSearch : SavedSearch ={
      name: '',
      filterKeys: []
  }
  sortingHistory:SortCriteria[];
  userId: number;
  currentPage:number;

  constructor(private dialogRef: MatDialogRef<SavedSearchedComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{filterKeys:{ column: string, value: string }[], appointment: Appointment[], displayedColumns:string[],
      savedSearchService:SavedSearchesService, sortingHistory: SortCriteria[], userId:number, pageNumber: number}) {
    this.filterKeys = data.filterKeys;
    this.appointments = data.appointment
    this.displayedColumns =data.displayedColumns
    this.sortingHistory = data.sortingHistory;
    this.userId =data.userId
    this.currentPage =data.pageNumber
    console.log(this.appointments)
    console.log(this.displayedColumns)
    console.log(this.sortingHistory)
    console.log(this.userId)
  }

  saveFilters() {
    if(!this.searchName){
      return;
    }
    this.filteredSearches[this.searchName] = this.filterKeys.map(filterKey => {
      return {column: filterKey.column, filterValue: filterKey.value};
    });

    this.columnVisibility[this.searchName] = this.displayedColumns.map(column => {
      return {column: column, filterValue: true}; // Assuming all displayed columns are visible
    });


    this.savedSearch.name = this.searchName;
    this.savedSearch.filterKeys = this.filteredSearches[this.searchName]
    this.savedSearch.sortCriteria = this.sortingHistory
    this.savedSearch.columnVisibility=this.columnVisibility[this.searchName]
    this.savedSearch.userID = this.userId;
    this.savedSearch.pageNumber = this.currentPage
    console.log(this.savedSearch)


    this.data.savedSearchService.saveSearch(this.savedSearch).subscribe({
      next: (response) => {
        alert('Saved successfully!')
        console.log('Save added successfully:', response);
        // Refresh the list of appointments


        this.savedSearch = {
          name: '',
          filterKeys: [],
        }
      },
      error: (err) => {
        alert('Error adding search:')
        console.error('Error adding search:', err);
        // Handle error messages or display them to the user
      }
    });

    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }


}
