export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  avatar: string;
  text: string;
  date: string;
}

export interface Project {
  title: string;
  category: string;
  image: string;
}

export interface SkillBar {
  name: string;
  percentage: number;
}

export interface TimelineItem {
  title: string;
  period: string;
  description: string;
}

export interface BlogPost {
  title: string;
  category: string;
  date: string;
  dateTime: string;
  image: string;
  text: string;
}

export interface Client {
  logo: string;
  alt: string;
}
