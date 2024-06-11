import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DoctorServiceService} from "../_service/doctorServiceService";
import {Appointment, Status} from "../model/appointment";
import {app} from "../../../server";
import {DoctorService} from "../model/doctorService";
import {AppointmentService} from "../_service/appointmentService";
import {response} from "express";
import {AppointmentListComponent} from "../appointment-list/appointment-list.component";

@Component({
  selector: 'app-appointment-dialog-update',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './appointment-dialog-update.component.html',
  styleUrl: './appointment-dialog-update.component.css'
})
export class AppointmentDialogUpdateComponent {

  appointmentData: Appointment;
  statusOptions = Object.values(Status); // To get the enum values for the dropdown
  doctorServices: DoctorService[] = [];
  selectedServices: DoctorService[] =[];
  constructor( private dialogRef: MatDialogRef<AppointmentDialogUpdateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment, doctorServices: DoctorService[] , doctorServiceService: DoctorServiceService,
              appointmentService: AppointmentService, appointmentListComponent: AppointmentListComponent
              }) {
    console.log(this.data.appointment)
    this.appointmentData = {
      ...data.appointment,
      appointmentDateTime: new Date(data.appointment.appointmentDateTime)
    };
    this.doctorServices = data.doctorServices;
    this.displaySelectedServices();

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateAppointment() {

    if(!this.appointmentData.doctorName || !this.appointmentData.animalName){
      return;
    }
    if(this.appointmentData.status == Status.COMPLETED && !this.appointmentData.diagnosis){
      return;
    }
    const appointmentData: Appointment = {
      id: this.appointmentData.id,
      animalName: this.appointmentData.animalName,
      doctorName: this.appointmentData.doctorName,
      appointmentDateTime: this.appointmentData.appointmentDateTime,
      status: this.appointmentData.status,
      diagnosis: this.appointmentData.diagnosis,
      totalCost: 0,
      serviceIds: []
    };

    if (this.selectedServices.length > 0) {
      appointmentData.serviceIds = this.selectedServices
        .map(service => service.id)
        .filter((id): id is number => id !== undefined);

      this.selectedServices.map(service => {
        appointmentData.totalCost += service.price;
        return service.id;
      })
    }

    console.log(appointmentData);

    this.data.appointmentService.updateAppointment(appointmentData).subscribe({
      next: (response) => {
        console.log('Appointment updated successfully:', response);
        this.data.appointmentListComponent.fetchAppointments()
      },
      error: (err) => {
        console.error('Error adding appointment:', err);
      }
    });

    this.dialogRef.close();
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

  displaySelectedServices(): void {

     console.log(this.doctorServices);
     console.log(this.appointmentData);
     this.appointmentData.serviceIds?.forEach(
       serviceId=>{
         const doctorService = this.doctorServices.find(service => service.id === serviceId)
         if(doctorService){
           this.selectedServices.push(doctorService)
         }
       }
     )
    console.log(this.selectedServices);
  }

  isSelected(service: DoctorService): boolean {
    return this.selectedServices.some(selectedService => selectedService.id === service.id);
  }

  toggleSelection(service: DoctorService): void {
    const index = this.selectedServices.findIndex(selectedService => selectedService.id === service.id);
    if (index !== -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);


    }
  }







}
