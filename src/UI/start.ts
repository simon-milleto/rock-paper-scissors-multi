import { initGame } from './../game';

export const init = () => {
  const appContainer = document.querySelector<HTMLElement>('#app')!;
  appContainer.style.display = 'none';
  
  const form = document.querySelector<HTMLFormElement>('#step-1 form')!;
  
  form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();
  
    initGame((form.elements.namedItem('name') as HTMLInputElement).value);
    document.querySelector<HTMLFormElement>('#step-1')!.style.display = 'none';

  });
  

}
