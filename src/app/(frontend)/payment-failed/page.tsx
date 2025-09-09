// src/app/(frontend)/payment-failed/page.tsx
'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  XCircle, 
  RefreshCw, 
  CreditCard, 
  AlertTriangle,
  Home,
  ShoppingCart,
  Phone,
  Mail,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { formatRupees } from '@/lib/formatHelpers'

interface FailureReason {
  code: string
  description: string
  suggestion: string
}

// Common Razorpay failure codes and their meanings
const failureReasons: Record<string, FailureReason> = {
  'BAD_REQUEST_ERROR': {
    code: 'BAD_REQUEST_ERROR',
    description: 'Invalid payment request',
    suggestion: 'Please try again or contact support if the issue persists.'
  },
  'GATEWAY_ERROR': {
    code: 'GATEWAY_ERROR',
    description: 'Payment gateway error',
    suggestion: 'This is usually a temporary issue. Please try again in a few minutes.'
  },
  'NETWORK_ERROR': {
    code: 'NETWORK_ERROR',
    description: 'Network connection error',
    suggestion: 'Check your internet connection and try again.'
  },
  'SERVER_ERROR': {
    code: 'SERVER_ERROR',
    description: 'Server error occurred',
    suggestion: 'This is a temporary issue on our end. Please try again shortly.'
  },
  'AUTHENTICATION_ERROR': {
    code: 'AUTHENTICATION_ERROR',
    description: 'Payment authentication failed',
    suggestion: 'Please verify your payment details and try again.'
  },
  'AUTHORIZATION_ERROR': {
    code: 'AUTHORIZATION_ERROR',
    description: 'Payment authorization failed',
    suggestion: 'Your payment was declined. Please try a different payment method or contact your bank.'
  },
  'INVALID_REQUEST_ERROR': {
    code: 'INVALID_REQUEST_ERROR',
    description: 'Invalid payment information',
    suggestion: 'Please check your payment details and try again.'
  },
  'RATE_LIMIT_ERROR': {
    code: 'RATE_LIMIT_ERROR',
    description: 'Too many attempts',
    suggestion: 'Please wait a few minutes before trying again.'
  },
  'PAYMENT_DECLINED': {
    code: 'PAYMENT_DECLINED',
    description: 'Payment was declined by your bank',
    suggestion: 'Please try a different payment method or contact your bank for assistance.'
  },
  'INSUFFICIENT_FUNDS': {
    code: 'INSUFFICIENT_FUNDS',
    description: 'Insufficient funds in your account',
    suggestion: 'Please check your account balance or try a different payment method.'
  },
  'CARD_EXPIRED': {
    code: 'CARD_EXPIRED',
    description: 'Your card has expired',
    suggestion: 'Please use a different card or update your card information.'
  },
  'INVALID_CARD': {
    code: 'INVALID_CARD',
    description: 'Invalid card details',
    suggestion: 'Please check your card number, expiry date, and CVV, then try again.'
  }
}

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [retrying, setRetrying] = useState(false)

  const errorCode = searchParams?.get('error') || 'UNKNOWN_ERROR'
  const errorMessage = searchParams?.get('message') || 'Payment failed'
  const _orderId = searchParams?.get('orderId')
  const amount = searchParams?.get('amount')
  const paymentId = searchParams?.get('paymentId')

  const failure = failureReasons[errorCode] || {
    code: 'UNKNOWN_ERROR',
    description: errorMessage || 'An unknown error occurred during payment',
    suggestion: 'Please try again or contact our support team for assistance.'
  }

  const handleRetryPayment = async () => {
    setRetrying(true)
    // Redirect back to checkout with cart restored
    setTimeout(() => {
      router.push('/checkout')
      setRetrying(false)
    }, 1000)
  }

  const _getErrorSeverity = (code: string) => {
    const temporaryErrors = ['GATEWAY_ERROR', 'NETWORK_ERROR', 'SERVER_ERROR', 'RATE_LIMIT_ERROR']
    const userErrors = ['INSUFFICIENT_FUNDS', 'CARD_EXPIRED', 'INVALID_CARD', 'PAYMENT_DECLINED']
    
    if (temporaryErrors.includes(code)) return 'warning'
    if (userErrors.includes(code)) return 'info'
    return 'error'
  }

  const shouldShowRetry = () => {
    const noRetryErrors = ['INSUFFICIENT_FUNDS', 'CARD_EXPIRED', 'INVALID_CARD']
    return !noRetryErrors.includes(errorCode)
  }

  const getRecommendedActions = (code: string) => {
    switch (code) {
      case 'INSUFFICIENT_FUNDS':
        return [
          'Check your account balance',
          'Try a different payment method',
          'Use a different card'
        ]
      case 'PAYMENT_DECLINED':
      case 'AUTHORIZATION_ERROR':
        return [
          'Contact your bank to authorize the payment',
          'Try a different card',
          'Use net banking or UPI'
        ]
      case 'CARD_EXPIRED':
      case 'INVALID_CARD':
        return [
          'Check your card expiry date',
          'Verify card number and CVV',
          'Try a different card'
        ]
      case 'NETWORK_ERROR':
      case 'GATEWAY_ERROR':
        return [
          'Check your internet connection',
          'Try again in a few minutes',
          'Use a different browser'
        ]
      default:
        return [
          'Try again in a few minutes',
          'Use a different payment method',
          'Contact support if issue persists'
        ]
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Error Header */}
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <XCircle className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-red-600">Payment Failed</h1>
            <p className="text-xl text-muted-foreground mb-4">
              Unfortunately, your payment could not be processed.
            </p>
            {amount && (
              <p className="text-lg mb-4">
                Amount: <span className="font-semibold">{formatRupees(parseFloat(amount))}</span>
              </p>
            )}
            {paymentId && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Payment ID:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {paymentId}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Error:</strong> {failure.description}</p>
                  <p><strong>Suggestion:</strong> {failure.suggestion}</p>
                </div>
              </AlertDescription>
            </Alert>

            {failure.code !== 'UNKNOWN_ERROR' && (
              <div className="text-sm text-muted-foreground">
                <p><strong>Error Code:</strong> {failure.code}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              What You Can Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {getRecommendedActions(errorCode).map((action, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{action}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="text-sm text-muted-foreground">
              <p className="mb-2"><strong>Alternative Payment Methods:</strong></p>
              <div className="grid gap-1">
                <p>• Credit/Debit Cards (Visa, Mastercard, RuPay)</p>
                <p>• Net Banking</p>
                <p>• UPI (Google Pay, PhonePe, Paytm)</p>
                <p>• Digital Wallets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {shouldShowRetry() && (
            <Button 
              onClick={handleRetryPayment} 
              disabled={retrying}
              className="flex-1 sm:flex-none"
            >
              {retrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          )}
          
          <Button variant="outline" asChild className="flex-1 sm:flex-none">
            <Link href="/checkout">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Return to Checkout
            </Link>
          </Button>

          <Button variant="outline" asChild className="flex-1 sm:flex-none">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Support Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Contact Support</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>support@yourstore.com</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Support Hours</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                When contacting support, please provide the payment ID and error code shown above for faster assistance.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">🔒 Your financial information is secure</p>
              <p>
                No payment was processed. Your card was not charged. 
                All transactions are encrypted and secure.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  )
}