import { Content } from "@angular/compiler/src/render3/r3_ast";

export class User {
    username : string = '';
    userid : string = 'empty';
    email : string = '';
    profession : string = '';
    gender : string = '';
    mobile : string = '';
    address : string = '';
    password : string = '';
    role: string=""; // "STUDENT" or "ADMIN"
    accessType: string = 'None'; // True after PayPal payment
   currentLevel: string=""; // e.g., "A1" from placement quiz
   badges: string="";// Comma-separated, e.g., "Unit1,LevelA1"
   createdAt: Date = new Date();
  
   confirmPassword: string = '';
   resetPasswordToken: string = '';
   purchasedLevel: string = ''; // e.g., "A1" for single access 
   lastContentVisited:Content | null = null; // Last content visited by the user
  paymentRequired: boolean = true;
  quizCompleted: boolean = false;
    

    constructor() {
        
        // Optionally initialize with default values if needed
    }

   

    addBadge(badge: string): void {
        if (!this.badges.includes(badge)) {
          this.badges = this.badges ? `${this.badges},${badge}` : badge;
      
          if (badge.startsWith('Unit') && badge.includes(this.currentLevel)) {
            const unitNum = badge.match(/Unit(\d)/)?.[1];
            if (unitNum) {
              // Increment completedUnits if it's a new unit in the current level
               
            }
          }
        }
      }

 

    getBadgesArray(): string[] {
        return this.badges ? this.badges.split(',') : [];
    }



    
}