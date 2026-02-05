import React, { useState, useEffect } from 'react';
import { Sale, Product } from './types';
import { Dashboard } from './components/Dashboard';
import { SaleForm } from './components/SaleForm';
import { ProductSummary } from './components/ProductSummary';
import { ProductManager } from './components/ProductManager';
import { formatCurrency } from './utils';
import { History, FileDown, Lock, Unlock, Package, Zap } from 'lucide-react';
import { MONTHLY_META_DEFAULT, INITIAL_PRODUCTS } from './constants';

const SALES_KEY = 'jabatata_v3_sales';
const META_KEY = 'jabatata_v3_meta';
const PRODUCTS_KEY = 'jabatata_v3_products';

const App: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [meta, setMeta] = useState(MONTHLY_META_DEFAULT);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'nova' | 'historico' | 'resumo' | 'produtos'>('nova');
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  useEffect(() => {
    const savedSales = localStorage.getItem(SALES_KEY);
    const savedMeta = localStorage.getItem(META_KEY);
    const savedProducts = localStorage.getItem(PRODUCTS_KEY);
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedMeta) setMeta(Number(savedMeta));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  useEffect(() => {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    localStorage.setItem(META_KEY, meta.toString());
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [sales, meta, products]);

  const handleAddSale = (newSale: Sale) => {
    setSales(prev => {
      const filtered = prev.filter(s => s.id !== newSale.id);
      return [newSale, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    setEditingSale(null);
    if (editingSale) setActiveTab('historico');
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0 bg-slate-50">
      <header className="bg-white border-b-4 border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-red-600 rounded-xl shadow-lg border-2 border-white">
              <span className="text-white font-black text-xl italic">JB</span>
            </div>
            <div>
              <h1 className="font-black text-red-600 tracking-tighter leading-none uppercase text-2xl italic">JABATATA</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Gestão Profissional</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-xl">
            {['nova', 'historico', 'resumo', 'produtos'].map(tab => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab as any); setEditingSale(null); }}
                className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase transition-all ${activeTab === tab ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-white'}`}
              >
                {tab === 'nova' ? 'Caixa' : tab === 'historico' ? 'Vendas' : tab === 'resumo' ? 'Ranking' : 'Menu'}
              </button>
            ))}
          </div>

          <button 
            onClick={() => isAdmin && setIsAdmin(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${isAdmin ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-300'}`}
          >
             {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
             <span className="text-[10px] font-black uppercase tracking-widest">{isAdmin ? 'ADMIN' : 'SISTEMA'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Dashboard sales={sales} meta={meta} onMetaChange={setMeta} />

        {activeTab === 'nova' && (
          <SaleForm 
            onAddSale={handleAddSale} 
            existingSales={sales} 
            customProducts={products}
            editingSale={editingSale}
            onCancelEdit={() => { setEditingSale(null); setActiveTab('historico'); }}
          />
        )}

        {activeTab === 'historico' && (
          <div className="bg-white rounded-[2rem] shadow-xl border-2 border-slate-100 overflow-hidden">
             <div className="px-6 py-4 border-b-2 border-slate-50 bg-slate-50 flex justify-between items-center">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Últimos Pedidos</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase">{sales.length} registros</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white text-slate-400 uppercase text-[10px] font-black border-b-2 border-slate-50">
                    <tr>
                      <th className="px-6 py-4 tracking-widest">Hora/Data</th>
                      <th className="px-6 py-4 tracking-widest">Cliente</th>
                      <th className="px-6 py-4 text-right tracking-widest">Total</th>
                      <th className="px-6 py-4 text-center tracking-widest">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sales.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-300 font-black uppercase text-xs">Sem vendas ainda.</td></tr>
                    ) : (
                      sales.map(sale => (
                        <tr key={sale.id} className="hover:bg-slate-50 transition-all">
                          <td className="px-6 py-4">
                            <span className="block text-slate-900 font-black">{new Date(sale.date).toLocaleDateString('pt-BR')}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>
                          <td className="px-6 py-4 font-black uppercase text-xs text-slate-600">{sale.customerName}</td>
                          <td className="px-6 py-4 text-right font-black text-slate-900">{formatCurrency(sale.totalValue)}</td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => { setEditingSale(sale); setActiveTab('nova'); }} 
                              className="bg-slate-100 text-slate-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'resumo' && <ProductSummary sales={sales} customProducts={products} />}

        {activeTab === 'produtos' && (
          <ProductManager 
            products={products}
            isAdmin={isAdmin}
            onAddProduct={p => setProducts(prev => [...prev.filter(i => i.id !== p.id), p])}
            onRemoveProduct={id => setProducts(prev => prev.filter(p => p.id !== id))}
            onAdminAuth={setIsAdmin}
            onExportBackup={() => {
              const data = JSON.stringify({ sales, products, meta });
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `jabatata_backup_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            onImportBackup={(e) => {
               const file = e.target.files?.[0];
               if (file) {
                 const reader = new FileReader();
                 reader.onload = (event) => {
                   const data = JSON.parse(event.target?.result as string);
                   if (data.sales) setSales(data.sales);
                   if (data.products) setProducts(data.products);
                   if (data.meta) setMeta(data.meta);
                 };
                 reader.readAsText(file);
               }
            }}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 md:hidden flex justify-around items-center px-4 py-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {[
          { id: 'nova', icon: <Zap size={20}/>, label: 'Caixa' },
          { id: 'historico', icon: <History size={20}/>, label: 'Fluxo' },
          { id: 'resumo', icon: <FileDown size={20}/>, label: 'Ranking' },
          { id: 'produtos', icon: <Package size={20}/>, label: 'Menu' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => { setActiveTab(item.id as any); setEditingSale(null); }} 
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-red-600 scale-110' : 'text-slate-300'}`}
          >
            {item.icon}
            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;