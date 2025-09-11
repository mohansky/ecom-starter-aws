// src/collections/Orders.ts
import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customerRef',
      type: 'relationship',
      relationTo: 'customers',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
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
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'total',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            step: 0.01,
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'shipping',
      type: 'group',
      fields: [
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
      name: 'billing',
      type: 'group',
      fields: [
        {
          name: 'sameAsShipping',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'address1',
          type: 'text',
          admin: {
            condition: (data) => !data.billing?.sameAsShipping,
          },
        },
        {
          name: 'address2',
          type: 'text',
          admin: {
            condition: (data) => !data.billing?.sameAsShipping,
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            condition: (data) => !data.billing?.sameAsShipping,
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            condition: (data) => !data.billing?.sameAsShipping,
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          admin: {
            condition: (data) => !data.billing?.sameAsShipping,
          },
        },
        {
          name: 'country',
          type: 'text',
          admin: {
            condition: (data) => !data.billing?.sameAsShipping,
          },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
        readOnly: true,
      },
    },
    {
      name: 'tax',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'shipping_cost',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'discount',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
        readOnly: true,
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        {
          label: 'Razorpay',
          value: 'razorpay',
        },
        {
          label: 'Credit Card',
          value: 'credit_card',
        },
        {
          label: 'Cash on Delivery',
          value: 'cod',
        },
      ],
      required: true,
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        {
          name: 'razorpayOrderId',
          type: 'text',
          admin: {
            description: 'Razorpay Order ID',
          },
        },
        {
          name: 'razorpayPaymentId',
          type: 'text',
          admin: {
            description: 'Razorpay Payment ID',
          },
        },
        {
          name: 'razorpaySignature',
          type: 'text',
          admin: {
            description: 'Razorpay Payment Signature',
            readOnly: true,
          },
        },
        {
          name: 'paymentStatus',
          type: 'select',
          options: [
            {
              label: 'Pending',
              value: 'pending',
            },
            {
              label: 'Authorized',
              value: 'authorized',
            },
            {
              label: 'Captured',
              value: 'captured',
            },
            {
              label: 'Refunded',
              value: 'refunded',
            },
            {
              label: 'Failed',
              value: 'failed',
            },
          ],
          defaultValue: 'pending',
        },
        {
          name: 'paymentMethod',
          type: 'text',
          admin: {
            description: 'Payment method used (card, upi, netbanking, etc.)',
          },
        },
        {
          name: 'paymentDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'amount',
          type: 'number',
          admin: {
            description: 'Payment amount in paise',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'paymentId',
      type: 'text',
      admin: {
        description: 'Legacy payment ID field - use payment.razorpayPaymentId instead',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (
          operation === 'create' ||
          (operation === 'update' && !req.context?.preventCustomerUpdate)
        ) {
          const customerEmail = doc.customer?.email

          if (customerEmail) {
            const existingCustomer = await req.payload.find({
              collection: 'customers',
              where: {
                email: {
                  equals: customerEmail,
                },
              },
              limit: 1,
            })

            const addresses: Array<{
              type: 'shipping' | 'billing'
              address1: string
              address2?: string | null
              city: string
              state: string
              postalCode: string
              country: string
            }> = [
              {
                type: 'shipping' as const,
                address1: doc.shipping.address1,
                address2: doc.shipping.address2,
                city: doc.shipping.city,
                state: doc.shipping.state,
                postalCode: doc.shipping.postalCode,
                country: doc.shipping.country,
              },
            ]

            if (!doc.billing?.sameAsShipping && doc.billing?.address1) {
              addresses.push({
                type: 'billing' as const,
                address1: doc.billing.address1,
                address2: doc.billing.address2,
                city: doc.billing.city,
                state: doc.billing.state,
                postalCode: doc.billing.postalCode,
                country: doc.billing.country,
              })
            }

            const customerData = {
              email: customerEmail,
              firstName: doc.customer.firstName,
              lastName: doc.customer.lastName,
              phone: doc.customer.phone,
              addresses,
            }

            let customerId

            if (existingCustomer.docs.length > 0) {
              const customer = existingCustomer.docs[0]
              customerId = customer.id

              const updatedAddresses = [...(customer.addresses || [])]
              customerData.addresses.forEach((newAddress) => {
                const existingAddressIndex = updatedAddresses.findIndex(
                  (addr) => addr.type === newAddress.type && addr.address1 === newAddress.address1,
                )
                if (existingAddressIndex === -1) {
                  updatedAddresses.push(newAddress)
                }
              })

              await req.payload.update({
                collection: 'customers',
                id: customer.id,
                data: {
                  ...customerData,
                  addresses: updatedAddresses,
                },
              })
            } else {
              const newCustomer = await req.payload.create({
                collection: 'customers',
                data: customerData,
              })
              customerId = newCustomer.id
            }

            if (customerId && doc.customerRef !== customerId) {
              try {
                await req.payload.update({
                  collection: 'orders',
                  id: doc.id,
                  data: {
                    customerRef: customerId,
                  },
                  context: {
                    preventCustomerUpdate: true,
                  },
                })
              } catch (updateError) {
                console.error('Failed to update order customerRef:', {
                  orderId: doc.id,
                  customerId,
                  error: updateError instanceof Error ? updateError.message : updateError
                })
                // Don't throw the error to prevent the entire order creation from failing
                // The order will still be created without the customerRef being set
              }
            }
          }
        }
      },
    ],
  },
}
