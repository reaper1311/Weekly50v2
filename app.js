async function subscribeToPush() {
  const reg = await navigator.serviceWorker.register("service-worker.js");
  await navigator.serviceWorker.ready;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: CONFIG.VAPID_PUBLIC_KEY
  });

  const res = await fetch(CONFIG.SERVER_URL + "/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub)
  });

  alert("Push enabled!");
}

document.getElementById("subscribeBtn").onclick = subscribeToPush;

document.getElementById("testPushBtn").onclick = async () => {
  await fetch(CONFIG.SERVER_URL + "/test", { method: "POST" });
  alert("Test push sent (if server running)");
};
