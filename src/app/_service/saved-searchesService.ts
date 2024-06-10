import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DoctorService} from "../model/doctorService";
import {SavedSearch} from "../model/saved-search";
import {Appointment} from "../model/appointment";

@Injectable({
  providedIn: 'root'
})
export class SavedSearchesService {

  private apiUrl = 'http://localhost:8080/saved-searches';

  public constructor(private http: HttpClient) {
  }

  getSavedSearches(): Observable<SavedSearch[]> {
    return this.http.get<SavedSearch[]>(this.apiUrl);
  }

  saveSearch(service: SavedSearch): Observable<SavedSearch> {
    return this.http.post<SavedSearch>(this.apiUrl, service);
  }

}
