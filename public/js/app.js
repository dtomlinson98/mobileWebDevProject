if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/public/sw.js")
      .then((reg) => {
        console.log(`Service Worker Registration (Scope: ${reg.scope})`);
      })
      .catch((error) => {
        console.log(`Service Worker Error (${error})`);
      });
  });
} else {
  console.log("Service Worker not available");
}
