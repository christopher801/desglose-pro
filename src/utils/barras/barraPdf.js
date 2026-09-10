export function exportBarsToPdf() {
  if (typeof window === "undefined") {
    return;
  }

  window.print();
}