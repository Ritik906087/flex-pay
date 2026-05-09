
"use client"

import { MOCK_USERS } from "./mock-admin-data";

export type OrderStatus = 'pending-payment' | 'in-review' | 'success' | 'rejected' | 'timeout' | 'cancelled';

export interface P2POrder {
  id: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  profitPercent: number;
  bonus: number;
  status: OrderStatus;
  timestamp: number;
  utr?: string;
  screenshot?: string;
  sellerUpi: string;
  sellerName: string;
  expiryTime: number;
}

// Simulated Central DB for P2P Matching
export const P2PEngine = {
  // Find a matching seller and lock funds
  matchOrder: (amount: number, buyerId: string): P2POrder | null => {
    // Get all users from storage to simulate real state
    const users = JSON.parse(localStorage.getItem('flexpay_users') || JSON.stringify(MOCK_USERS));
    
    // Find active seller with enough balance
    const seller = users.find((u: any) => 
      u.status === 'active' && 
      u.isSelling === true && 
      u.balance >= amount &&
      u.uid !== buyerId
    );

    if (!seller) return null;

    // Create Order ID
    const orderId = `#ORD${Math.floor(100000000 + Math.random() * 900000000)}`;
    
    // Lock Funds Logic
    seller.balance -= amount;
    if (!seller.lockedBalance) seller.lockedBalance = 0;
    seller.lockedBalance += amount;
    
    // Update users in "DB"
    const updatedUsers = users.map((u: any) => u.uid === seller.uid ? seller : u);
    localStorage.setItem('flexpay_users', JSON.stringify(updatedUsers));

    const newOrder: P2POrder = {
      id: orderId,
      buyerId: buyerId,
      sellerId: seller.uid,
      amount: amount,
      profitPercent: 6,
      bonus: 5,
      status: 'pending-payment',
      timestamp: Date.now(),
      sellerUpi: seller.linkedAccounts?.[0]?.upi || "flexpay@upi",
      sellerName: seller.name,
      expiryTime: Date.now() + (30 * 60 * 1000) // 30 Minutes
    };

    // Save Order
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    localStorage.setItem('flexpay_orders', JSON.stringify([newOrder, ...history]));

    // Trigger Real-time Event
    window.dispatchEvent(new CustomEvent('p2p_order_update', { detail: newOrder }));
    
    return newOrder;
  },

  // Handle Cancellation / Timeout
  cancelOrder: (orderId: string, reason: string) => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const order = history.find((o: P2POrder) => o.id === orderId);
    
    if (order && (order.status === 'pending-payment' || order.status === 'in-review')) {
      // Refund Seller
      const users = JSON.parse(localStorage.getItem('flexpay_users') || JSON.stringify(MOCK_USERS));
      const seller = users.find((u: any) => u.uid === order.sellerId);
      
      if (seller) {
        seller.balance += order.amount;
        seller.lockedBalance -= order.amount;
        localStorage.setItem('flexpay_users', JSON.stringify(users.map((u: any) => u.uid === seller.uid ? seller : u)));
      }

      order.status = 'cancelled';
      order.cancelReason = reason;
      localStorage.setItem('flexpay_orders', JSON.stringify(history));
      window.dispatchEvent(new CustomEvent('p2p_order_update', { detail: order }));
    }
  },

  // Admin Approval
  approveOrder: (orderId: string) => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const order = history.find((o: P2POrder) => o.id === orderId);
    
    if (order && order.status === 'in-review') {
      // Deduct locked funds permanently from seller
      const users = JSON.parse(localStorage.getItem('flexpay_users') || JSON.stringify(MOCK_USERS));
      const seller = users.find((u: any) => u.uid === order.sellerId);
      if (seller) {
        seller.lockedBalance -= order.amount;
        localStorage.setItem('flexpay_users', JSON.stringify(users.map((u: any) => u.uid === seller.uid ? seller : u)));
      }

      order.status = 'success';
      localStorage.setItem('flexpay_orders', JSON.stringify(history));
      window.dispatchEvent(new CustomEvent('p2p_order_update', { detail: order }));
    }
  }
};
