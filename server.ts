import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

interface OrderEmailPayload {
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    deliveryLocation?: string;
  };
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  total: number;
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  promoCode?: string;
  status: string;
}

function generateOrderEmailTemplate(payload: OrderEmailPayload): string {
  const itemsHtml = payload.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">
        <strong>${item.product.name}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">
        Rs. ${(item.product.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          border-bottom: 3px solid #2c5f2d;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          color: #2c5f2d;
          font-size: 24px;
        }
        .section {
          margin: 20px 0;
        }
        .section-title {
          background-color: #f0f0f0;
          padding: 10px;
          border-left: 4px solid #2c5f2d;
          font-weight: bold;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        table th {
          background-color: #2c5f2d;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        .total-row {
          background-color: #f9f9f9;
          font-weight: bold;
          font-size: 16px;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .summary-item.total {
          font-size: 18px;
          font-weight: bold;
          color: #2c5f2d;
          border-bottom: none;
          padding-top: 10px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .highlight {
          background-color: #fff3cd;
          padding: 15px;
          border-left: 4px solid #ffc107;
          margin: 15px 0;
        }
        .customer-details {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Order Received</h1>
          <p style="color: #666; margin: 5px 0;">Order ID: <strong>#${payload.orderId}</strong></p>
        </div>

        <div class="section">
          <div class="section-title">👤 Customer Information</div>
          <div class="customer-details">
            <p><strong>Name:</strong> ${payload.customerInfo.name}</p>
            <p><strong>Email:</strong> ${payload.customerInfo.email || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${payload.customerInfo.phone}</p>
            <p><strong>Delivery Location:</strong> ${payload.customerInfo.deliveryLocation || 'Not specified'}</p>
            <p><strong>Delivery Address:</strong><br/> ${payload.customerInfo.deliveryAddress}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">📦 Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">💰 Order Summary</div>
          <div style="padding: 15px;">
            <div class="summary-item">
              <span>Subtotal:</span>
              <span>Rs. ${payload.subtotal.toFixed(2)}</span>
            </div>
            ${payload.promoCode ? `
              <div class="summary-item">
                <span>Promo Code (${payload.promoCode}):</span>
                <span>-Rs. ${payload.discount.toFixed(2)}</span>
              </div>
            ` : `
              <div class="summary-item">
                <span>Discount:</span>
                <span>-Rs. ${payload.discount.toFixed(2)}</span>
              </div>
            `}
            <div class="summary-item">
              <span>Delivery Charges:</span>
              <span>Rs. ${payload.deliveryCharges.toFixed(2)}</span>
            </div>
            <div class="summary-item total">
              <span>Total Amount:</span>
              <span style="color: #2c5f2d;">Rs. ${payload.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="highlight">
          <strong>Status:</strong> This order is currently <strong>${payload.status.toUpperCase()}</strong> and awaiting processing.
        </div>

        <div class="footer">
          <p>This is an automated email from Alhur Foods Order Management System</p>
          <p>&copy; 2026 Alhur Foods. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
}

app.post('/api/send-order-email', async (req: Request, res: Response) => {
  try {
    const payload: OrderEmailPayload = req.body;

    // Validate required fields
    if (!payload.orderId || !payload.customerInfo || !payload.items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'alhurfoods@gmail.com';

    if (!brevoApiKey) {
      console.error('❌ BREVO_API_KEY is not set in environment variables');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    console.log('📧 Sending order email...');
    console.log('Admin Email:', adminEmail);
    console.log('Order ID:', payload.orderId);

    // Generate HTML email template
    const emailHtml = generateOrderEmailTemplate(payload);

    // Send email via Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: 'noreply@alhurfoods.com',
          name: 'Alhur Foods',
        },
        to: [
          {
            email: adminEmail,
            name: 'Admin',
          },
        ],
        subject: `🆕 New Order #${payload.orderId} - ${payload.customerInfo.name}`,
        htmlContent: emailHtml,
        replyTo: {
          email: payload.customerInfo.email || 'noreply@alhurfoods.com',
          name: payload.customerInfo.name,
        },
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      console.error('❌ Brevo API error:', errorData);
      return res.status(500).json({ error: 'Failed to send email', details: errorData });
    }

    const result = await brevoResponse.json();
    console.log('✅ Email sent successfully! Message ID:', result.messageId);
    
    res.status(200).json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Email server running' });
});

app.listen(PORT, () => {
  console.log(`\n✅ Email server running on http://localhost:${PORT}`);
  console.log(`📧 Endpoint: POST http://localhost:${PORT}/api/send-order-email`);
  console.log(`\nMake sure BREVO_API_KEY is set in .env.local\n`);
});
