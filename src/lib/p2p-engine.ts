
"use client"

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
  buyerPaymentMethod?: {
    appName: string;
    logo: string;
    upi: string;
  };
  receiverTerminal?: {
    appName: string;
    logo: string;
    upi: string;
    name: string;
  };
}

export const P2PEngine = {
  matchOrder: (amount: number, buyerId: string): P2POrder | null => {
    const users = JSON.parse(localStorage.getItem('flexpay_users') || '[]');
    
    const seller = users.find((u: any) => 
      u.status === 'active' && 
      u.isSelling === true && 
      u.balance >= amount &&
      u.uid !== buyerId
    );

    if (!seller) return null;

    const orderId = `#ORD${Math.floor(100000000 + Math.random() * 900000000)}`;
    
    seller.balance -= amount;
    if (!seller.lockedBalance) seller.lockedBalance = 0;
    seller.lockedBalance += amount;
    
    const updatedUsers = users.map((u: any) => u.uid === seller.uid ? seller : u);
    localStorage.setItem('flexpay_users', JSON.stringify(updatedUsers));

    const selectedTerminal = seller.linkedAccounts?.[0] || { appName: "Default Pay", logo: "", upi: "merchant@upi", name: seller.name };

    const newOrder: P2POrder = {
      id: orderId,
      buyerId: buyerId,
      sellerId: seller.uid,
      amount: amount,
      profitPercent: 6,
      bonus: 5,
      status: 'pending-payment',
      timestamp: Date.now(),
      sellerUpi: selectedTerminal.upi,
      sellerName: seller.name,
      expiryTime: Date.now() + (30 * 60 * 1000),
      receiverTerminal: {
        appName: selectedTerminal.appName,
        logo: selectedTerminal.logo,
        upi: selectedTerminal.upi,
        name: selectedTerminal.name || seller.name
      }
    };

    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    localStorage.setItem('flexpay_orders', JSON.stringify([newOrder, ...history]));

    window.dispatchEvent(new CustomEvent('p2p_order_update', { detail: newOrder }));
    window.dispatchEvent(new CustomEvent('flexpay_users_update'));
    
    return newOrder;
  },

  cancelOrder: (orderId: string, reason: string) => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const orderIndex = history.findIndex((o: P2POrder) => o.id === orderId);
    
    if (orderIndex > -1) {
      const order = history[orderIndex];
      if (order.status === 'pending-payment' || order.status === 'in-review') {
        const users = JSON.parse(localStorage.getItem('flexpay_users') || '[]');
        const sellerIndex = users.findIndex((u: any) => u.uid === order.sellerId);
        
        if (sellerIndex > -1) {
          users[sellerIndex].balance += order.amount;
          users[sellerIndex].lockedBalance -= order.amount;
          localStorage.setItem('flexpay_users', JSON.stringify(users));
        }

        order.status = 'cancelled';
        order.cancelReason = reason;
        localStorage.setItem('flexpay_orders', JSON.stringify(history));
        window.dispatchEvent(new CustomEvent('p2p_order_update', { detail: order }));
        window.dispatchEvent(new CustomEvent('flexpay_users_update'));
      }
    }
  },

  approveOrder: (orderId: string) => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const order = history.find((o: P2POrder) => o.id === orderId);
    
    if (order && order.status === 'in-review') {
      const users = JSON.parse(localStorage.getItem('flexpay_users') || '[]');
      const seller = users.find((u: any) => u.uid === order.sellerId);
      if (seller) {
        seller.lockedBalance -= order.amount;
        localStorage.setItem('flexpay_users', JSON.stringify(users.map((u: any) => u.uid === seller.uid ? seller : u)));
      }

      order.status = 'success';
      localStorage.setItem('flexpay_orders', JSON.stringify(history));
      window.dispatchEvent(new CustomEvent('p2p_order_update', { detail: order }));
      window.dispatchEvent(new CustomEvent('flexpay_users_update'));
    }
  }
};
