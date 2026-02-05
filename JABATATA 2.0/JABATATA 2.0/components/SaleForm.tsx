import React, { useState, useMemo, useEffect } from 'react';
import { ConsumptionType, PaymentMethod, Sale, SaleItem, Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import { Plus, Minus, ShoppingCart, User, CreditCard, Home, Calendar, Search, CheckCircle2 } from 'lucide-react';
import { formatCurrency, getTodayISO } from '../utils';

interface SaleFormProps {
  onAddSale: (sale: Sale) => void;
  existingSales: Sale[];
  customProducts: Product[];
  editingSale?: Sale | null;
  onCancelEdit?: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({ 
  onAddSale, 
  existingSales, 
  customProducts, 
  editingSale,
  onCancelEdit
}) => {
  const [customerName, setCustomerName] = useState('');
  const [saleDate, setSaleDate] = useState(getTodayISO());
  const [consumptionType, setConsumptionType] = useState<ConsumptionType>(ConsumptionType.LOCAL);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.DINHEIRO);
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const allProducts = useMemo(() => [...INITIAL_PRODUCTS, ...customProducts], [customProducts]);

  useEffect(() => {
    if (editingSale) {
      setCustomerName(editingSale.customerName === 'Consumidor' ? '' : editingSale.customerName);
      setSaleDate(editingSale.date.split('T')[0]);
      setConsumptionType(editingSale.consumptionType);
      setPaymentMethod(editingSale.paymentMethod);
      setSelectedItems(editingSale.items);
    }
  }, [editingSale]);

  const filteredProducts = useMemo(() => 
    allProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [searchTerm, allProducts]);

  const handleAddItem = (product: Product) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, quantity: 1, unitPrice: product.price }];
    });
  };

  const handleUpdateQuantity = (productId: string, val: number) => {
    setSelectedItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity: Math.max(0, val) } : item).filter(item => item.quantity > 0));
  };

  const totalValue = selectedItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    const now = new Date();
    const [y, m, d] = saleDate.split('-').map(Number);
    const finalDate = new Date(y, m-1, d, now.getHours(), now.getMinutes(), now.getSeconds());
    onAddSale({
      id: editingSale ? editingSale.id : crypto.randomUUID(),
      customerName: customerName.trim() || 'Consumidor',
      date: finalDate.toISOString(),
      consumptionType,
      paymentMethod,
      items: selectedItems,
      totalValue,
    });
    if (!editingSale) {
      setCustomerName('');
      setSelectedItems([]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Cardápio</h3>
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar item..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-red-600 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.map(p => (
            <button key={p.id} type="button" onClick={() => handleAddItem(p)} className="flex flex-col text-left p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-red-600 hover:shadow-md transition-all active:scale-95 group">
              <span className="text-[10px] font-black text-slate-900 uppercase leading-none mb-2">{p.name}</span>
              <span className="text-sm font-black text-red-600">{formatCurrency(p.price)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
           <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <ShoppingCart size={18} className="text-red-500" />
              <h3 className="font-black text-[10px] uppercase tracking-widest">Itens do Pedido</h3>
           </div>

           <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar mb-6">
              {selectedItems.length === 0 ? (
                <p className="text-center py-8 text-white/30 font-black uppercase text-[10px]">Carrinho Vazio</p>
              ) : (
                selectedItems.map(item => {
                  const product = allProducts.find(p => p.id === item.productId);
                  return (
                    <div key={item.productId} className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                       <div className="flex-1 mr-4">
                          <p className="text-[10px] font-black uppercase truncate">{product?.name}</p>
                          <p className="text-[10px] text-white/50">{formatCurrency(item.unitPrice * item.quantity)}</p>
                       </div>
                       <div className="flex items-center gap-3">
                          <button type="button" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all"><Minus size={14}/></button>
                          <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all"><Plus size={14}/></button>
                       </div>
                    </div>
                  );
                })
              )}
           </div>

           <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase">Cliente</label>
                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Avulso" className="w-full bg-white/10 border-none rounded-lg px-3 py-2 text-xs font-black outline-none focus:ring-1 focus:ring-red-500"/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase">Tipo</label>
                    <select value={consumptionType} onChange={e => setConsumptionType(e.target.value as any)} className="w-full bg-white/10 border-none rounded-lg px-3 py-2 text-xs font-black outline-none">
                       {Object.values(ConsumptionType).map(t => <option key={t} value={t} className="text-slate-900">{t}</option>)}
                    </select>
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-[9px] font-black text-white/40 uppercase">Pagamento</label>
                 <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} className="w-full bg-white/10 border-none rounded-lg px-3 py-2 text-xs font-black outline-none">
                    {Object.values(PaymentMethod).map(m => <option key={m} value={m} className="text-slate-900">{m}</option>)}
                 </select>
              </div>

              <div className="flex items-center justify-between py-4">
                 <span className="text-white/40 font-black text-[10px] uppercase">Total</span>
                 <span className="text-3xl font-black text-white tracking-tighter">{formatCurrency(totalValue)}</span>
              </div>

              <button type="submit" disabled={selectedItems.length === 0} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-30 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95">
                 <CheckCircle2 size={18} /> {editingSale ? 'ATUALIZAR' : 'FECHAR VENDA'}
              </button>
              {editingSale && (
                <button type="button" onClick={onCancelEdit} className="w-full bg-white/10 text-white/50 py-3 rounded-xl font-black uppercase text-[10px]">Cancelar Edição</button>
              )}
           </form>
        </div>
      </div>
    </div>
  );
};