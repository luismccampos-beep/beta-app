import type { SharedUser } from './navigation/types';
interface SharedUserAvatarProps {
    user?: SharedUser;
    labelFallback?: string;
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
export default function SharedUserAvatar({ user, labelFallback, className, size }: SharedUserAvatarProps): import("react/jsx-runtime").JSX.Element;
export {};
