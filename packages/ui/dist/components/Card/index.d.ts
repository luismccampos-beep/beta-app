/**
 * Card Component
 *
 * A versatile container component for grouping related content.
 * Provides consistent styling, accessibility, and composability.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 *
 * // As a link
 * <Card asChild>
 *   <a href="/details">
 *     <CardContent>Clickable card</CardContent>
 *   </a>
 * </Card>
 *
 * // With hover effect
 * <Card hoverable>
 *   <CardContent>Hover over me</CardContent>
 * </Card>
 * ```
 */
import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import type { BaseComponentProps } from '../../types';
/**
 * Card style variants
 */
export declare const cardVariants: (props?: ({
    variant?: "default" | "outline" | "ghost" | null | undefined;
    padding?: "none" | "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface CardProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
    /**
     * Render as a child element (polymorphic)
     * Useful for rendering as a link or clickable element
     */
    asChild?: boolean;
    /**
     * Add hover effect (elevation change)
     */
    hoverable?: boolean;
    /**
     * Make the card focusable
     */
    tabIndex?: number;
}
/**
 * Card container component
 */
declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
export interface CardHeaderProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
    /**
     * Space between title and description
     * @default true
     */
    spaced?: boolean;
}
/**
 * Card header container for title and description
 */
declare const CardHeader: React.ForwardRefExoticComponent<CardHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface CardTitleProps extends BaseComponentProps, Omit<React.HTMLAttributes<HTMLHeadingElement>, 'className'> {
    /**
     * Heading level for semantic HTML
     * @default "h3"
     */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
/**
 * Card title component with semantic heading
 */
declare const CardTitle: React.ForwardRefExoticComponent<CardTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface CardDescriptionProps extends BaseComponentProps, React.HTMLAttributes<HTMLParagraphElement> {
}
/**
 * Card description for subtitle text
 */
declare const CardDescription: React.ForwardRefExoticComponent<CardDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface CardContentProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
}
/**
 * Card content area
 */
declare const CardContent: React.ForwardRefExoticComponent<CardContentProps & React.RefAttributes<HTMLDivElement>>;
export interface CardFooterProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
    /**
     * Layout direction
     * @default "horizontal"
     */
    direction?: 'horizontal' | 'vertical';
}
/**
 * Card footer for actions
 */
declare const CardFooter: React.ForwardRefExoticComponent<CardFooterProps & React.RefAttributes<HTMLDivElement>>;
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, };
export default Card;
