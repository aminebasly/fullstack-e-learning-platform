import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';
import { PaymentService } from 'src/app/services/payment.service';



@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  selectedLevel: string = 'A1';
  levels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  loggedUserEmail: string = '';
  isLoading = false;
 

  showModal = false;
  

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private paymentService: PaymentService
    
    
  ) {}

  ngOnInit(): void {
    this.loginService.fetchUserStatus().subscribe(status => {
      if (!status?.email) {
        this.router.navigate(['/login']);
      } else {
        this.loggedUserEmail = status.email;
      }
    });
  }




 

processPayment(plan: 'Full' | 'Single'): void {
  if (this.isLoading) return;
  this.isLoading = true;

  const paymentData = {
    email: this.loggedUserEmail,
    accessType: plan,
    basketItems: [
      {
        id: plan === 'Full' ? 'FULL-001' : 'SINGLE-001',
        name: plan === 'Full' ? 'Full Access' : 'Single Level Access',
        quantity: 1,
        category1: 'Education'
      }
    ]
  };

  this.paymentService.checkout(paymentData).subscribe({
    next: (paymentUrl: string) => {
      console.log('IYZICO PAYMENT URL = ', paymentUrl);
      this.isLoading = false;

      // Redirection directe vers la page de paiement iyzico
      window.location.href = paymentUrl;
    },
    error: (err) => {
      console.error('PAYMENT ERROR = ', err);
      this.snackBar.open('Payment error ❌', 'Close', { duration: 3000 });
      this.isLoading = false;
    }
  });
}



  // Après paiement réussi via Iyzipay
  onPaymentSuccess(userCurrentLevel?: string) {
    this.showModal = false;
    this.snackBar.open('Payment successful ✅', 'Close', { duration: 3000 });
    this.navigateAfterPayment(userCurrentLevel);
  }

  onPaymentCancel() {
    this.showModal = false;
    this.snackBar.open('Payment cancelled ❌', 'Close', { duration: 3000 });
  }

  navigateAfterPayment(userCurrentLevel?: string) {
    // Nouveau user ou quiz requis
    if (!userCurrentLevel) {
      this.router.navigate(['/quiz/placement']);
    } else {
      // Utilisateur existant, renouvellement Single ou Full
      this.router.navigate(['/userdashboard']);
    }
  }
}
