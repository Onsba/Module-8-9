import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  // Attempt to register
  register(form) {
    this.auth.doRegister(form.form.value).then(res => {
      document.getElementById('bad-register').style.display = 'none';
      this.router.navigate(['/login']);
    }, err => {
      document.getElementById('bad-register').style.display = 'block';
      console.log(err);
    });
  }

}
