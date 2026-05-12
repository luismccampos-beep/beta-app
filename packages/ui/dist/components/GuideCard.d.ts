export interface GuideCardProps {
    name: string;
    photo: string;
    expertise: string;
    bio: string;
    rating: number;
    location: string;
    id: string;
}
declare const GuideCard: React.FC<GuideCardProps>;
export default GuideCard;
