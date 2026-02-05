import React, { useMemo } from 'react';
import { Sale, Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import { formatCurrency, isToday, isCurrentMonth } from '../utils';

interface ProductSummaryProps {
  sales: Sale[];
  customProducts: Product[];
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({ sales, customProducts }) => {
  const summary = useMemo(() => {
    const stats: Record<string, { dailyQty: number; monthlyQty: number; totalValue: number }> = {};
    const allKnownProducts = [...INITIAL_PRODUCTS, ...customProducts];
    
    allKnownProducts.forEach(p => {
      stats[p.id] = { dailyQty: 0, monthlyQty: 0, totalValue: 0 };
    });

    sales.forEach(sale => {
      const today = isToday(sale.date);
      const currentMonth = isCurrentMonth(sale.date);
      sale.items.forEach(item => {
        if (!stats[item.productId]) stats[item.productId] = { dailyQty: 0, monthlyQty: 0, totalValue: 0 };
        if (today) stats[item.productId].dailyQty += item.quantity;
        if (currentMonth) {
          stats[item.productId].monthlyQty += item.quantity;
          stats[item.productId].totalValue += (item.quantity * item.unitPrice);
        }
      });
    });

    return Object.keys(stats).map(id => {
      const product = allKnownProducts.find(p => p.id === id);
      return { id, name: product?.name || `Produto #${id}`, ...stats[id] };
    }).filter(p => p.monthlyQty > 0).sort((a, b) => b.totalValue - a.totalValue);
  }, [sales, customProducts]);

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border-2 border-slate-100 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b-2 border-slate-100 flex justify-between items-center">
        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Ranking do Mês</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white text-slate-400 uppercase text-[9px] font-black border-b border-slate-50">
            <tr>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4 text-center">Hoje</th>
              <th className="px-6 py-4 text-center">Mês</th>
              <th className="px-6 py-4 text-right">R$ Mês</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {summary.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-300 font-black uppercase text-xs">Aguardando vendas...</td></tr>
            ) : (
              summary.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-black text-slate-700 uppercase text-xs">{item.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black ${item.dailyQty > 0 ? 'bg-red-100 text-red-600' : 'text-slate-200'}`}>
                      {item.dailyQty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-slate-600">{item.monthlyQty}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">{formatCurrency(item.totalValue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};