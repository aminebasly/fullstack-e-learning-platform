import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { ApprovalstatusComponent } from './components/approvalstatus/approvalstatus.component';

import { LoginComponent } from './components/login/login.component';

import { ProfessordashboardComponent } from './components/professordashboard/professordashboard.component';
import { ProfessorlistComponent } from './components/professorlist/professorlist.component';
import { ProfessorprofileComponent } from './components/professorprofile/professorprofile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RegistrationsuccessComponent } from './components/registrationsuccess/registrationsuccess.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { WelcomepageComponent } from './components/welcomepage/welcomepage.component';
import { AdminGuard } from './guards/admin.guard';
import { ProfessorGuard } from './guards/professor.guard';
import { RouterGuard } from './guards/router.guard';
import { UserGuard } from './guards/user.guard';

import { QuizGuard } from './guards/quiz.guard';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentGuard } from './guards/payment.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminOrProfessorGuard } from './guards/admin-or-professor-guard.guard';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { ContentComponent } from './components/content/content.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { LevelAccessGuard } from './guards/level-access.guard';
import { ContentFormComponent } from './components/content-form/content-form.component';
import { LevelOverviewComponent } from './components/level-overview/level-overview.component';
import { UnitOverviewComponent } from './components/unit-overview/unit-overview.component';
import { AdminQuizFormComponent } from './components/admin-quiz-form/admin-quiz-form.component';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';
import { ContentAccessGuard } from './guards/content-access.guard';



const routes: Routes = [
  {path:'',component:WelcomepageComponent},
  
  {path: 'payment', component: PaymentComponent },
  {path:'login',component:LoginComponent},
  {path:'registration',component:RegistrationComponent},
  {path:'registrationsuccess',component:RegistrationsuccessComponent},
  {path:'admindashboard',component:AdmindashboardComponent,canActivate:[AdminGuard]},
  {path:'userdashboard',component:UserdashboardComponent,canActivate:[UserGuard]},
  {path:'professordashboard',component:ProfessordashboardComponent,canActivate:[AdminOrProfessorGuard]},
  {path: 'content/level/:level', component: ContentComponent, canActivate: [LevelAccessGuard] },
  {path: 'quiz/:type', component: QuizComponent },

  { path: 'content/create', component: ContentFormComponent, canActivate: [AdminOrProfessorGuard] },

    { path: 'Adminpanel', component: AdminpanelComponent, canActivate: [AdminOrProfessorGuard] },



  { path: 'level-overview/:level', component: LevelOverviewComponent },

  {
  path: 'level/:level/unit/:unitNumber', component: UnitOverviewComponent
  
},
{ path: 'content/play/:id', component: ContentComponent,canActivate: [ContentAccessGuard] },

{path: 'quiz-form', component: AdminQuizFormComponent, canActivate: [AdminOrProfessorGuard] },

  


  {path:'approveprofessor',component:ApprovalstatusComponent,canActivate:[RouterGuard]},
  {path:'professorlist',component:ProfessorlistComponent,canActivate:[RouterGuard]},
  {path:'userlist',component:UserlistComponent,canActivate:[RouterGuard,AdminOrProfessorGuard]},

  
  {path: 'professor-profile/:email', component:ProfessorprofileComponent, canActivate:[ProfessorGuard]},
  {path:'edituserprofile',component:UserprofileComponent,canActivate:[UserGuard]},

  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  {path:'Forbidden',component:ForbiddenComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
