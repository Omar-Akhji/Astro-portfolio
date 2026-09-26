export interface ContactInfo {
  readonly email: string;
  readonly phone: string;
  readonly location: string;
  readonly linkedin: string;
  readonly github: string;
}

export interface ResumeSkill {
  readonly name: string;
  readonly level: number;
}

export interface Language {
  readonly name: string;
  readonly level: string;
}

export interface PersonalInfo {
  readonly initials: string;
  readonly name: string;
  readonly title: string;
  readonly contact: ContactInfo;
  readonly skills?: readonly ResumeSkill[];
  readonly languages: readonly Language[];
}

export interface Experience {
  readonly jobTitle: string;
  readonly company: string;
  readonly date: string;
  readonly description: readonly string[];
}

export interface EducationDetail {
  readonly text: string;
  readonly bold?: boolean;
}

export interface Education {
  readonly degree: string;
  readonly school: string;
  readonly date: string;
  readonly details: readonly (readonly EducationDetail[])[];
}

export interface Certification {
  readonly name: string;
  readonly issuer: string;
  readonly year: number;
}

export interface ResumeData {
  readonly personal: PersonalInfo;
  readonly summary: string;
  readonly experience: readonly Experience[];
  readonly education: readonly Education[];
  readonly certifications: readonly Certification[];
}
