import { RouterLink, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { ForgetPasswordComponent } from './login/forget-password/forget-password.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { IntroComponent } from './intro/intro.component';
import { LegalnoticeComponent } from './legalnotice/legalnotice.component';
import { ImprintComponent } from './imprint/imprint.component';
import { FirestoreTestComponent } from './firestore-test/firestore-test.component';
import { FinishSignUpComponent } from './finish-sign-up/finish-sign-up.component';
import { EmailVerificationComponent } from './finish-sign-up2/finish-sign-up2.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '', component: LoginComponent, children: [
            { path: '', component: SignInComponent },
            { path: 'forget', component: ForgetPasswordComponent },
            { path: 'signUp', component: SignUpComponent },
            { path: 'resetPassword', component: ResetPasswordComponent },
        ]
    },
    { path: 'board', component: MainComponent, canActivate: [authGuard] },
    { path: 'intro', component: IntroComponent },
    { path: 'legalnotice', component: LegalnoticeComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'test', component: FirestoreTestComponent },
    { path: '**', redirectTo: ''},
];