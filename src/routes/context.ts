import { createContext } from 'svelte';

const [getTitleContext, setTitleContext] = createContext<string>();
export function getTitle(title?: string) {
  let baseTitle = 'Solo Hub';
  if (title) {
    baseTitle = `${title} - ${baseTitle}`;
  }
  setTitleContext(baseTitle);
  return getTitleContext();
}
