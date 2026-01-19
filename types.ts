export interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
  color: string; // Hex for the brand glow
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}
