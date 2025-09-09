// src/globals/Navigation.ts
import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'mainNav',
      label: 'Main Navigation',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            {
              label: 'Link',
              value: 'link',
            },
            {
              label: 'Page',
              value: 'page',
            },
            {
              label: 'Category',
              value: 'category',
            },
            {
              label: 'Dropdown',
              value: 'dropdown',
            },
          ],
          defaultValue: 'link',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'link',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'page',
          },
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'category',
          },
        },
        {
          name: 'dropdown',
          type: 'array',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                {
                  label: 'Link',
                  value: 'link',
                },
                {
                  label: 'Page',
                  value: 'page',
                },
                {
                  label: 'Category',
                  value: 'category',
                },
              ],
              defaultValue: 'link',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'link',
              },
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'page',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'category',
              },
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'dropdown',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => siblingData?.type !== 'dropdown',
          },
        },
      ],
    },
    {
      name: 'footerNav',
      label: 'Footer Navigation',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                {
                  label: 'Link',
                  value: 'link',
                },
                {
                  label: 'Page',
                  value: 'page',
                },
                {
                  label: 'Category',
                  value: 'category',
                },
              ],
              defaultValue: 'link',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'link',
              },
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'page',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'category',
              },
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      label: 'Social Media Links',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            {
              label: 'Facebook',
              value: 'facebook',
            },
            {
              label: 'Instagram',
              value: 'instagram',
            },
            {
              label: 'Twitter',
              value: 'twitter',
            },
            {
              label: 'LinkedIn',
              value: 'linkedin',
            },
            {
              label: 'YouTube',
              value: 'youtube',
            },
            {
              label: 'TikTok',
              value: 'tiktok',
            },
            {
              label: 'WhatsApp',
              value: 'whatsapp',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.platform === 'other',
          },
        },
      ],
    },
  ],
}
