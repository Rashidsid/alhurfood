import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PromoCode } from '../types';

interface PromoCodeContextType {
  promoCodes: PromoCode[];
  addPromoCode: (promoCode: Omit<PromoCode, 'id'>) => void;
  updatePromoCode: (id: string, promoCode: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;
  validatePromoCode: (code: string) => PromoCode | null;
}

const PromoCodeContext = createContext<PromoCodeContextType | undefined>(undefined);

const initialPromoCodes: PromoCode[] = [
  {
    id: '1',
    code: 'WELCOME10',
    discount: 10,
    active: true,
  },
  {
    id: '2',
    code: 'SAVE20',
    discount: 20,
    active: true,
  },
];

export function PromoCodeProvider({ children }: { children: ReactNode }) {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('alhur-promo-codes');
    return saved ? JSON.parse(saved) : initialPromoCodes;
  });

  useEffect(() => {
    localStorage.setItem('alhur-promo-codes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  const addPromoCode = (promoCode: Omit<PromoCode, 'id'>) => {
    const newPromoCode: PromoCode = {
      ...promoCode,
      id: Date.now().toString(),
    };
    setPromoCodes([...promoCodes, newPromoCode]);
  };

  const updatePromoCode = (id: string, updatedPromoCode: Partial<PromoCode>) => {
    setPromoCodes(promoCodes.map(pc => pc.id === id ? { ...pc, ...updatedPromoCode } : pc));
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes(promoCodes.filter(pc => pc.id !== id));
  };

  const validatePromoCode = (code: string): PromoCode | null => {
    const promoCode = promoCodes.find(
      pc => pc.code.toLowerCase() === code.toLowerCase() && pc.active
    );

    if (!promoCode) return null;

    if (promoCode.expiryDate) {
      const expiryDate = new Date(promoCode.expiryDate);
      const now = new Date();
      if (now > expiryDate) return null;
    }

    return promoCode;
  };

  return (
    <PromoCodeContext.Provider
      value={{
        promoCodes,
        addPromoCode,
        updatePromoCode,
        deletePromoCode,
        validatePromoCode,
      }}
    >
      {children}
    </PromoCodeContext.Provider>
  );
}

export function usePromoCodes() {
  const context = useContext(PromoCodeContext);
  if (!context) {
    throw new Error('usePromoCodes must be used within PromoCodeProvider');
  }
  return context;
}
