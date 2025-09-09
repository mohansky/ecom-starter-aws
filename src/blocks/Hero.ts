import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Full Height',
          value: 'fullHeight',
        },
        {
          label: 'Half Height',
          value: 'halfHeight',
        },
        {
          label: 'Auto Height',
          value: 'autoHeight',
        },
      ],
      defaultValue: 'halfHeight',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
    },
    {
      name: 'overlay',
      type: 'group',
      label: 'Background Overlay',
      fields: [
        {
          name: 'enable',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'color',
          type: 'select',
          options: [
            {
              label: 'Black',
              value: 'black',
            },
            {
              label: 'White',
              value: 'white',
            },
            {
              label: 'Dark Gray',
              value: 'gray-900',
            },
            {
              label: 'Blue',
              value: 'blue-900',
            },
          ],
          defaultValue: 'black',
          admin: {
            condition: (data, siblingData) => siblingData?.enable,
          },
        },
        {
          name: 'opacity',
          type: 'select',
          options: [
            {
              label: '10%',
              value: '10',
            },
            {
              label: '20%',
              value: '20',
            },
            {
              label: '30%',
              value: '30',
            },
            {
              label: '40%',
              value: '40',
            },
            {
              label: '50%',
              value: '50',
            },
            {
              label: '60%',
              value: '60',
            },
            {
              label: '70%',
              value: '70',
            },
          ],
          defaultValue: '50',
          admin: {
            condition: (data, siblingData) => siblingData?.enable,
          },
        },
      ],
    },
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'alignment',
          type: 'select',
          options: [
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Center',
              value: 'center',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
          defaultValue: 'left',
        },
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Eyebrow Text',
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'subheading',
          type: 'textarea',
        },
        {
          name: 'description',
          type: 'richText',
        },
        {
          name: 'buttons',
          type: 'array',
          maxRows: 2,
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
              name: 'style',
              type: 'select',
              options: [
                {
                  label: 'Primary',
                  value: 'primary',
                },
                {
                  label: 'Secondary',
                  value: 'secondary',
                },
                {
                  label: 'Outline',
                  value: 'outline',
                },
              ],
              defaultValue: 'primary',
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
  ],
}