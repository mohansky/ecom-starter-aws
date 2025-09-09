// src/globals/HomePage.ts
import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      label: 'Hero Section',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Welcome to Our Store',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue: 'Discover amazing products and unbeatable deals',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'ctaButton',
          label: 'Call to Action Button',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'Shop Now',
            },
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
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'link',
              },
              defaultValue: '/products',
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
          ],
        },
      ],
    },
    {
      name: 'textWithImage',
      label: 'Text with Image Section',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'About Our Company',
        },
        {
          name: 'content',
          type: 'richText',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'imagePosition',
          type: 'select',
          options: [
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
          defaultValue: 'right',
        },
        {
          name: 'button',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'Learn More',
            },
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
              ],
              defaultValue: 'link',
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'link',
              },
              defaultValue: '/about',
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'page',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'featuredProducts',
      label: 'Featured Products Section',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Featured Products',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue: 'Check out our most popular items',
        },
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          maxRows: 8,
        },
        {
          name: 'viewAllButton',
          label: 'View All Button',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'View All Products',
            },
            {
              name: 'url',
              type: 'text',
              defaultValue: '/products',
            },
          ],
        },
      ],
    },
    {
      name: 'featuredCategories',
      label: 'Featured Categories Section',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Shop by Category',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue: 'Explore our product categories',
        },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          maxRows: 6,
        },
      ],
    },
  ],
}
