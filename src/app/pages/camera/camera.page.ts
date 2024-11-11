import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {ModalCameraComponent} from "../../components/modal-camera/modal-camera.component";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  constructor(private modalController: ModalController) {}

  ngOnInit() {
  }

  async openCameraModal() {
    const modal = await this.modalController.create({
      component: ModalCameraComponent,
    });
    return await modal.present();
  }

}
