import type { Block } from 'payload'

export const RichText: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },
  fields: [
    {
      name: 'columns',
      type: 'select',
      options: [
        {
          label: 'One Column',
          value: 'one',
        },
        {
          label: 'Two Columns',
          value: 'two',
        },
      ],
      defaultValue: 'one',
      required: true,
    },
    {
      name: 'maxWidth',
      type: 'select',
      options: [
        {
          label: 'Small (prose)',
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
        {
          label: 'Full Width',
          value: 'full',
        },
      ],
      defaultValue: 'medium',
      admin: {
        condition: (data, siblingData) => siblingData?.columns === 'one',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        condition: (data, siblingData) => siblingData?.columns === 'one',
      },
    },
    {
      name: 'columnOne',
      type: 'richText',
      required: true,
      admin: {
        condition: (data, siblingData) => siblingData?.columns === 'two',
      },
    },
    {
      name: 'columnTwo',
      type: 'richText',
      required: true,
      admin: {
        condition: (data, siblingData) => siblingData?.columns === 'two',
      },
    },
    {
      name: 'settings',
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
            {
              label: 'Justify',
              value: 'justify',
            },
          ],
          defaultValue: 'left',
        },
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            {
              label: 'None',
              value: 'none',
            },
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
          defaultValue: 'none',
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
        {
          name: 'enableDropCap',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Drop Cap (First Letter Styling)',
          admin: {
            condition: (data, siblingData) => siblingData?.alignment !== 'center',
          },
        },
      ],
    },
  ],
}