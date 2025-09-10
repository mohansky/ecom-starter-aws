// webhook-test.js - Test script to verify webhook endpoint
const crypto = require('crypto');

// Test webhook payload
const testPayload = {
  "entity": "event",
  "account_id": "acc_test_account",
  "event": "payment.captured",
  "contains": ["payment"],
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_test_payment_id",
        "entity": "payment",
        "amount": 100000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_test_order_id",
        "method": "card",
        "amount_refunded": 0,
        "refund_status": null,
        "captured": true,
        "description": "Test Payment",
        "created_at": 1632150000
      }
    }
  }
};

// Generate webhook signature
function generateWebhookSignature(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
}

// Test function
async function testWebhook() {
  const webhookSecret = 'test_webhook_secret';
  const signature = generateWebhookSignature(testPayload, webhookSecret);
  
  console.log('Test Webhook Data:');
  console.log('Payload:', JSON.stringify(testPayload, null, 2));
  console.log('Signature:', signature);
  console.log('\nTo test manually:');
  console.log('1. Update RAZORPAY_WEBHOOK_SECRET in .env to: test_webhook_secret');
  console.log('2. Use this signature in x-razorpay-signature header:', signature);
  console.log('3. Send POST request to: http://localhost:3000/api/payment/webhook');
}

testWebhook();