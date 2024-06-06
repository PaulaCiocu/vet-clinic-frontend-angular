import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatLabel, MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatTableModule} from '@angular/material/table';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import {CommonModule, DatePipe} from "@angular/common";
import {AppointmentService} from "./_service/appointmentService";

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatLabel,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AppComponent,
    CommonModule,
    DatePipe,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withFetch())
  ],
})
export class AppModule { }
