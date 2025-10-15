import { useCallback, useState } from "react";

export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((s) => !s), []);

  return { isOpen, open, close, toggle } as const;
}

export default useModal;
