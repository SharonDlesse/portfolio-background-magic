
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageData?: string; // Base64 data for the image
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  additionalLinks?: {
    title: string;
    url: string;
  }[];
  categories?: string[];
  attributes?: string[];
  detailedDescription?: string;
  imagePosition?: {
    x: number;
    y: number;
  };
  client?: string;
  year?: string;
  category?: string;
  overview?: string;
  clientProblem?: string;
  solution?: string;
  businessImpact?: string;
  imageStoredExternally?: boolean;
  isFeatured?: boolean;
}
