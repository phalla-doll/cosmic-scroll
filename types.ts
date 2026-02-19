export interface PlanetConfig {
  name: string;
  color: string;
  positionX: number;
  scale: number;
  description: string;
  orbitSpeed: number;
}

export interface SectionData {
  id: string;
  title: string;
  subtitle: string;
  planetIndex: number; // 0 for Earth, 1 for Mars, 2 for Jupiter
}

export interface AIResponse {
  fact: string;
}
