import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loading!: HTMLIonLoadingElement;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private loadingController: LoadingController) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    //
    if (this.authService.currentUserValue) {
      this.router.navigate(['/_']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    await this.presentLoading();
    this.authService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value)
      .subscribe({
        next: async () => {
          await this.dismissLoading();
          this.router.navigate(['/_']);
        },
        error: async error => {
          // Handle login errors
          console.error(error);
          await this.dismissLoading();
          alert('Error al iniciar sesión, por favor intente de nuevo.');
        }
      });
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'my-custom-loading-5',
      // message: 'Cargando aplicación...',
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }
  async ionViewWillEnter() {
    await this.presentLoading();
    setTimeout(async () => {
      await this.dismissLoading();
    }, 3000);

  }
}
