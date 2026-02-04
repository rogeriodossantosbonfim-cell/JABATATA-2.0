export enum ConsumptionType {
  LOCAL = 'Consumo no Local',
  RETIRAR = 'Retirar',
  ENTREGAR = 'Entregar'
}

export enum PaymentMethod {
  DINHEIRO = 'Dinheiro',
  DEBITO = 'Cartão Débito',
  CREDITO = 'Cartão Crédito',
  PIX = 'PIX'
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  customerName: string;
  date: string;
  consumptionType: ConsumptionType;
  paymentMethod: PaymentMethod;
  items: SaleItem[];
  totalValue: number;
}