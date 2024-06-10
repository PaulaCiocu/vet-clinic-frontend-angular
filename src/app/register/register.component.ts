import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../_service/authService";
import {User} from "../model/User";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  registerForm: FormGroup = this.fb.group({   // Initialize registerForm here

  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onRegister() {

    if (this.registerForm.valid) {

      const user: User = this.registerForm.value;
      console.log(user);
      this.authService.register(user).subscribe({
        next: response => {
          alert('Registration successful!')
          console.log('Registration successful', response);
          this.router.navigate(['/login'])
          // Handle successful registration
        },
        error: err => {
          alert(err.message)
          console.error('Registration error', err);
          // Handle registration error
        }
      });
    }
  }
}
