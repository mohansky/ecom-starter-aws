// src/components/Footer.tsx
import React from 'react'
import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  ExternalLink,
} from 'lucide-react'
import type { Navigation, Page, Category } from '@/payload-types'

type NavigationFallback = {
  mainNav?: never[]
  footerNav?: never[]
  socialLinks?: never[]
}

type FooterLink = {
  id?: string | null
  type: 'link' | 'page' | 'category'
  label: string
  url?: string | null
  page?: Page | number | null
  category?: Category | number | null
  openInNewTab?: boolean | null
}

interface FooterProps {
  navigation: Navigation | NavigationFallback
}

const getSocialIcon = (platform: string, className: string = 'h-5 w-5') => {
  switch (platform) {
    case 'facebook':
      return <Facebook className={className} />
    case 'instagram':
      return <Instagram className={className} />
    case 'twitter':
      return <Twitter className={className} />
    case 'linkedin':
      return <Linkedin className={className} />
    case 'youtube':
      return <Youtube className={className} />
    case 'whatsapp':
      return <MessageCircle className={className} />
    default:
      return <ExternalLink className={className} />
  }
}

const getSocialLabel = (platform: string, customLabel?: string) => {
  if (customLabel) return customLabel

  switch (platform) {
    case 'facebook':
      return 'Facebook'
    case 'instagram':
      return 'Instagram'
    case 'twitter':
      return 'Twitter'
    case 'linkedin':
      return 'LinkedIn'
    case 'youtube':
      return 'YouTube'
    case 'tiktok':
      return 'TikTok'
    case 'whatsapp':
      return 'WhatsApp'
    default:
      return 'Social Link'
  }
}

export const Footer: React.FC<FooterProps> = ({ navigation }) => {
  const getHref = (item: FooterLink): string => {
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

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Logo</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your company description goes here. Add a brief overview of what you do and your
              mission.
            </p>
          </div>

          {/* Footer Navigation Sections */}
          {navigation.footerNav?.map((section, sectionIndex) => (
            <div key={section.id || `footer-section-${sectionIndex}`} className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-3">
                {section.links?.map((link, linkIndex) => (
                  <li key={link.id || `footer-link-${linkIndex}`}>
                    <Link
                      href={getHref(link)}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                )) || []}
              </ul>
            </div>
          ))}

          {/* Social Media Links */}
          {navigation.socialLinks && navigation.socialLinks.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">Follow Us</h3>
              <div className="flex space-x-4">
                {navigation.socialLinks.map((social, socialIndex) => (
                  <Link
                    key={social.id || `social-${socialIndex}`}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={getSocialLabel(social.platform, social.label || undefined)}
                  >
                    {getSocialIcon(social.platform)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Your Company Name. All rights reserved.
          </div>

          {/* Additional Footer Links */}
          <div className="flex space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
