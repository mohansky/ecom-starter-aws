import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status', 'updatedAt'],
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
      name: 'excerpt',
      label: 'Excerpt (short description for product cards and previews)',
      type: 'textarea',
      admin: {
        description: 'Short description for product cards and previews',
      },
    },
    {
      name: 'description',
      label: 'Description (full description for product details page)',
      type: 'richText',
    },
    {
      name: 'price',
      label: 'Price (in INR)',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'compareAtPrice',
      label: 'Compare at price (in INR) (original price, shown crossed out)',
      type: 'number',
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'costPrice',
      label: 'Cost price (in INR) (hidden from customers)',
      type: 'number',
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'trackQuantity',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        condition: (data) => data.trackQuantity,
        position: 'sidebar',
      },
    },
    {
      name: 'allowBackorder',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (data) => data.trackQuantity,
        position: 'sidebar',
      },
    },
    {
      name: 'weight',
      label: 'Weight (in grams)',
      type: 'number',
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'dimensions',
      type: 'group',
      fields: [
        {
          name: 'length',
          label: 'Length (in centimeters)',
          type: 'number',
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'width',
          label: 'Width (in centimeters)',
          type: 'number',
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'height',
          label: 'Height (in centimeters)',
          type: 'number',
          min: 0,
          admin: {
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'variants',
      label: 'Product Variants (Size, Color, etc.)',
      type: 'array',
      admin: {
        description: 'Add different options for this product (e.g., sizes, colors, storage) that may have different prices',
      },
      fields: [
        {
          name: 'name',
          label: 'Variant Name',
          type: 'text',
          required: true,
          admin: {
            description: 'The type of variant (e.g., Size, Color, Material, Storage)',
          },
        },
        {
          name: 'value',
          label: 'Variant Value',
          type: 'text',
          required: true,
          admin: {
            description: 'The specific option (e.g., Small, Red, 128GB, Cotton)',
          },
        },
        {
          name: 'priceModifier',
          label: 'Price Modifier (in INR)',
          type: 'number',
          defaultValue: 0,
          admin: {
            step: 0.01,
            description: 'Amount to add/subtract from base price. Use +200 to add ₹200, -50 to subtract ₹50, or 0 for no change.',
          },
        },
        {
          name: 'quantity',
          label: 'Variant Quantity (overrides product quantity)',
          type: 'number',
          min: 0,
          admin: {
            description: 'Specific quantity for this variant. Leave empty to use product-level quantity.',
          },
        },
        {
          name: 'weight',
          label: 'Variant Weight (in grams) (overrides product weight)',
          type: 'number',
          min: 0,
          admin: {
            step: 0.01,
            description: 'Specific weight for this variant. Leave empty to use product-level weight.',
          },
        },
        {
          name: 'dimensions',
          label: 'Variant Dimensions (overrides product dimensions)',
          type: 'group',
          admin: {
            description: 'Specific dimensions for this variant. Leave empty to use product-level dimensions.',
          },
          fields: [
            {
              name: 'length',
              label: 'Length (in centimeters)',
              type: 'number',
              min: 0,
              admin: {
                step: 0.01,
              },
            },
            {
              name: 'width',
              label: 'Width (in centimeters)',
              type: 'number',
              min: 0,
              admin: {
                step: 0.01,
              },
            },
            {
              name: 'height',
              label: 'Height (in centimeters)',
              type: 'number',
              min: 0,
              admin: {
                step: 0.01,
              },
            },
          ],
        },
        {
          name: 'sku',
          label: 'Variant SKU',
          type: 'text',
          admin: {
            description: 'Specific SKU for this variant. Leave empty to use product-level SKU.',
          },
        },
      ],
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
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
