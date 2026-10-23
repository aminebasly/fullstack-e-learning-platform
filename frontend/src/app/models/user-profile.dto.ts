export interface UserProfileDto {
    username?: string;
    mobile?: string;
    gender?: string;
    profession?: string;
    address?: string;
    password?: string;
    role?: string; // "STUDENT" or "ADMIN"
    accessType?: string; // True after PayPal payment
    currentLevel?: string; // e.g., "A1" from placement quiz
    badges?: string;
    confirmPassword?: string;

   purchasedLevel?: string ;
    
  }
  