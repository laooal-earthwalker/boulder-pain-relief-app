// Shared TypeScript types

export type BodyPart =
  | "neck"
  | "shoulder"
  | "upper-back"
  | "lower-back"
  | "hip"
  | "knee"
  | "foot"
  | "elbow"
  | "wrist";

export type Condition =
  | "tension"
  | "tightness"
  | "soreness"
  | "injury-recovery"
  | "posture"
  | "mobility"
  | "nerve-pain";

export interface Resource {
  slug: string;
  title: string;
  bodyParts: BodyPart[];
  conditions: Condition[];
  excerpt: string;
  content: string;
  publishedAt: string;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  lemonSqueezyProductId: string;
  lessons: Lesson[];
}

export interface Lesson {
  slug: string;
  title: string;
  vimeoId: string;
  isFreePreview: boolean;
  durationMinutes: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  affiliateUrl: string;
  imageUrl: string;
  category: "ergonomic" | "travel" | "recovery";
  price?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  tags: string[];
}

export interface PainToolMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PainToolRequest {
  messages: PainToolMessage[];
}
