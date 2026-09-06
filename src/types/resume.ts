interface Contact {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

interface Skill {
  name: string;
  level: number;
}

interface Language {
  name: string;
  level: string;
}

export interface PersonalInfo {
  initials: string;
  name: string;
  title: string;
  contact: Contact;
  skills: Skill[];
  languages: Language[];
}

interface Experience {
  jobTitle: string;
  company: string;
  date: string;
  description: string[];
}

interface EducationDetail {
  text: string;
  bold?: boolean;
}

interface Education {
  degree: string;
  school: string;
  date: string;
  details: EducationDetail[][];
}

interface Certification {
  name: string;
  issuer: string;
  year: number;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}
