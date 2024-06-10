import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {routes} from "../app.routes";
import {NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  userId: string | null | undefined ;

  constructor(private router: Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      // Use this.userId to fetch user-specific data or perform other operations
      console.log(this.userId);
    });
  }

  goToAppointmentList() {
    this.router.navigate([`/appointments-list/${this.userId}`]);
  }


  viewDoctorService() {
    this.router.navigate(['/doctor-service-list'])
  }

  savedSearchesList() {
    this.router.navigate([`/saved-searches-list/${this.userId}`])
  }

  addAppointment() {
    this.router.navigate([`/add-appointment/${this.userId}`])
  }
}
