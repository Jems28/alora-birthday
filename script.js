/**
 * ALORA'S FIRST BIRTHDAY — DIGITAL INVITATION SCRIPT
 * Vanilla JavaScript (No backend, no database, 100% static & Vercel-ready)
 */

// ==========================================================================
// KONFIGURASI WHATSAPP TUAN RUMAH
// ==========================================================================
// GANTI DENGAN NOMOR WHATSAPP KAMU (Contoh: "6281234567890")
// Jangan gunakan tanda +, spasi atau tanda -
const WHATSAPP_NUMBER = "6285885697786"; 

// ==========================================================================
// TARGET TANGGAL & WAKTU ACARA (WIB / UTC+7)
// 24 Oktober 2026, 15:00:00 WIB
// ==========================================================================
const EVENT_TIMESTAMP = new Date("2026-10-24T15:00:00+07:00").getTime();

// List of all 8 photos in strict chronological order
const ALORA_PHOTOS = [
  { src: "./assets/alora-01.jpg", title: "Foto 01: Hari Pertama di Dunia (RS Pasutri)" },
  { src: "./assets/alora-02.jpg", title: "Foto 02: Mungil dalam Dekapan Hangat" },
  { src: "./assets/alora-03.jpg", title: "Foto 03: Pita Kecil Merah Muda Kesayangan" },
  { src: "./assets/alora-04.jpg", title: "Foto 04: Tatapan Bening Penuh Cinta" },
  { src: "./assets/alora-05.jpg", title: "Foto 05: Senyum Sederhana Kebahagiaan Terbesar" },
  { src: "./assets/alora-06.jpg", title: "Foto 06: Ekspresi Tertawa Paling Menggemaskan!" },
  { src: "./assets/alora-07.jpg", title: "Foto 07: Kuncir Dua Favorit Mama" },
  { src: "./assets/alora-08.jpg", title: "Foto 08: Satu Tahun Penuh Berkah & Tawa" }
];

let currentLightboxIndex = 0;
let isMusicPlaying = false;
let unicornClickCount = 0;
let unicornResetTimer = null;

// ==========================================================================
// 1. GUEST PERSONALIZATION VIA URL QUERY PARAMETER (?to=Nama)
// ==========================================================================
function getPersonalizedGuestName() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to') || urlParams.get('name');
    
    if (toParam && toParam.trim().length > 0) {
      const cleanName = decodeURIComponent(toParam.trim());
      return cleanName.replace(/[<>]/g, '');
    }
  } catch (e) {
    console.error("Error parsing URL parameters:", e);
  }
  return null;
}

function applyGuestPersonalization() {
  const guestRaw = getPersonalizedGuestName();
  const guestUpper = guestRaw ? guestRaw.toUpperCase() : "DEAR GUEST";
  const guestTitle = guestRaw ? guestRaw : "Sahabat & Keluarga";
  
  // 1. Cover
  const coverGuestEl = document.getElementById('cover-guest-name');
  if (coverGuestEl) {
    coverGuestEl.textContent = `HELLO, ${guestUpper}`;
  }
  
  // 2. Scene 1 Pembuka
  document.querySelectorAll('.guest-name-insert').forEach(el => {
    el.textContent = guestTitle;
  });
  
  // 3. Scene 12 RSVP
  const rsvpGuestEl = document.getElementById('rsvp-guest-name');
  if (rsvpGuestEl) {
    rsvpGuestEl.textContent = guestUpper;
  }
  
  // 4. Scene 13 Penutup
  const closingGuestEl = document.querySelector('.guest-name-closing');
  if (closingGuestEl) {
    closingGuestEl.textContent = guestUpper;
  }
}

// ==========================================================================
// 2. AUDIO PLAYBACK MANAGEMENT
// ==========================================================================
const audioEl = document.getElementById('birthday-audio');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const musicStatusText = document.getElementById('music-status-text');

function startAudio() {
  if (!audioEl) return;
  
  audioEl.play()
    .then(() => {
      isMusicPlaying = true;
      if (musicToggleBtn) {
        musicToggleBtn.classList.remove('hidden');
        musicToggleBtn.classList.add('playing');
      }
      if (musicStatusText) {
        musicStatusText.textContent = "Musik On";
      }
    })
    .catch((err) => {
      console.warn("Audio autoplay blocked by browser policy, user can toggle manually:", err);
      if (musicToggleBtn) {
        musicToggleBtn.classList.remove('hidden');
        musicToggleBtn.classList.remove('playing');
      }
      if (musicStatusText) {
        musicStatusText.textContent = "Musik Off";
      }
      isMusicPlaying = false;
    });
}

function toggleAudio() {
  if (!audioEl) return;
  
  if (isMusicPlaying) {
    audioEl.pause();
    isMusicPlaying = false;
    if (musicToggleBtn) musicToggleBtn.classList.remove('playing');
    if (musicStatusText) musicStatusText.textContent = "Musik Off";
  } else {
    audioEl.play()
      .then(() => {
        isMusicPlaying = true;
        if (musicToggleBtn) musicToggleBtn.classList.add('playing');
        if (musicStatusText) musicStatusText.textContent = "Musik On";
      })
      .catch((err) => {
        console.warn("Unable to play audio:", err);
      });
  }
}

