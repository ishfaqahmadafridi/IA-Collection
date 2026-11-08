import { useEffect, useRef, type ReactNode } from 'react';
export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    element?.showModal();
    return () => { element?.close(); };
  }, []);
  return <dialog ref={ref} aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }} className="w-[calc(100%_-_2rem)] max-w-2xl max-h-[90vh] p-0 rounded-xl bg-white text-gray-900 backdrop:bg-black/60">
    {children}
  </dialog>;
}
