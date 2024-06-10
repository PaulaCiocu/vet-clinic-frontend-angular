import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Appointment} from "../model/appointment";
import {DoctorService} from "../model/doctorService";
import {SortCriteria} from "../model/sortCriteria";


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/appointments';

  constructor(private http: HttpClient) { }

  getAppointments(page?: number, sortField?:string, sortDirection?: string): Observable<any> {
    let url = `${this.apiUrl}?page=${page}`
    if (sortField != '') {
      url += `&sort=${sortField}`;
    }
    if(sortDirection){
      url += `,${sortDirection}`
    }

    return this.http.get<any>(`${url}`).pipe(
      map(response => response.content)
    );
  }

  getFilteredAppointments(filters:  { column: string, value: string }[], page: number, sortField?: string, sortDirection?: string): Observable<any> {

    let params = new HttpParams().set('page', page.toString());

    // Add filters to the params
    filters.forEach(filter => {
      params = params.set(filter.column, filter.value);
    });

    if (sortField) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }

  getFilteredAppointmentsMultipleCriteria(filters: { column: string, value: string }[], page: number, sort: SortCriteria[]): Observable<any> {

    let params = new HttpParams().set('page', page.toString());

    // Add filters to the params
    filters.forEach(filter => {
      params = params.set(filter.column, filter.value);
    });

    // Add sort criteria to the params
    sort.forEach(sortCriteria => {
      params = params.append('sort', `${sortCriteria.column},${sortCriteria.direction}`);
    });

    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }



  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(appointmentData: any): Observable<Appointment> {
    return this.http.put<Appointment>(this.apiUrl, appointmentData);
  }

}
