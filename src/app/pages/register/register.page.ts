import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    secondLastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    validatePassword: ['',[Validators.required, Validators.minLength(6)]]
  });
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {

  }

  ngOnInit() {

  }
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.authService.register(this.registerForm)
      .subscribe( {
        next: () => {
          alert("Usuario registrado con éxito");
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error(error);
          alert('Error al registrar el usuario, por favor intente de nuevo.');
        }
      });
  }

}
