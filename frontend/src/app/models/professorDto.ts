export interface ProfessorDto {
    professorname: string;
    degreecompleted?: string; // Optional
    institutionname?: string; // Optional
    department?: string; // Optional
    experience?: string; // Optional (can be a string from the form)
    gender?: string; // Optional
    mobile?: string; // Optional
    password?: string; // Optional (only include if you allow password updates here)
  }