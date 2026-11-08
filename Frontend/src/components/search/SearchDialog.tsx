import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchDialogProps } from '../../types/components/search/searchInterface';
export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [isOpen]);
  return <dialog ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="search-heading" className="w-full max-w-xl p-6 rounded-xl bg-background text-foreground backdrop:bg-black/60">
    <div className="flex justify-between"><h2 id="search-heading" className="text-xl">Search products</h2><button type="button" onClick={onClose} aria-label="Close search">Close</button></div>
    <form className="mt-4 space-y-4" onSubmit={event => { event.preventDefault(); navigate(`/search?q=${encodeURIComponent(query.trim())}`); onClose(); }}>
      <label htmlFor="catalog-search">Product name or category</label>
      <input id="catalog-search" type="search" value={query} onChange={event => setQuery(event.target.value)} required className="w-full border p-3 rounded bg-background" />
      <button type="submit" className="bg-primary text-primary-foreground px-6 py-3 rounded">Search</button>
    </form>
  </dialog>;
}
