import React from 'react';
import { Sale } from '../types';
import { formatCurrency, isToday, isCurrentMonth } from '../utils';
import { TrendingUp, DollarSign, Target } from 'lucide-react';

interface DashboardProps {
  sales: Sale[];
  meta: number;
  onMetaChange: (newMeta: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ sales, meta, onMetaChange }) => {
  const todaySales = sales.filter(s => isToday(s.date));
  const monthSales = sales.filter(s => isCurrentMonth(s.date));

  const todayTotal = todaySales.reduce((acc, s) => acc + s.totalValue, 0);
  const monthTotal = monthSales.reduce((acc, s) => acc + s.totalValue, 0);
  
  const todayClients = todaySales.length;
  const ticketMedioToday = todayClients > 0 ? todayTotal / todayClients : 0;
  
  const progress = meta > 0 ? (monthTotal / meta) * 100 : 0;
  const remaining = Math.max(0, meta - monthTotal);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-100 flex items-center">
        <div className="bg-red-50 p-3 rounded-2xl mr-4 text-red-600">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Venda Hoje</p>
          <p className="text-xl font-black text-slate-900">{formatCurrency(todayTotal)}</p>
          <p className="text-[9px] text-red-500 font-black uppercase mt-1">{todayClients} pedidos</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-100 flex items-center">
        <div className="bg-amber-50 p-3 rounded-2xl mr-4 text-amber-600">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Ticket Médio</p>
          <p className="text-xl font-black text-slate-900">{formatCurrency(ticketMedioToday)}</p>
          <p className="text-[9px] text-amber-500 font-black uppercase mt-1">Média p/ pedido</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-100 col-span-1 md:col-span-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-emerald-500" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Meta Mensal</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black text-slate-400">R$</span>
            <input 
              type="number" 
              value={meta}
              onChange={(e) => onMetaChange(Number(e.target.value))}
              className="w-24 text-right font-black text-slate-900 bg-slate-50 border-none rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        
        <div className="flex items-end justify-between mb-2">
          <span className="text-2xl font-black text-slate-900 tracking-tighter">{progress.toFixed(1)}%</span>
          <span className="text-[9px] font-black text-slate-400 uppercase">Faltam {formatCurrency(remaining)}</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : 'bg-red-600'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};