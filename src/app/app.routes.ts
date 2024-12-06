import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LegalnoticeComponent } from './legalnotice/legalnotice.component';
import { IntroComponent } from './intro/intro.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'board', component: MainComponent},
];
