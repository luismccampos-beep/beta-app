import { FC } from 'react';
export interface BlogCardProps {
    image: string;
    title: string;
    excerpt: string;
    date: string;
    category?: string;
    onClick?: () => void;
    className?: string;
}
declare const BlogCard: FC<BlogCardProps>;
export default BlogCard;
