import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: '',
      password: ''
    });
  }

  signIn() {
    this.authService.signIn(this.signInForm.value).subscribe(res => {
      if (res.access_token) {
        this.router.navigate(['home']);
      }
    });
  }

}
