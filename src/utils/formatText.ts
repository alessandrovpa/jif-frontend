/* eslint-disable no-param-reassign */
export default function formatText(
  mascara: string,
  document: HTMLInputElement,
): void {
  const i = document.value.length;
  const saida = mascara.substring(0, 1);
  const text = mascara.substring(i);

  if (text.substring(0, 1) !== saida) {
    document.value += text.substring(0, 1);
  }
}
