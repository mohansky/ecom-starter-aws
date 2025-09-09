import type { Block } from 'payload'

export const ProductShowcase: Block = {
  slug: 'productShowcase',
  labels: {
    singular: 'Product Showcase',
    plural: 'Product Showcase Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Featured Products',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'displayType',
      type: 'select',
      options: [
        {
          label: 'Manual Selection',
          value: 'manual',
        },
        {
          label: 'Featured Products',
          value: 'featured',
        },
        {
          label: 'Latest Products',
          value: 'latest',
        },
        {
          label: 'By Category',
          value: 'category',
        },
      ],
      defaultValue: 'manual',
      required: true,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 12,
      admin: {
        condition: (data, siblingData) => siblingData?.displayType === 'manual',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        condition: (data, siblingData) => siblingData?.displayType === 'category',
      },
    },
    {
      name: 'numberOfProducts',
      type: 'number',
      min: 1,
      max: 12,
      defaultValue: 6,
      admin: {
        condition: (data, siblingData) => 
          siblingData?.displayType === 'featured' || 
          siblingData?.displayType === 'latest' || 
          siblingData?.displayType === 'category',
      },
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'columns',
          type: 'select',
          options: [
            {
              label: '2 Columns',
              value: '2',
            },
            {
              label: '3 Columns',
              value: '3',
            },
            {
              label: '4 Columns',
              value: '4',
            },
          ],
          defaultValue: '3',
        },
        {
          name: 'spacing',
          type: 'select',
          options: [
            {
              label: 'Compact',
              value: 'compact',
            },
            {
              label: 'Normal',
              value: 'normal',
            },
            {
              label: 'Spacious',
              value: 'spacious',
            },
          ],
          defaultValue: 'normal',
        },
        {
          name: 'showPricing',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showComparePrice',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            condition: (data, siblingData) => siblingData?.showPricing,
          },
        },
        {
          name: 'showQuickView',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'showAddToCart',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'callToAction',
      type: 'group',
      fields: [
        {
          name: 'enable',
          type: 'checkbox',
          defaultValue: false,
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
          admin: {
            condition: (data, siblingData) => siblingData?.enable,
          },
        },
        {
          name: 'label',
          type: 'text',
          defaultValue: 'View All Products',
          admin: {
            condition: (data, siblingData) => siblingData?.enable,
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.enable && siblingData?.type === 'link',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (data, siblingData) => siblingData?.enable && siblingData?.type === 'page',
          },
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          admin: {
            condition: (data, siblingData) => siblingData?.enable && siblingData?.type === 'category',
          },
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            {
              label: 'White',
              value: 'white',
            },
            {
              label: 'Light Gray',
              value: 'gray-50',
            },
            {
              label: 'Dark Gray',
              value: 'gray-900',
            },
            {
              label: 'Primary',
              value: 'primary',
            },
          ],
          defaultValue: 'white',
        },
        {
          name: 'paddingTop',
          type: 'select',
          options: [
            {
              label: 'None',
              value: 'none',
            },
            {
              label: 'Small',
              value: 'small',
            },
            {
              label: 'Medium',
              value: 'medium',
            },
            {
              label: 'Large',
              value: 'large',
            },
          ],
          defaultValue: 'large',
        },
        {
          name: 'paddingBottom',
          type: 'select',
          options: [
            {
              label: 'None',
              value: 'none',
            },
            {
              label: 'Small',
              value: 'small',
            },
            {
              label: 'Medium',
              value: 'medium',
            },
            {
              label: 'Large',
              value: 'large',
            },
          ],
          defaultValue: 'large',
        },
      ],
    },
  ],
}