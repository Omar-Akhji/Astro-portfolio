export interface Service {
  readonly id?: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface Testimonial {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
  readonly text: string;
  readonly date: string;
}

export interface Project {
  readonly title: string;
  readonly category: string;
  readonly image: string;
  readonly github?: string | null;
  readonly live?: string | null;
  readonly order?: number;
  readonly tags?: readonly string[];
  readonly description?: string;
}

export interface SkillBar {
  readonly id?: string;
  readonly name: string;
  readonly percentage: number;
}

export interface TimelineItem {
  readonly id?: string;
  readonly title: string;
  readonly period: string;
  readonly description: string;
}

export interface BlogPost {
  readonly title: string;
  readonly category: string;
  readonly date: string;
  readonly dateTime: string;
  readonly image: string | { readonly src: string };
  readonly text: string;
  readonly tags?: readonly string[];
}

export interface Client {
  readonly id?: string;
  readonly logo: string;
  readonly alt: string;
}

export interface LanguageSkill {
  readonly id?: string;
  readonly name: string;
  readonly level: string;
  readonly order?: number;
  readonly url?: string;
}
