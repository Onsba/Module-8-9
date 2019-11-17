import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  // Attempt to login, goes to the main page if successful
  login(form) {
    this.auth.doLogin(form.form.value).then(res => {
      document.getElementById('bad-login').style.display = 'none';
      this.router.navigateByUrl('');
    }, err => {
      document.getElementById('bad-login').style.display = 'block';
      console.log(err);
    });
  }

  // Navigate to the sign up page
  register() {
   this.router.navigateByUrl('/register');
  }

}
