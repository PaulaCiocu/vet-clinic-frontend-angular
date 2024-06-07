import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";
import {Observable} from "rxjs";
import {Router} from "@angular/router";



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient, private router:Router) { }

  register(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}`, user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  login(user: User): void {
    // Fetch all users
    this.getAllUsers().subscribe(users => {
      // Check if user exists with provided credentials
      console.log(users);
      console.log(user);
      const loggedInUser = users.find(u => u.username === user.username && u.password === user.password);
      console.log(loggedInUser);
      if (loggedInUser) {
        // User found, navigate to home page or dashboard
        this.router.navigate(['/home']); // Replace '/home' with your home page route
      } else {
        // User not found, handle login failure
        console.error('Invalid username or password');
        // Optionally, you can show a login error message to the user
      }
    });
  }
}
