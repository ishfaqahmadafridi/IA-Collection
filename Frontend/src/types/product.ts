import type { ChangeEvent, FormEvent } from 'react';
import type { ApiProduct } from './api';
export interface ProductPurchaseProps {
  stock: number;
  quantity: number;
  added: boolean;
  onQuantityChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent) => void;
}
export interface ProductDetailContentProps extends Omit<ProductPurchaseProps, 'stock'> { product: ApiProduct }
