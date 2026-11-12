import { useLayoutEffect, useRef } from 'react';
import type { ModalProps } from '../../types/components/modal';
export default function Modal({ title, onClose, children, wide = false }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    const previousFocus = document.activeElement;
    element?.showModal();
    return () => {
      element?.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);
  return <dialog ref={ref} aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }} className={`m-auto w-[calc(100%_-_2rem)] ${wide ? 'max-w-5xl' : 'max-w-2xl'} max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl backdrop:bg-black/70`}>
    {children}
  </dialog>;
}
