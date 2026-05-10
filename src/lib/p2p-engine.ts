
"use client"

import { supabase } from "./supabase";

export type OrderStatus = 'pending-payment' | 'in-review' | 'success' | 'rejected' | 'timeout' | 'cancelled';

export interface P2POrder {
  id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  profit_percent: number;
  bonus: number;
  status: OrderStatus;
  timestamp: number;
  utr?: string;
  screenshot_url?: string;
  seller_upi: string;
  seller_name: string;
  expiry_time: string;
  receiver_terminal?: any;
}

export const P2PEngine = {
  matchOrder: async (amount: number, buyerId: string) => {
    // 1. Find an active seller with sufficient balance and at least one online UPI account
    const { data: sellers, error: sellerError } = await supabase
      .from('profiles')
      .select(`
        id, 
        name, 
        balance, 
        locked_balance,
        linked_accounts (
          upi,
          app_name,
          logo,
          account_holder_name,
          is_online
        )
      `)
      .eq('is_selling', true)
      .eq('status', 'active')
      .gte('balance', amount) // Critical: Ensure seller has enough balance
      .neq('id', buyerId);

    if (sellerError || !sellers) return { error: "Matching Engine Error" };

    // Filter sellers who have at least one online account
    const validSellers = sellers.filter(s => s.linked_accounts.some((acc: any) => acc.is_online));

    if (validSellers.length === 0) return { error: "No seller available currently with sufficient balance." };

    // Select the best seller (could be random or based on rating, here we pick first)
    const seller = validSellers[Math.floor(Math.random() * validSellers.length)];
    const onlineAccount = seller.linked_accounts.find((acc: any) => acc.is_online);

    const orderId = `#ORD${Math.floor(100000000 + Math.random() * 900000000)}`;
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // 2. Lock Seller Balance (Atomic operation)
    const { error: lockError } = await supabase.rpc('lock_seller_balance', {
      p_seller_id: seller.id,
      p_amount: amount
    });

    if (lockError) return { error: "Failed to lock assets" };

    // 3. Create Order
    const newOrder = {
      id: orderId,
      buyer_id: buyerId,
      seller_id: seller.id,
      amount: amount,
      profit_percent: 6,
      bonus: 5,
      status: 'pending-payment',
      seller_upi: onlineAccount.upi,
      seller_name: onlineAccount.account_holder_name || seller.name,
      expiry_time: expiryTime,
      receiver_terminal: onlineAccount
    };

    const { error: orderError } = await supabase.from('p2p_orders').insert([newOrder]);

    if (orderError) {
      // Rollback balance lock if order fails
      await supabase.rpc('refund_seller_balance', { p_seller_id: seller.id, p_amount: amount });
      return { error: "Order generation failed" };
    }

    return { order: newOrder };
  },

  submitProof: async (orderId: string, utr: string, screenshotUrl: string) => {
    return await supabase
      .from('p2p_orders')
      .update({ status: 'in-review', utr, screenshot_url: screenshotUrl })
      .eq('id', orderId);
  },

  approveOrder: async (orderId: string) => {
    const { data: order } = await supabase.from('p2p_orders').select('*').eq('id', orderId).single();
    if (!order) return { error: "Order not found" };

    // Finalize transaction in database
    const { error } = await supabase.rpc('finalize_order_success', {
      p_seller_id: order.seller_id,
      p_buyer_id: order.buyer_id,
      p_amount: Number(order.amount),
      p_profit: (Number(order.amount) * Number(order.profit_percent) / 100) + Number(order.bonus)
    });

    if (error) return { error: error.message };

    return await supabase.from('p2p_orders').update({ status: 'success' }).eq('id', orderId);
  },

  rejectOrder: async (orderId: string) => {
    const { data: order } = await supabase.from('p2p_orders').select('*').eq('id', orderId).single();
    if (!order) return { error: "Order not found" };

    // Refund seller's locked balance
    const { error } = await supabase.rpc('refund_seller_balance', {
      p_seller_id: order.seller_id,
      p_amount: Number(order.amount)
    });

    if (error) return { error: error.message };

    return await supabase.from('p2p_orders').update({ status: 'rejected' }).eq('id', orderId);
  }
};
