import {DoctorService} from "./doctorService";

export interface Appointment {
  id?: number;
  animalName: string;
  doctorName: string;
  appointmentDateTime: Date;
  status: string;
  diagnosis?: string;
  totalCost: number;
  serviceIds?: number[] | undefined
}

export enum Status {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED'
}
