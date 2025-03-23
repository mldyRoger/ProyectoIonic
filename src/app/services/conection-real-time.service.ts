import { Injectable } from '@angular/core';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class ConectionRealTimeService {
  private db: any;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyBNiRfqnixu8Oi7Z0CRkc8nPJSA3PJSe2c",
      authDomain: "appasistentes.firebaseapp.com",
      databaseURL: "https://appasistentes-default-rtdb.firebaseio.com",
      projectId: "appasistentes",
      storageBucket: "appasistentes.firebasestorage.app",
      messagingSenderId: "634175294662",
      appId: "1:634175294662:web:2a50dcbe9698ce8b0adbc7"
    };
    //const app = getApps().length ? getApp() : initializeApp(this.firebaseConfig);
    //this.db = getDatabase(app);
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
  }

  getDatabase() {
    return this.db;
  }
}
