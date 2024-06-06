import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {DoctorService} from "../model/doctorService";

@Injectable({
  providedIn: 'root'
})
export class DoctorServiceService {
  private baseUrl = 'http://localhost:8080/services';

  constructor(private http: HttpClient) { }

  getServices(): Observable<DoctorService[]> {
    return this.http.get<DoctorService[]>(this.baseUrl);
  }

  addDoctorService(service: DoctorService): Observable<DoctorService> {
    return this.http.post<DoctorService>(this.baseUrl, service);
  }

}