// ==========================================================================
// 3. COVER ANIMATION & OPENING EXPERIENCE
// ==========================================================================
function setupCoverInteraction() {
  const openBtn = document.getElementById('open-invitation-btn');
  const coverScreen = document.getElementById('cover-screen');
  const invitationContent = document.getElementById('invitation-content');
  const floatingTopBtn = document.getElementById('floating-top-btn');

  if (!openBtn || !coverScreen || !invitationContent) return;

  openBtn.addEventListener('click', () => {
    // 1. Start Audio Loop
    startAudio();

    // 2. Playful burst effect
    spawnCelebrationHearts(openBtn);

    // 3. Animate cover opening
    coverScreen.classList.add('opened');

    // 4. Reveal Main Content
    setTimeout(() => {
      invitationContent.classList.remove('hidden');
      if (floatingTopBtn) {
        floatingTopBtn.classList.remove('hidden');
      }

      // Smooth scroll into scene 1
      const scene1 = document.getElementById('scene-1');
      if (scene1) {
        scene1.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);

    setTimeout(() => {
      coverScreen.style.display = 'none';
    }, 1250);
  });
}

// ==========================================================================
// 4. REALTIME COUNTDOWN (24 Oktober 2026, 15:00 WIB)
// ==========================================================================
function updateCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const celebrationBanner = document.getElementById('countdown-celebration-banner');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date().getTime();
  const distance = EVENT_TIMESTAMP - now;

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    
    if (celebrationBanner) celebrationBanner.classList.remove('hidden');
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

// ==========================================================================
// 5. SCENE 7 INTERACTIVE DIE-CUT STICKER
// ==========================================================================
function setupInteractiveSticker() {
  const sticker = document.getElementById('interactive-alora-sticker');
  if (!sticker) return;

  sticker.addEventListener('click', (e) => {
    sticker.classList.remove('bounce-active');
    void sticker.offsetWidth;
    sticker.classList.add('bounce-active');

    spawnTapHearts(e.clientX, e.clientY);
  });
}

function spawnTapHearts(x, y) {
  const emojis = ['🩷', '✨', '🌸', '💖', '🥰', '🦄'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.position = 'fixed';
    el.style.left = `${x || window.innerWidth / 2}px`;
    el.style.top = `${y || window.innerHeight / 2}px`;
    el.style.fontSize = `${1.2 + Math.random() * 0.8}rem`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.transform = `translate(${(Math.random() - 0.5) * 120}px, ${(Math.random() - 0.5) * 120}px) scale(1.3)`;
    el.style.opacity = '1';

    document.body.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform += ' translateY(-30px) scale(0.6)';
    }, 50);

    setTimeout(() => {
      el.remove();
    }, 1000);
  }
}

function spawnCelebrationHearts(targetEl) {
  const rect = targetEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  spawnTapHearts(centerX, centerY);
}

