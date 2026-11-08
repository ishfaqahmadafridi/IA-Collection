import Modal from '../../layout/Modal';
import { useProductModalForm } from '../../../hooks/admin/useProductModalForm';
import type { ProductModalProps } from '../../../types/components/admin/productModal/productModalInterface';
import ModalHeader from './ModalHeader';
import ProductNameInput from './ProductNameInput';
import DescriptionInput from './DescriptionInput';
import PriceInputs from './PriceInputs';
import CategoryStockInputs from './CategoryStockInputs';
import HotProductCheckbox from './HotProductCheckbox';
import ModalActions from './ModalActions';

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { formData, setField, loading, error, handleSubmit } = useProductModalForm({ product, onClose });
  return (
    <Modal title={product ? "Edit product" : "Add product"} onClose={onClose}>
      <div className="bg-white rounded-xl w-full">
        <ModalHeader title={product ? 'Edit Product' : 'Add New Product'} onClose={onClose} />

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p role="alert">{error}</p>}
          <ProductNameInput
            value={formData.name}
            onChange={(name) => setField('name', name)}
          />
          <DescriptionInput
            value={formData.description}
            onChange={(description) => setField('description', description)}
          />
          <PriceInputs
            price={formData.price}
            originalPrice={formData.original_price}
            onPriceChange={(price) => setField('price', price)}
            onOriginalPriceChange={(original_price) => setField('original_price', original_price)}
          />
          <CategoryStockInputs
            category={formData.category}
            stock={formData.stock}
            image={formData.image}
            onCategoryChange={(category) => setField('category', category)}
            onStockChange={(stock) => setField('stock', stock)}
            onImageChange={(image) => setField('image', image)}
          />
          <HotProductCheckbox
            checked={formData.is_hot}
            onChange={(is_hot) => setField('is_hot', is_hot)}
          />
          <ModalActions
            loading={loading}
            isEditing={!!product}
            onCancel={onClose}
          />
        </form>
      </div>
    </Modal>
  );
}
