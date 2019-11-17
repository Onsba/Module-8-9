import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tasks = [];

  constructor(
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  ngOnInit() {
     this.getTasks();
  }

  // Retrieve tasks from the database
  getTasks() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.firestore.collection('users').doc(userId).collection('tasks').get().subscribe(val => {
          this.tasks = (val.docs.map(doc => doc.data()));
          console.log(this.tasks);
        });
      }
    });
  }

  // Create a task in the database
  async create() {
    const alert = await this.alertCtrl.create({
      message: 'Create task',
      inputs: [
        { name: 'title', placeholder: 'Title' },
        { name: 'description', placeholder: 'Description' },
        { name: 'deadline', placeholder: 'Deadline' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create', handler: data => {
            const task = {
              id: this.firestore.createId(),
              title: data.title,
              description: data.description,
              deadline: data.deadline
            };
            this.tasks.push(task);
            this.firestore.collection('users').doc(this.afAuth.auth.currentUser.uid).collection('tasks').doc(task.id).set(task);
          }
        }
      ]
    });
    await alert.present();
  }

  // Update a task in the database
  async update(index) {
    const task = this.tasks[index];
    const alert = await this.alertCtrl.create({
      message: 'Update task',
      inputs: [
        { name: 'title', placeholder: 'Title', value: this.tasks[index].title },
        { name: 'description', placeholder: 'Description', value: this.tasks[index].description },
        { name: 'deadline', placeholder: 'Deadline', value: this.tasks[index].deadline }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update', handler: data => {
            task.title = data.title;
            task.description = data.description;
            task.deadline = data.deadline;
            this.firestore.collection('users').doc(this.afAuth.auth.currentUser.uid).collection('tasks').doc(task.id).update(task);
          }
        }
      ]
    });

    await alert.present();
  }

  // Delete a task in the database
  delete(index) {
    const task = this.tasks[index];
    this.tasks.splice(index, 1);
    this.firestore.collection('users').doc(this.afAuth.auth.currentUser.uid).collection('tasks').doc(task.id).delete();
  }

  // Shows the details of the task
  async details(index) {
    const task = this.tasks[index];
    console.log(task);
    const alert = await this.alertCtrl.create({
      header: task.title,
      message: task.description,
      subHeader: task.deadline,
      buttons: [
        { text: 'OK', role: 'cancel' }
      ]
    });

    await alert.present();
  }

  // Logs out the user
  logout() {
    this.authService.doLogout();
  }
}
