# E-Commerce Payload Starter

A full-featured e-commerce application built with Next.js 15, PayloadCMS 3.0, and modern web technologies. This project provides a complete e-commerce solution with product management, shopping cart, order processing, and payment integration.

## 🚀 Features

- **Modern Stack**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Headless CMS**: PayloadCMS 3.0 for content management
- **E-commerce Features**:
  - Product catalog with variants and inventory management
  - Shopping cart with persistent state
  - Order management system
  - Payment processing with Razorpay
  - Stock tracking and management
  - Admin dashboard with analytics
- **UI Components**: Radix UI components with shadcn/ui styling
- **Database**: SQLite (development) / MongoDB (production)
- **File Storage**: S3-compatible storage for media
- **Email**: Resend integration for transactional emails
- **Testing**: Playwright for E2E tests, Vitest for unit tests

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 15.4.4 with App Router
- **Runtime**: React 19.1.1
- **Language**: TypeScript 5.7.3
- **Styling**: TailwindCSS 4.1.11 + Tailwind Animate

### Backend & CMS
- **CMS**: PayloadCMS 3.50.0
- **Database**: SQLite (dev) / MongoDB (prod)
- **Storage**: AWS S3 compatible storage (@payloadcms/storage-s3)
- **Email**: Resend (@payloadcms/email-resend)

### Payment & External Services
- **Payments**: Razorpay 2.9.6
- **Media Processing**: Sharp 0.34.2

### UI & Components
- **Component Library**: Radix UI primitives
- **Icons**: Lucide React 0.536.0
- **Tables**: TanStack Table 8.21.3
- **Charts**: Recharts 2.15.4
- **Date Handling**: date-fns 4.1.0

## 📋 Prerequisites

Before setting up this project, ensure you have:

- **Node.js** 18.20.2+ or 20.9.0+
- **pnpm** 9+ or 10+
- **MongoDB** (for production) or SQLite will be used for development
- **Razorpay Account** (for payment processing)
- **AWS S3 or compatible storage** (optional, for file uploads)
- **Resend Account** (optional, for email functionality)

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

### Required Variables
```env
# Database
DATABASE_URI=mongodb://127.0.0.1/your-database-name  # MongoDB URI
# or use SQLite for development (default)

# PayloadCMS
PAYLOAD_SECRET=your-secret-key-here-minimum-32-characters

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Optional Variables
```env
# S3 Storage (for file uploads)
S3_ENDPOINT=your-s3-endpoint
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_REGION=your-region

# Resend (for emails)
RESEND_API_KEY=re_your_resend_api_key

# Cloud Deployment
PAYLOAD_CLOUD_PROJECT_ID=your-payload-cloud-project-id
```

## 🏗️ Account Setup

### 1. Razorpay Setup (Required for Payments)

1. **Sign up** at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Activate your account** (may require KYC for live mode)
3. **Get API Keys**:
   - Go to Settings → API Keys
   - Generate Test/Live API keys
   - Copy `Key Id` and `Key Secret` to your `.env` file

### 2. MongoDB Setup (Production)

**Option A: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and add to `DATABASE_URI`

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Use `DATABASE_URI=mongodb://127.0.0.1/your-database-name`

### 3. S3 Storage Setup (Optional)

**AWS S3:**
1. Create AWS account and S3 bucket
2. Create IAM user with S3 access
3. Add credentials to `.env`

**Alternatives:** DigitalOcean Spaces, Cloudflare R2, or any S3-compatible service

### 4. Resend Setup (Optional)

