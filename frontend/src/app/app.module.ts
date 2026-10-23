import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { QuillModule } from 'ngx-quill';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RegistrationsuccessComponent } from './components/registrationsuccess/registrationsuccess.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { ProfessordashboardComponent } from './components/professordashboard/professordashboard.component';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { ProfessorprofileComponent } from './components/professorprofile/professorprofile.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgChartsModule } from 'ng2-charts';






 // Add this for ngModel
 // Add this for titlecase pipe

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ApprovalstatusComponent } from './components/approvalstatus/approvalstatus.component';

import { UserlistComponent } from './components/userlist/userlist.component';
import { ProfessorlistComponent } from './components/professorlist/professorlist.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { YouTubePlayerModule } from '@angular/youtube-player';



import { WelcomepageComponent } from './components/welcomepage/welcomepage.component';

import { LoadingComponent } from './components/loading/loading.component';
import { PaymentComponent } from './components/payment/payment.component';

import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UpgradeModalComponent } from './components/upgrade-modal/upgrade-modal.component';
import { ContentComponent } from './components/content/content.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ContentFormComponent } from './components/content-form/content-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LevelOverviewComponent } from './components/level-overview/level-overview.component';
import { UnitOverviewComponent } from './components/unit-overview/unit-overview.component';
import { environment } from 'src/environments/environment.prod';
import { AdminQuizFormComponent } from './components/admin-quiz-form/admin-quiz-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';








@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    RegistrationsuccessComponent,
    UserdashboardComponent,
    ProfessordashboardComponent,
    AdmindashboardComponent,
    HeaderComponent,
    FooterComponent,
    UserprofileComponent,
    ProfessorprofileComponent,
    SafeUrlPipe,
    
    
    ApprovalstatusComponent,
    
    UserlistComponent,
    ProfessorlistComponent,


    
   
    WelcomepageComponent,
    
    LoadingComponent,
    PaymentComponent,
    
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ForbiddenComponent,
    UpgradeModalComponent,
    ContentComponent,
    QuizComponent,
    ContentFormComponent,
    LevelOverviewComponent,
    UnitOverviewComponent,
    AdminQuizFormComponent,
    AdminpanelComponent,
    
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    CarouselModule,
    YouTubePlayerModule,
    
    
    
    
    MDBBootstrapModule.forRoot(),
    QuillModule.forRoot(),
    BrowserAnimationsModule,
     
    
    MatSnackBarModule,
    MatIconModule,
MatProgressSpinnerModule,
PdfViewerModule,
FormsModule, // Add this
    
MatFormFieldModule,
MatInputModule,
MatTableModule,
MatButtonModule,
MatDialogModule,
MatSnackBarModule,
MatIconModule,
MatProgressBarModule,
  NgChartsModule



    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
