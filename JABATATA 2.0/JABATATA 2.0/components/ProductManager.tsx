import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Trash2, Package, Download, Upload, Lock, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils';

interface ProductManagerProps {
  products: Product[];
  isAdmin: boolean;
  onAddProduct: (p: Product) => void;
  onRemoveProduct: (id: string) => void;
  onAdminAuth: (status: boolean) => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ 
  products, 
  isAdmin,
  onAddProduct, 
  onRemoveProduct,
  onAdminAuth,
  onExportBackup,
  onImportBackup
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !name || !price) return;
    onAddProduct({ id: `custom-${Date.now()}`, name: name.toUpperCase(), price: Number(price) });
    setName('');
    setPrice('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
      <div className="space-y-4">
        {!isAdmin ? (
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl text-center">
            <Lock size={32} className="mx-auto mb-4 text-red-500" />
            <h4 className="font-black uppercase text-xs mb-6 tracking-widest">Acesso do Administrador</h4>
            <input 
              type="password" 
              value={pass} 
              onChange={e => {
                setPass(e.target.value);
                if(e.target.value === '1234') onAdminAuth(true);
              }}
              placeholder="Senha"
              className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-center text-lg font-black outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-slate-100">
             <h4 className="font-black uppercase text-[10px] text-slate-400 mb-6 tracking-widest flex items-center gap-2">
                <Plus size={16} className="text-red-500"/> Adicionar ao Menu
             </h4>
             <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome do Item" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-black outline-none focus:ring-1 focus:ring-red-500"/>
                <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0,00" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-black outline-none focus:ring-1 focus:ring-red-500"/>
                <button type="submit" className="w-full bg-red-600 text-white font-black py-4 rounded-xl text-xs uppercase shadow-md active:scale-95 transition-all">Salvar Item</button>
             </form>
          </div>
        )}

        <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl">
           <h4 className="font-black uppercase text-[10px] text-emerald-100 mb-6 tracking-widest flex items-center gap-2">
              <ShieldCheck size={16}/> Backups
           </h4>
           <div className="space-y-3">
              <button onClick={onExportBackup} className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all">
                 <Download size={14}/> Baixar Vendas
              </button>
              <label className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all cursor-pointer">
                 <Upload size={14}/> Restaurar Dados
                 <input type="file" onChange={onImportBackup} className="hidden" />
              </label>
           </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl border-2 border-slate-100 overflow-hidden flex flex-col h-full min-h-[400px]">
        <div className="px-6 py-4 bg-slate-900 flex justify-between items-center">
          <h3 className="font-black text-white uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Package size={16} className="text-red-500"/> Menu Atual ({products.length})
          </h3>
        </div>
        <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 text-slate-400 uppercase text-[9px] font-black z-10 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4 text-right">Preço</th>
                {isAdmin && <th className="px-6 py-4 text-center">Ação</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-black uppercase text-xs text-slate-800">{p.name}</td>
                  <td className="px-6 py-4 text-right font-black text-red-600">{formatCurrency(p.price)}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => onRemoveProduct(p.id)} className="text-slate-300 hover:text-red-600 transition-all p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};