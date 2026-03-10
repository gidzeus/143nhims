const scrollButtons = document.querySelectorAll("[data-scroll]");

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const memories = [
  {
    image: "memories/1.JPG",
    title: "Đưa vợ đi đánh pick",
    caption: "Vợ toàn chê đánh ngu",
  },
  {
    image: "memories/2.JPG",
    title: "Chụp kỉ yếu có vợ nè hehe",
    caption: "Mới yêu nhìn cute hẻ :>",
  },
  {
    image: "memories/3.JPG",
    title: "Chụp ảnh cho vợ ở vườn hoa Mộc Châu",
    caption: "Cứ chê chụp ngu trong khi cha của đỉnh",
  },
  {
    image: "memories/4.JPG",
    title: "Nghịch Mèo",
    caption: "Nghiện rụ i",
  },
  {
    image: "memories/5.JPG",
    title: "Fit Checkk",
    caption: "Quá là đẹp đôi kk",
  },
  {
    image: "memories/6.JPG",
    title: "Tết qua nhà bố Cường checkin",
    caption: "Đang dỗi rồi cứ hất tay ra :>>",
  },
  {
    image: "memories/7.JPG",
    title: "Đi hang Táu lần 2 vì ảnh lần 1 FAILLL",
    caption: "Mệt lắm nhưng mà chở vợ nên vui hẳnn",
  },
  {
    image: "memories/8.JPG",
    title: "Suối Nàng Tiên nè ",
    caption: "Tí thì trượt chân bổ :))",
  },
  {
    image: "memories/9.JPG",
    title: "Vợ học bài",
    caption: "Mới quay lại nên tình cảm lắm :>>",
  },
];

const memoryGrid = document.querySelector("#memoryGrid");
if (memoryGrid) {
  const sortedMemories = [...memories].sort((left, right) => {
    const leftName = left.image.split("/").pop() || "";
    const rightName = right.image.split("/").pop() || "";
    return leftName.localeCompare(rightName, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  memoryGrid.innerHTML = sortedMemories
    .map((memory) => {
      const isVideo = /\.(mov|mp4|webm|ogg)$/i.test(memory.image);
      return `
        <article class="memory-card">
          <button
            class="memory-open"
            type="button"
            data-fullsrc="${memory.image}"
            data-alt="${memory.title}"
            data-mediatype="${isVideo ? "video" : "image"}"
            aria-label="Xem ảnh lớn: ${memory.title}"
          >
            <div class="memory-frame">
              ${
                isVideo
                  ? `<video class="memory-video" src="${memory.image}" poster="${memory.poster || ""}" muted playsinline preload="metadata"></video>`
                  : `<img src="${memory.image}" alt="${memory.title}" loading="lazy" />`
              }
            </div>
          </button>
          <div class="memory-meta">
            <h3>${memory.title}</h3>
            <p>${memory.caption}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.hidden = true;
lightbox.innerHTML = `
  <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Ảnh phóng to">
    <button type="button" class="lightbox-close" aria-label="Đóng">×</button>
    <img class="lightbox-image" src="" alt="" hidden />
    <video class="lightbox-video" controls playsinline hidden></video>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxVideo = lightbox.querySelector(".lightbox-video");
const lightboxCloseButton = lightbox.querySelector(".lightbox-close");

const closeLightbox = () => {
  if (lightboxVideo) {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
    lightboxVideo.hidden = true;
  }
  if (lightboxImage) {
    lightboxImage.hidden = true;
  }
  lightbox.hidden = true;
  document.body.classList.remove("modal-open");
};

const openLightbox = (source, altText, mediaType = "image") => {
  if (!lightboxImage || !lightboxVideo) return;
  const isVideo = mediaType === "video";

  if (isVideo) {
    lightboxImage.hidden = true;
    lightboxVideo.src = source;
    lightboxVideo.hidden = false;
    lightboxVideo.play().catch(() => {});
  } else {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
    lightboxVideo.hidden = true;
    lightboxImage.src = source;
    lightboxImage.alt = altText || "Memory photo";
    lightboxImage.hidden = false;
  }

  lightbox.hidden = false;
  document.body.classList.add("modal-open");
};

if (memoryGrid) {
  memoryGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest(".memory-open");
    if (!trigger) return;
    openLightbox(
      trigger.dataset.fullsrc || "",
      trigger.dataset.alt || "",
      trigger.dataset.mediatype || "image"
    );
  });
}

if (lightboxCloseButton) {
  lightboxCloseButton.addEventListener("click", closeLightbox);
}

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});

const attachWheelGame = ({ startButtonId, resultId, wheelId, finalMessage = "Kết quả: CÓ 💖" }) => {
  const gameStartButton = document.querySelector(startButtonId);
  const gameResult = document.querySelector(resultId);
  const loveWheel = document.querySelector(wheelId);

  if (!gameStartButton || !gameResult || !loveWheel) return;

  let wheelRotation = 0;
  let isSpinning = false;

  const setGameResult = (message, state) => {
    gameResult.textContent = message;
    gameResult.classList.remove("is-loading", "is-yes");
    if (state === "loading") {
      gameResult.classList.add("is-loading");
    }
    if (state === "yes") {
      gameResult.classList.add("is-yes");
    }
  };

  gameStartButton.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    gameStartButton.disabled = true;
    setGameResult("Đang quay...", "loading");

    const extraTurns = Math.floor(Math.random() * 3) + 6;
    wheelRotation += extraTurns * 360;
    loveWheel.classList.add("spinning");
    loveWheel.style.transform = `rotate(${wheelRotation}deg)`;

    window.setTimeout(() => {
      setGameResult(finalMessage, "yes");
      gameStartButton.disabled = false;
      loveWheel.classList.remove("spinning");
      isSpinning = false;
    }, 4200);
  });
};

attachWheelGame({
  startButtonId: "#gameStartBtn",
  resultId: "#gameResult",
  wheelId: "#loveWheel",
  finalMessage: "Kết quả: Rất là quý mến em 💖",
});

attachWheelGame({
  startButtonId: "#gameStartBtn2",
  resultId: "#gameResult2",
  wheelId: "#loveWheel2",
  finalMessage: "Tất nhiên là Không, anh chỉ có em thôi 🙂‍↔️",
});
