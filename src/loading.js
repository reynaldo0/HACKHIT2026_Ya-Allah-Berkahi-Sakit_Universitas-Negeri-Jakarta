(function () {
  function injectStyles() {
    if (document.getElementById("loading-native-styles")) return;

    const style = document.createElement("style");
    style.id = "loading-native-styles";
    style.textContent = `
      @keyframes fadeOut { to { opacity: 0; transform: scale(1.02); } }
      @keyframes blurFade { from { backdrop-filter: blur(0); } to { backdrop-filter: blur(18px); } }
      @keyframes textAppear { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes bubbleUp { to { transform: translateY(-120vh); } }
      @keyframes bubbleDown { to { transform: translateY(120vh); } }

      #loading-screen {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #0A0F12;
        overflow: hidden;
        animation: blurFade 8s forwards;
      }

      #loading-screen video {
        width: 240px;
        height: 240px;
        object-fit: contain;
        z-index: 2;
      }

      #loading-screen .text {
        margin-top: 14px;
        font-size: 18px;
        font-weight: 700;
        color: #ffff;
        opacity: 0;
        animation: textAppear 2.5s forwards;
        z-index: 2;
      }

      #loading-screen .bubble {
        position: absolute;
        border-radius: 9999px;
        background: rgba(99,102,241,0.25);
        opacity: 0.55;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function createOverlay(videoSrc) {
    const overlay = document.createElement("div");
    overlay.id = "loading-screen";

    const video = document.createElement("video");
    video.src = videoSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = "Memuat konten...";

    overlay.appendChild(video);
    overlay.appendChild(text);

    return overlay;
  }

  function createBubbles(overlay, count) {
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "bubble";

      const size = rand(10, 40);
      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${rand(0, 100)}%`;

      const up = i % 2 === 0;
      if (up) b.style.bottom = `-${rand(10, 60)}px`;
      else b.style.top = `-${rand(10, 60)}px`;

      b.style.animation = `${up ? "bubbleUp" : "bubbleDown"} ${rand(4, 7)}s linear infinite`;
      b.style.animationDelay = `${rand(0, 2)}s`;

      overlay.appendChild(b);
    }
  }

  function removeOverlay(overlay, onLoaded) {
    overlay.style.animation = "fadeOut 1.8s forwards";
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
      if (typeof onLoaded === "function") onLoaded();
    }, 1800);
  }

  function waitForLoad() {
    return new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", resolve, { once: true });
    });
  }

  window.initLoadingScreen = async function ({
    videoSrc,
    bubbles = 15,
    minDuration = 1000,
    maxDuration = 2000,
    onLoaded,
  }) {
    injectStyles();

    const overlay = createOverlay(videoSrc);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    createBubbles(overlay, bubbles);

    const hold = rand(minDuration, maxDuration);
    const start = Date.now();

    await waitForLoad();

    const remain = Math.max(0, hold - (Date.now() - start));
    setTimeout(() => removeOverlay(overlay, onLoaded), remain);
  };
})();
