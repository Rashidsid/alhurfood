import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, CartItem } from '../types';
import { supabase } from '../../lib/supabaseClient';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<string>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
    try {
      setError(null);
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert([
          {
            items: order.items,
            total: order.total,
            subtotal: order.subtotal,
            discount: order.discount,
            delivery_charges: order.deliveryCharges || 0,
            promo_code: order.promoCode,
            customer_info: order.customerInfo,
            status: 'pending',
          },
        ])
        .select();

      if (insertError) throw insertError;
      if (data && data[0]) {
        setOrders([data[0], ...orders]);
        return data[0].id;
      }
      throw new Error('No order data returned');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      if (data) {
        setOrders(orders.map(o => (o.id === id ? data[0] : o)));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
      setError(errorMessage);
      throw err;
    }
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        addOrder,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
}
