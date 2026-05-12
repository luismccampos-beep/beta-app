// src/components/GuideCard.tsx
import { Star } from 'lucide-react';

import BaseLink from './common/BaseLink';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import OptimizedImage from './OptimizedImage';
const SafeImage = OptimizedImage;

export interface GuideCardProps {
  name: string;
  photo: string;
  expertise: string;
  bio: string;
  rating: number;
  location: string;
  id: string;
}

const GuideCard: React.FC<GuideCardProps> = ({
  name,
  photo,
  expertise,
  bio,
  rating,
  location,
  id,
}) => {
  return (
    <Card className='w-full max-w-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
      <CardHeader className='relative h-40 overflow-hidden rounded-t-lg'>
        <SafeImage
          src={photo}
          alt={name}
          className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
        />
        <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent' />
      </CardHeader>
      <CardContent className='space-y-3'>
        <CardTitle className='text-lg font-bold'>{name}</CardTitle>
        <p className='text-sm font-medium text-blue-600'>{expertise}</p>
        <p className='text-sm text-gray-600 line-clamp-3'>{bio}</p>
        <div className='flex items-center gap-2'>
          <div className='flex -space-x-1'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 transition-colors duration-200 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
              />
            ))}
          </div>
          <span className='text-sm text-gray-500'>{rating.toFixed(1)} / 5</span>
        </div>
        <p className='text-sm text-gray-500'>{location}</p>
        <BaseLink to={`/guides/${id}`}>
          <Button className='mt-3 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'>
            Saiba Mais
          </Button>
        </BaseLink>
      </CardContent>
    </Card>
  );
};

export default GuideCard;
