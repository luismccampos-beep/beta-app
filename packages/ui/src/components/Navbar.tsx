"use client"
import * as React from "react"

// Navbar component props
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  fixed?: boolean
  variant?: string
  size?: string
  transparent?: boolean
  sticky?: boolean
  links?: Array<{ label: string; to: string }>
  shadow?: string
  blurAmount?: string | number
}

// Main Navbar component
const Navbar = ({ 
  children, 
  className = '', 
  fixed = false,
  transparent = false,
  variant,
  size,
  sticky = false,
  links, // eslint-disable-line @typescript-eslint/no-unused-vars
  shadow,
  blurAmount, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...props 
}: NavbarProps) => {
  const navProps = {
    ...props,
    className: `navbar ${className} ${fixed ? 'navbar-fixed' : ''} ${transparent ? 'navbar-transparent' : ''} ${sticky ? 'navbar-sticky' : ''} ${variant ? `navbar-${variant}` : ''} ${size ? `navbar-${size}` : ''} ${shadow ? `shadow-${shadow}` : ''}`.trim(),
  };

  return (
    <nav {...navProps}>
      {children}
    </nav>
  )
}

// NavbarBrand props
export interface NavbarBrandProps extends React.HTMLAttributes<HTMLElement> {
  href?: string
}

const NavbarBrand = ({
  children,
  className = '',
  href,
  ...props
}: NavbarBrandProps) => {
  if (href) {
    return (
      <a
        href={href}
        className={`navbar-brand ${className}`}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }
  return (
    <div
      className={`navbar-brand ${className}`}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  )
}

// NavbarContent props
export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'start' | 'center' | 'end'
}

const NavbarContent = ({
  children,
  className = '',
  position,
  ...props
}: NavbarContentProps) => {
  return (
    <div
      className={`navbar-content ${className}`}
      data-position={position}
      {...props}
    >
      {children}
    </div>
  )
}

// NavbarItem props - only includes properties that are actually used
export interface NavbarItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string
  to?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  badge?: React.ReactNode
  external?: boolean
  tooltip?: string
  shortcut?: string
  animation?: string
  underline?: boolean
  pill?: boolean
  exactMatch?: boolean
  matchPattern?: string
}

const NavbarItem = ({
  children,
  className = '',
  href,
  to,
  icon,
  rightIcon,
  badge,
  ...props
}: NavbarItemProps) => {
  const isLink = href || to
  const content = (
    <>
      {icon && <span className="navbar-item-icon">{icon}</span>}
      {children}
      {rightIcon && <span className="navbar-item-right-icon">{rightIcon}</span>}
      {badge && <span className="navbar-item-badge">{badge}</span>}
    </>
  )

  if (isLink) {
    return (
      <a
        href={href || to}
        className={`navbar-item ${className}`}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    )
  }
  return (
    <div
      className={`navbar-item ${className}`}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {content}
    </div>
  )
}

// NavbarMenu component
export interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const NavbarMenu = ({
  children,
  className = '',
  ...props
}: NavbarMenuProps) => {
  return (
    <div className={`navbar-menu ${className}`} {...props}>
      {children}
    </div>
  )
}

// NavLinkItem component
export interface NavLinkItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string
}

export interface NavLinkItemType {
  label: string
  to?: string
  href?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  badge?: React.ReactNode
  external?: boolean
  tooltip?: string
  shortcut?: string
  animation?: string
  underline?: boolean
  pill?: boolean
  exactMatch?: boolean
  matchPattern?: string
  className?: string
}

const NavLinkItem = ({
  children,
  className = '',
  ...props
}: NavLinkItemProps) => {
  return (
    <a className={`nav-link-item ${className}`} {...props}>
      {children}
    </a>
  )
}

export {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavLinkItem,
}

export default Navbar

