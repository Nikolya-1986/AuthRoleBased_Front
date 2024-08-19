import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonNote, IonIcon, IonButton } from '@ionic/angular/standalone';
import { take } from 'rxjs';

import { AuthenticationService } from '../../services/authentication.service';
import { ILogin, ILoginDto, ILoginForm, IRegister, IRegisterDto, IRegisterForm } from '../../interfaces/login.interface';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonIcon,
    IonButton,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    RouterOutlet
  ]
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup<IRegisterForm>;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  register(): void {
    const form: IRegister = this.registerForm.getRawValue();
    this.authenticationService.register(form)
    .pipe(
      take(1),
    )
    .subscribe((res: IRegisterDto) => {})
  }

  private initializeRegisterForm(): void {
    this.registerForm = this.formBuilder.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
}
