import type { Block } from 'payload'

export const TextWithImage: Block = {
  slug: 'textWithImage',
  labels: {
    singular: 'Text with Image',
    plural: 'Text with Image Blocks',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      options: [
        {
          label: 'Image Left, Text Right',
          value: 'imageLeft',
        },
        {
          label: 'Text Left, Image Right',
          value: 'imageRight',
        },
      ],
      defaultValue: 'imageRight',
      required: true,
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      options: [
        {
          label: 'Top',
          value: 'top',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Bottom',
          value: 'bottom',
        },
      ],
      defaultValue: 'center',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'imageSize',
      type: 'select',
      options: [
        {
          label: '1/3 Width',
          value: 'oneThird',
        },
        {
          label: '1/2 Width',
          value: 'half',
        },
        {
          label: '2/3 Width',
          value: 'twoThirds',
        },
      ],
      defaultValue: 'half',
    },
    {
      name: 'content',
      type: 'group',
      fields: [
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
          type: 'text',
        },
        {
          name: 'richText',
          type: 'richText',
          required: true,
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
          defaultValue: 'medium',
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
          defaultValue: 'medium',
        },
      ],
    },
  ],
}