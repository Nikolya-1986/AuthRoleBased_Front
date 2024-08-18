import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonItem } from '@ionic/angular/standalone';

import { AuthenticationService } from '../../../../pages/authentication/services/authentication.service';
import { ILoginDto } from '../../../../pages/authentication/interfaces/login.interface';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonItem, CommonModule, FormsModule]
})
export class AdminPage {

  admin: Signal<ILoginDto | undefined> = toSignal(this.authenticationService.getUserData());

  constructor(
    private authenticationService: AuthenticationService,
  ) {}

  logout(): void {
    this.authenticationService.logout();
  }

}
