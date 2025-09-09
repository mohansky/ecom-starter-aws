import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'totalOrders', 'totalSpent', 'createdAt'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            {
              label: 'Shipping',
              value: 'shipping',
            },
            {
              label: 'Billing',
              value: 'billing',
            },
          ],
          required: true,
        },
        {
          name: 'address1',
          type: 'text',
          required: true,
        },
        {
          name: 'address2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'orders',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalOrders',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalSpent',
      type: 'number',
      defaultValue: 0,
      admin: {
        step: 0.01,
        readOnly: true,
      },
    },
    {
      name: 'lastOrderDate',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
      ],
      defaultValue: 'active',
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          const orders = await req.payload.find({
            collection: 'orders',
            where: {
              'customer.email': {
                equals: data.email,
              },
            },
          })

          data.totalOrders = orders.docs.length
          data.totalSpent = orders.docs.reduce((sum, order) => sum + (order.total || 0), 0)
          
          if (orders.docs.length > 0) {
            const sortedOrders = orders.docs.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            data.lastOrderDate = sortedOrders[0].createdAt
          }

          data.orders = orders.docs.map(order => order.id)
        }
        return data
      },
    ],
  },
}