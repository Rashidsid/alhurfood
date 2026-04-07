import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Product, Order } from '../app/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([
          {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            stock: product.stock,
            featured: product.featured || false,
          },
        ])
        .select();

      if (insertError) throw insertError;
      if (data) {
        setProducts([data[0], ...products]);
      }
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          category: updates.category,
          image: updates.image,
          stock: updates.stock,
          featured: updates.featured,
        })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      if (data) {
        setProducts(products.map(p => (p.id === id ? data[0] : p)));
      }
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert([
          {
            items: orderData.items,
            total: orderData.total,
            subtotal: orderData.subtotal,
            discount: orderData.discount,
            delivery_charges: orderData.deliveryCharges || 0,
            promo_code: orderData.promoCode,
            customer_info: orderData.customerInfo,
            status: 'pending',
          },
        ])
        .select();

      if (insertError) throw insertError;
      if (data) {
        setOrders([data[0], ...orders]);
      }
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { data, error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      if (data) {
        setOrders(orders.map((o: Order) => (o.id === id ? data[0] : o)));
      }
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    updateOrderStatus,
  };
}
