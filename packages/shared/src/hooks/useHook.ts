import { useState } from 'react';

// Exemplo de hook
export const useHook1 = () => {
  const [count, setCount] = useState(0);
  return { count, setCount };
};
