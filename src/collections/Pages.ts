import type { CollectionConfig } from 'payload'
import { Hero, TextWithImage, RichText, ProductShowcase } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'pageBuilder',
      type: 'blocks',
      blocks: [Hero, TextWithImage, RichText, ProductShowcase],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Fallback Content (Legacy)',
      admin: {
        description: 'Use Page Builder above for modern layouts. This field is for backward compatibility.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Full Width',
          value: 'fullWidth',
        },
        {
          label: 'Narrow',
          value: 'narrow',
        },
      ],
      defaultValue: 'default',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'pageType',
      type: 'select',
      options: [
        {
          label: 'Standard Page',
          value: 'page',
        },
        {
          label: 'Homepage',
          value: 'homepage',
        },
        {
          label: 'About',
          value: 'about',
        },
        {
          label: 'Contact',
          value: 'contact',
        },
        {
          label: 'Privacy Policy',
          value: 'privacy',
        },
        {
          label: 'Terms of Service',
          value: 'terms',
        },
        {
          label: 'FAQ',
          value: 'faq',
        },
      ],
      defaultValue: 'page',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'navigationOrder',
      type: 'number',
      admin: {
        condition: (data) => data.showInNavigation,
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'keywords',
          type: 'text',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}