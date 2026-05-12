import { FooterLandscape } from './components/FooterLandscape';
interface UnifiedFooterProps {
    showNewsletter?: boolean;
    showSocialLinks?: boolean;
    compactMode?: boolean;
    isAuthenticated?: boolean;
    hideNavigation?: boolean;
}
declare function Footer({ showNewsletter, showSocialLinks, compactMode, isAuthenticated, hideNavigation, }: UnifiedFooterProps): import("react/jsx-runtime").JSX.Element;
export default Footer;
export { FooterLandscape };