1. Sign up at [Resend](https://resend.com)
2. Get API key from dashboard
3. Add `RESEND_API_KEY` to `.env`

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecom-payload-starter
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start Development Server
```bash
pnpm dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### 6. Create Admin User
- Go to http://localhost:3000/admin
- Follow the setup wizard to create your first admin user

## 🧪 Testing

### Run All Tests
```bash
pnpm test
```

### Run Integration Tests
```bash
pnpm test:int
```

### Run E2E Tests
```bash
pnpm test:e2e
```

## 💳 Razorpay Test Cards

Use these test card details in development mode:

| Card Network | Card Number | CVV | Expiry Date |
|-------------|-------------|-----|-------------|
| Mastercard | `5267 3181 8797 5449` | Any 3 digits | Any future date |
| Visa | `4386 2894 0766 0153` | Any 3 digits | Any future date |

**Test Scenarios:**
- **Successful Payment**: Use above cards
- **Failed Payment**: Use card number `4000000000000002`
- **Insufficient Funds**: Use card number `4000000000000341`

## 🐳 Docker Setup (Optional)

For local development with Docker:

### 1. Modify Environment
```env
MONGODB_URI=mongodb://127.0.0.1/your-database-name
```

### 2. Start Services
```bash
docker-compose up -d
```

### 3. Run Application
```bash
pnpm dev
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Public-facing pages
│   │   ├── checkout/      # Checkout flow
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── products/      # Product pages
│   │   └── order-success/ # Order confirmation
│   ├── (payload)/         # PayloadCMS routes
│   └── api/               # API routes
│       ├── auth/          # Authentication
│       ├── payment/       # Payment processing
│       ├── orders/        # Order management
│       └── products/      # Product operations
├── collections/           # PayloadCMS collections
│   ├── Users.ts          # User management
│   ├── Products.ts       # Product catalog
│   ├── Categories.ts     # Product categories
│   ├── Orders.ts         # Order processing
│   └── Media.ts          # File uploads
├── components/           # React components
│   ├── ui/              # Base UI components
│   ├── DataTable/       # Data tables
│   ├── AddToCartForm.tsx # Cart functionality
│   ├── CheckoutForm.tsx  # Payment flow
│   └── AppSidebar.tsx    # Navigation
├── contexts/            # React contexts
├── lib/                 # Utility functions
├── types/               # TypeScript definitions
└── payload.config.ts    # PayloadCMS configuration
```

## 🔧 Key Features Explained

### Shopping Cart
- Persistent cart state using React Context
- Support for product variants
- Quantity management with stock validation
- Real-time price calculations

### Payment Processing
- Razorpay integration for secure payments
- Order creation and verification
- Payment failure handling
- Webhook support for payment updates

### Admin Dashboard
- Product management with variants
- Order tracking and management
- User management
- Analytics and reporting
- Stock management

### Inventory Management
- Real-time stock tracking
- Automatic stock updates on purchase
- Low stock alerts
- Variant-level inventory

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Environment Variables for Production
Ensure all required environment variables are set in your production environment, especially:
- `DATABASE_URI` (MongoDB connection)
- `PAYLOAD_SECRET` (secure random string)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_SERVER_URL` (your domain)

## 📚 Additional Documentation

### API Documentation
- **Payment API**: `/api/payment/*` - Handles Razorpay integration
- **Orders API**: `/api/orders/*` - Order management
- **Auth API**: `/api/auth/*` - Authentication endpoints
- **Products API**: `/api/products/*` - Product operations

### Component Documentation
- All components use TypeScript with proper type definitions
- UI components follow Radix UI patterns
- Custom hooks for cart and authentication state

### Database Schema
- Check `src/payload-types.ts` for generated type definitions
- Collections are defined in `src/collections/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 Additional README Suggestions

Consider adding these sections to make the README even more comprehensive:

### 🔒 Security
- Environment variable security
- API rate limiting
- CORS configuration
- Authentication best practices

### 📊 Monitoring & Analytics
- Error tracking setup (Sentry)
- Performance monitoring
- Analytics integration (Google Analytics)
- Health check endpoints

### 🔄 CI/CD
- GitHub Actions workflows
- Automated testing
- Deployment pipelines
- Environment promotion

### 📱 Mobile & PWA
- Responsive design features
- PWA configuration
- Mobile-specific optimizations

### 🌐 Internationalization
- Multi-language support
- Currency handling
- Localization setup

### 🎨 Theming & Customization
- Design system documentation
- Theme customization guide
- Brand color configuration

### 📈 Performance
- Bundle size optimization
- Image optimization
- Caching strategies
- Core Web Vitals

### 🔧 Troubleshooting
- Common issues and solutions
- Debug mode setup
- Log configuration
- Error handling

### 📦 Extensions
- Plugin development guide
- Custom field types
- Hook system usage
- Third-party integrations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you have any issues or questions:

- **PayloadCMS**: [Discord](https://discord.com/invite/payload) | [Documentation](https://payloadcms.com/docs)
- **Next.js**: [GitHub Discussions](https://github.com/vercel/next.js/discussions)
- **Razorpay**: [Documentation](https://razorpay.com/docs/) | [Support](https://razorpay.com/support/)

## 🎯 Roadmap

Future enhancements planned:
- [ ] Multi-vendor marketplace support
- [ ] Advanced analytics dashboard
- [ ] Email marketing integration
- [ ] Social media authentication
- [ ] Advanced search and filtering
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Discount codes and promotions
- [ ] Multi-currency support
- [ ] Advanced inventory management