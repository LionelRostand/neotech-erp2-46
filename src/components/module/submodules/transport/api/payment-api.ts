
// Payment API mock functions
import { toast } from "sonner";

export interface PaymentRequest {
  reservationId: string;
  amount: number;
  method: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
  customerName?: string;
}

export interface RefundRequest {
  paymentId: string;
  reservationId: string;
  amount: number;
  reason: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  message: string;
  transactionReference?: string;
  date?: string;
}

/**
 * Process a payment for a reservation
 */
export const processPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  // This is a mock function that simulates a payment API call
  console.log("Processing payment:", paymentData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate success (in real app, would call actual payment processor)
  if (Math.random() > 0.1) { // 90% success rate
    return {
      success: true,
      paymentId: `pmt-${Date.now()}`,
      message: "Payment processed successfully",
      transactionReference: `tx-${Math.floor(Math.random() * 10000000)}`,
      date: new Date().toISOString()
    };
  } else {
    // Simulate occasional payment failure
    throw new Error("Payment processing failed: Card declined");
  }
};

/**
 * Process a refund for a payment
 */
export const processRefund = async (refundData: RefundRequest): Promise<PaymentResponse> => {
  console.log("Processing refund:", refundData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate success (in real app, would call actual payment processor)
  if (Math.random() > 0.05) { // 95% success rate for refunds
    return {
      success: true,
      paymentId: refundData.paymentId,
      message: "Refund processed successfully",
      transactionReference: `ref-${Math.floor(Math.random() * 10000000)}`,
      date: new Date().toISOString()
    };
  } else {
    // Simulate occasional refund failure
    throw new Error("Refund processing failed: System error");
  }
};
