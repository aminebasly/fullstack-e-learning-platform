export enum ProfessorStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
  }
export class Professor
{
    professorname : string = '';
    professorid : string = 'empty';
    email : string = '';
    degreecompleted : string = '';
    institutionname : string = '';
    department : string = '';
    experience : string = '';
    gender : string = '';
    mobile : string = '';
    password : string = '';
    status: ProfessorStatus = ProfessorStatus.PENDING;
    confirmPassword: string = '';
    resetPasswordToken: string = '';

    constructor() {}
}
