'use client'
// src/components/Navbar.tsx
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import type { Navigation, Page, Category } from '@/payload-types'
import { CartIcon } from '@/components/CartIcon'

type NavigationFallback = {
  mainNav?: never[]
  footerNav?: never[]
  socialLinks?: never[]
}

type NavItem = {
  id?: string | null
  type: 'link' | 'page' | 'category' | 'dropdown'
  label: string
  url?: string | null
  page?: Page | number | null
  category?: Category | number | null
  dropdown?: NavItem[] | null
  openInNewTab?: boolean | null
}

interface NavbarProps {
  navigation: Navigation | NavigationFallback
}

export const Navbar: React.FC<NavbarProps> = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getHref = (item: NavItem): string => {
    switch (item.type) {
      case 'link':
        return item.url || '#'
      case 'page':
        return `/${typeof item.page === 'object' ? item.page?.slug : ''}`
      case 'category':
        return `/category/${typeof item.category === 'object' ? item.category?.slug : ''}`
      default:
        return '#'
    }
  }

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const href = getHref(item)
    const target = item.openInNewTab ? '_blank' : undefined
    const rel = item.openInNewTab ? 'noopener noreferrer' : undefined

    if (item.type === 'dropdown' && item.dropdown) {
      if (isMobile) {
        return (
          <div key={item.id || `mobile-${item.label}`} className="space-y-2">
            <div className="font-medium text-muted-foreground px-3 py-2">{item.label}</div>
            <div className="space-y-1 pl-4">
              {item.dropdown?.map((dropdownItem: NavItem, index) => (
                <Link
                  key={dropdownItem.id || `mobile-dropdown-${index}`}
                  href={getHref(dropdownItem)}
                  target={dropdownItem.openInNewTab ? '_blank' : undefined}
                  rel={dropdownItem.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {dropdownItem.label}
                </Link>
              )) || []}
            </div>
          </div>
        )
      }

      return (
        <NavigationMenuItem key={item.id || `desktop-${item.label}`}>
          <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground">
            {item.label}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[200px]">
              {item.dropdown?.map((dropdownItem: NavItem, index) => (
                <Link
                  key={dropdownItem.id || `desktop-dropdown-${index}`}
                  href={getHref(dropdownItem)}
                  target={dropdownItem.openInNewTab ? '_blank' : undefined}
                  rel={dropdownItem.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">{dropdownItem.label}</div>
                </Link>
              )) || []}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      )
    }

    if (isMobile) {
      return (
        <Link
          key={item.id || `mobile-link-${item.label}`}
          href={href}
          target={target}
          rel={rel}
          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsOpen(false)}
        >
          {item.label}
        </Link>
      )
    }

    return (
      <NavigationMenuItem key={item.id || `desktop-link-${item.label}`}>
        <Link
          href={href}
          target={target}
          rel={rel}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          {item.label}
        </Link>
      </NavigationMenuItem>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="inline-block font-bold text-xl">Logo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.mainNav?.map((item) => renderNavItem(item, false)) || []}
            </NavigationMenuList>
          </NavigationMenu>
          <CartIcon />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2">
          <CartIcon />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl">Logo</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-2 mt-8">
                  {navigation.mainNav?.map((item) => renderNavItem(item, true)) || []}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
