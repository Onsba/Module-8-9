import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userId = undefined;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router
  ) { }

  // Return the user ID
  getUserId() {
    return this.userId;
  }

  // Prevent access to unauthenticated users
  canActivate() {
    if (window.localStorage.getItem('loggedIn') !== 'yes') {
      this.router.navigateByUrl('/login');
      return false;
    }

    return true;
  }

  // Signs up a new user
  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  // Logs in the user
  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(() => {
          this.userId = firebase.auth().currentUser.uid;
          window.localStorage.setItem('loggedIn', 'yes');
          resolve();
        }).catch((error) => {
          console.log(error);
          reject();
        });
    });
  }

  // Logs out the user
  doLogout() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut()
        .then(() => {
          this.userId = undefined;
          window.localStorage.removeItem('loggedIn');
          this.router.navigateByUrl('/login');
          resolve();
        }).catch((error) => {
          console.log(error);
          reject();
        });
    });
  }
}
