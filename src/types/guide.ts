
export interface GuideType {
  id: string;
  name: string;
  destinationId: string;
  pricePerDay: number;
  languages: string[];
  imageUrl: string;
  rating: number;
  experience?: number;
}
