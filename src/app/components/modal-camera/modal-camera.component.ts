import { AfterViewChecked, AfterViewInit, Component, ElementRef,  OnInit, ViewChild } from '@angular/core';
import { PhotoService } from '../../services/photo.service';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {ModalController} from "@ionic/angular";
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyC93Prp0yjfBa2cjCqrC4wkX_js53Ttv7U",
  authDomain: "appcamera-e98c1.firebaseapp.com",
  projectId: "appcamera-e98c1",
  storageBucket: "appcamera-e98c1.firebasestorage.app",
  messagingSenderId: "20360785485",
  appId: "1:20360785485:web:6cf7e2faef17c48464b604"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

@Component({
  selector: 'app-modal-camera',
  templateUrl: './modal-camera.component.html',
  styleUrls: ['./modal-camera.component.scss'],
})
export class ModalCameraComponent  implements AfterViewInit {
  imageUrl: string | undefined;
  isDesktop: boolean = false;
  videoStreamActive = false;
  currentStream: MediaStream | undefined;


  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;

  constructor(private modalController: ModalController) {
    this.isDesktop = !this.isMobile();
  }
  ngAfterViewInit() {
    // Solo llama a la cámara si es escritorio
    if (this.isDesktop) {
      this.takePhotoWithWebCamera();
    }
  }

  isMobile(): boolean {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  async takePhoto() {
    if (this.isDesktop) {
      await this.takePhotoWithWebCamera();
    } else {
      await this.takePhotoWithCapacitorCamera();
    }
  }

  // Para PWA en computadoras
  async takePhotoWithWebCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      this.videoStreamActive = true;
      this.currentStream = stream;
      this.video.nativeElement.srcObject = stream;

      // Esperar un poco antes de capturar la imagen
      setTimeout(() => {
        this.captureImageFromVideo(stream);
      }, 1000);

    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
    }
  }

  captureImageFromVideo(stream: MediaStream) {
    const canvas = document.createElement('canvas');
    const video = this.video.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageUrl = canvas.toDataURL('image/png'); // Capturar la imagen como DataURL
    }

    // Detener el stream de la cámara
    stream.getTracks().forEach(track => track.stop());
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
    }
    this.videoStreamActive = false;
  }
  async takePhotoWithCapacitorCamera() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    this.imageUrl = image.dataUrl;
  }
  dismissModal() {
    this.modalController.dismiss();
  }

  async uploadImage() {
    if (!this.imageUrl) return;

    const base64WithoutPrefix = this.imageUrl.split(',')[1];

     const timestamp = Date.now(); 
     const fileName = `images/myImage_${timestamp}.png`;
     const storageRef = ref(storage, fileName);
     


     try {
      // Sube la cadena Base64 como un archivo
      await uploadString(storageRef, base64WithoutPrefix, 'base64');
      
      // Obtén la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Imagen subida con éxito:', downloadURL);
      return downloadURL;
  } catch (error) {
      console.error('Error al subir la imagen:', error);
      return error;
  }
  }

  stopCamera() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.videoStreamActive = false;
    }
  }
}
