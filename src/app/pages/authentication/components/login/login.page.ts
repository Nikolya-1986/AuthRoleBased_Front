import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonNote, IonIcon, IonButton } from '@ionic/angular/standalone';
import { take } from 'rxjs';

import { AuthenticationService } from '../../services/authentication.service';
import { ILogin, ILoginDto, ILoginForm } from '../../interfaces/login.interface';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage implements OnInit {

  loginForm!: FormGroup<ILoginForm>;
  
  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initializeLoginForm();
  }

  login(): void {
    const form: ILogin = this.loginForm.getRawValue();
    this.authenticationService.login(form)
    .pipe(
      take(1),
    )
    .subscribe((res: ILoginDto) => console.log(res))
  }

  private initializeLoginForm(): void {
    this.loginForm = this.formBuilder.nonNullable.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

}
