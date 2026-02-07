// window.initLoadingScreen({
//   videoSrc: "assets/video/loading.mp4",
//   minDuration: 1000,
//   maxDuration: 2000,
//   onLoaded: () => {
//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         AOS.init({
//           once: true,
//           duration: 900,
//           easing: "ease-out-cubic",
//           offset: 10,
//           disableMutationObserver: true,
//         });
//         AOS.refreshHard();
//       });
//     });
//   },
// });

AOS.init();
const overlay = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("modalClose");
const okBtn = document.getElementById("modalOk");
const titleEl = document.getElementById("modalTitle");
const descEl = document.getElementById("modalDesc");

const iframe = document.getElementById("modalVideoFrame");
const video = document.getElementById("modalVideoTag");
const source = document.getElementById("modalVideoSource");
const videoWrap = document.getElementById("modalVideoWrap");

const buttons = document.querySelectorAll(".detail-btn");

const isYouTube = (url) =>
  /youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=/.test(url);

const toYouTubeEmbed = (url) => {
  if (url.includes("youtube.com/embed/")) return url;
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("watch?v=")) {
    const id = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
};

function openModal({ title, desc, videoUrl }) {
  titleEl.textContent = title || "Detail";
  descEl.textContent = desc || "";

  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (!videoUrl) {
    videoWrap.classList.add("hidden");
    iframe.src = "";
    source.src = "";
    video.load();
    return;
  }

  videoWrap.classList.remove("hidden");

  if (isYouTube(videoUrl)) {
    iframe.classList.remove("hidden");
    video.classList.add("hidden");
    iframe.src = toYouTubeEmbed(videoUrl) + "?autoplay=1&mute=1";
  } else {
    iframe.classList.add("hidden");
    video.classList.remove("hidden");
    iframe.src = "";
    source.src = videoUrl;
    video.load();
    video.play().catch(() => {});
  }

  closeBtn.focus();
}

function stopVideo() {
  iframe.src = "";
  video.pause();
  source.src = "";
  video.load();
}

function closeModal() {
  stopVideo();
  overlay.classList.add("hidden");
  overlay.classList.remove("flex");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    openModal({
      title: btn.dataset.title,
      desc: btn.dataset.desc,
      videoUrl: btn.dataset.video,
    });
  });
});

closeBtn.addEventListener("click", closeModal);
okBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.classList.contains("hidden")) closeModal();
});

document.getElementById("menu-toggle").addEventListener("click", function () {
  document.getElementById("mobile-menu").classList.toggle("hidden");
});

var ufoMarquee = document.getElementById("ufo-marquee");
var ufoMarquee2 = document.getElementById("ufo-marquee-2");
window.addEventListener("scroll", function () {
  var scrollY = window.scrollY || window.pageYOffset;
  var speed = window.innerWidth < 640 ? 0.3 : 0.5;
  ufoMarquee.style.transform = "translateX(" + -(scrollY * speed) + "px)";
  ufoMarquee2.style.transform =
    "translateX(" + (scrollY * speed - 1500) + "px)";
});
