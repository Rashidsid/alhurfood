/**
 * Email service utility for sending notifications
 * Uses Brevo API through Vercel serverless functions
 */

export interface OrderEmailPayload {
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

/**
 * Send order notification email to admin
 * @param payload Order details to include in email
 * @returns Promise with message ID on success
 */
export async function sendOrderNotificationEmail(
  payload: OrderEmailPayload
): Promise<{ success: boolean; messageId?: string }> {
  try {
    const response = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
    };
  }
}

/**
 * Format order items for email display
 */
export function formatOrderItemsForEmail(
  items: OrderEmailPayload['items']
): string {
  return items
    .map((item) => `${item.product.name} (x${item.quantity}) - Rs. ${(item.product.price * item.quantity).toFixed(2)}`)
    .join('\n');
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toFixed(2)}`;
}