// ==========================================================================
// 6. UNICORN MASCOT INTERACTION & EASTER EGG (3 Clicks)
// ==========================================================================
function setupUnicornEasterEgg() {
  const modal = document.getElementById('easter-egg-modal');
  const closeBtn = document.getElementById('close-easter-egg-btn');
  const unicornElements = document.querySelectorAll('.unicorn-interactive');

  unicornElements.forEach(unicorn => {
    unicorn.addEventListener('click', (e) => {
      unicornClickCount++;

      unicorn.style.transform = 'scale(1.15)';
      setTimeout(() => {
        unicorn.style.transform = '';
      }, 200);

      spawnTapHearts(e.clientX, e.clientY);

      clearTimeout(unicornResetTimer);
      unicornResetTimer = setTimeout(() => {
        unicornClickCount = 0;
      }, 3500);

      if (unicornClickCount >= 3) {
        unicornClickCount = 0;
        if (modal) {
          modal.classList.remove('hidden');
          spawnTapHearts(window.innerWidth / 2, window.innerHeight / 2);
        }
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  const backdrop = document.querySelector('.easter-egg-backdrop');
  if (backdrop && modal) {
    backdrop.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
}

// ==========================================================================
// 7. FULLSCREEN PHOTO LIGHTBOX
// ==========================================================================
function setupPhotoLightbox() {
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const backdrop = document.getElementById('lightbox-backdrop');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  if (!lightbox || !lightboxImg) return;

  function showPhoto(index) {
    if (index < 0) index = ALORA_PHOTOS.length - 1;
    if (index >= ALORA_PHOTOS.length) index = 0;
    currentLightboxIndex = index;

    const photo = ALORA_PHOTOS[currentLightboxIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.title;
    if (lightboxCaption) lightboxCaption.textContent = photo.title;
    if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${ALORA_PHOTOS.length}`;
  }

  function openLightbox(index) {
    showPhoto(index);
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-lightbox-trigger').forEach(imgEl => {
    imgEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(imgEl.getAttribute('data-photo-index') || '0', 10);
      openLightbox(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentLightboxIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentLightboxIndex + 1);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentLightboxIndex + 1);
  });
}

// ==========================================================================
// 8. RSVP WHATSAPP HANDLERS
// ==========================================================================
function setupRSVPActions() {
  const yesBtn = document.getElementById('rsvp-yes-btn');
  const noBtn = document.getElementById('rsvp-no-btn');

  const guestRaw = getPersonalizedGuestName();
  const guestName = guestRaw ? guestRaw : "Sahabat/Keluarga";

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      const message = `Halo, saya ${guestName}! 🩷\n\nSaya mengonfirmasi akan hadir di acara ulang tahun pertama Alora Hazelika Aderyn.\n\nSabtu, 24 Oktober 2026\nPukul 15.00 WIB\nRumah Yoya\n\nSampai jumpa! 🎂🦄`;
      sendWhatsApp(message);
    });
  }

  if (noBtn) {
    noBtn.addEventListener('click', () => {
      const message = `Halo, saya ${guestName}.\n\nMohon maaf, saya belum bisa hadir di acara ulang tahun pertama Alora.\n\nSemoga Alora selalu sehat, bahagia dan tumbuh penuh cinta. 🩷`;
      sendWhatsApp(message);
    });
  }
}

function sendWhatsApp(textMessage) {
  let targetNumber = WHATSAPP_NUMBER;

  if (targetNumber === "628xxxxxxxxxx") {
    console.info("Catatan: Silakan ganti WHATSAPP_NUMBER di script.js dengan nomor WhatsApp kamu.");
    targetNumber = "";
  }

  const encodedMessage = encodeURIComponent(textMessage);
  let waUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
  if (targetNumber && targetNumber.length > 5) {
    waUrl = `https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodedMessage}`;
  }

  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

// ==========================================================================
// 9. COPY ADDRESS TO CLIPBOARD
// ==========================================================================
function setupAddressCopy() {
  const copyBtn = document.getElementById('copy-address-btn');
  const copyLabel = document.getElementById('copy-address-label');
  const copyIcon = document.getElementById('copy-address-icon');

  if (!copyBtn || !copyLabel) return;

  const fullAddress = "Rumah Yoya, Kp. Babakan Kemang, RT 01/04, Desa Cihideung Udik, Kab. Bogor, Indonesia (Koordinat: -6.565740, 106.711698)";

  copyBtn.addEventListener('click', () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullAddress)
        .then(() => {
          copyLabel.textContent = "Alamat Berhasil Disalin! ✓";
          if (copyIcon) copyIcon.textContent = "✅";
          copyBtn.style.borderColor = "#4CAF50";
          copyBtn.style.color = "#2E7D32";

          setTimeout(() => {
            copyLabel.textContent = "Salin Alamat Lengkap";
            if (copyIcon) copyIcon.textContent = "📋";
            copyBtn.style.borderColor = "";
            copyBtn.style.color = "";
          }, 2500);
        })
        .catch(() => {
          fallbackCopyText(fullAddress, copyLabel);
        });
    } else {
      fallbackCopyText(fullAddress, copyLabel);
    }
  });
}

function fallbackCopyText(text, labelEl) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    labelEl.textContent = "Alamat Berhasil Disalin! ✓";
    setTimeout(() => {
      labelEl.textContent = "Salin Alamat Lengkap";
    }, 2500);
  } catch (err) {
    labelEl.textContent = "Gagal menyalin otomatis";
  }
}

// ==========================================================================
// 10. BACK TO TOP BUTTONS
// ==========================================================================
function setupBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const floatingTopBtn = document.getElementById('floating-top-btn');

  const scrollToTop = () => {
    const scene1 = document.getElementById('scene-1');
    if (scene1) {
      scene1.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (backToTopBtn) backToTopBtn.addEventListener('click', scrollToTop);
  if (floatingTopBtn) floatingTopBtn.addEventListener('click', scrollToTop);

  window.addEventListener('scroll', () => {
    if (!floatingTopBtn) return;
    if (window.scrollY > 400) {
      floatingTopBtn.classList.remove('hidden');
    } else {
      floatingTopBtn.classList.add('hidden');
    }
  }, { passive: true });
}

// ==========================================================================
// 11. LOADING SCREEN DISMISSAL
// ==========================================================================
function dismissLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.remove();
    }, 600);
  }, 700);
}

// ==========================================================================
// 12. INITIALIZATION ON DOM CONTENT LOADED
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  applyGuestPersonalization();
  setupCoverInteraction();
  setupInteractiveSticker();
  setupUnicornEasterEgg();
  setupPhotoLightbox();
  setupRSVPActions();
  setupAddressCopy();
  setupBackToTop();

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleAudio);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  dismissLoadingScreen();
});

window.addEventListener('load', () => {
  dismissLoadingScreen();
});