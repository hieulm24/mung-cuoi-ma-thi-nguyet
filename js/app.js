/**
 * Wedding Invitation Web App - Cô Dâu: Ma Thị Nguyệt
 * Interactive Features & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initSlidingDoor();
  initAudioPlayer();
  initCountdown();
  initGalleryLightbox();
  initGiftBoxCopy();
  initRSVPForm();
  initPetalsCanvas();
  initScrollAnimations();
  initCalendarButtons();
});

/* ==========================================================================
   1. SLIDING DOOR & SEAL OPENING EFFECT
   ========================================================================== */
function initSlidingDoor() {
  const doorOverlay = document.getElementById('doorOverlay');
  const doorSeal = document.getElementById('doorSeal');
  const audioPlayer = document.getElementById('audioPlayer');
  const bgmAudio = document.getElementById('bgmAudio');

  if (!doorOverlay || !doorSeal) return;

  function openInvitation() {
    doorOverlay.classList.add('opened');
    
    // Play celebratory confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c44d58', '#f8ccd3', '#d4af37', '#faeceb', '#ffffff']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#c44d58', '#f8ccd3', '#d4af37']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#c44d58', '#f8ccd3', '#ffffff']
        });
      }, 300);
    }

    // Autoplay BGM after user interaction
    if (bgmAudio) {
      bgmAudio.play().then(() => {
        if (audioPlayer) audioPlayer.classList.add('playing');
      }).catch(err => {
        console.log('Audio autoplay prevented or error:', err);
      });
    }

    // Remove overlay from DOM after animation completes to free memory
    setTimeout(() => {
      doorOverlay.style.display = 'none';
    }, 1200);
  }

  doorSeal.addEventListener('click', openInvitation);
}

/* ==========================================================================
   2. FLOATING AUDIO PLAYER
   ========================================================================== */
function initAudioPlayer() {
  const audioPlayer = document.getElementById('audioPlayer');
  const bgmAudio = document.getElementById('bgmAudio');

  if (!audioPlayer || !bgmAudio) return;

  audioPlayer.addEventListener('click', () => {
    if (bgmAudio.paused) {
      bgmAudio.play().then(() => {
        audioPlayer.classList.add('playing');
        showToast('🎵 Đang phát nhạc đám cưới');
      }).catch(err => console.log('Audio play failed:', err));
    } else {
      bgmAudio.pause();
      audioPlayer.classList.remove('playing');
      showToast('⏸️ Đã tạm dừng nhạc');
    }
  });
}

/* ==========================================================================
   3. COUNTDOWN TIMER (TARGET: 30/02/2027 ~ 01/03/2027)
   ========================================================================== */
function initCountdown() {
  // Target: 16:00, 30/02/2027 (Calculated using 2027-02-28/03-01 boundary)
  const targetDate = new Date('2027-02-28T16:00:00+07:00').getTime();

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   4. PHOTO GALLERY & FULLSCREEN LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightboxModal || !lightboxImg || galleryItems.length === 0) return;

  const imagesList = [];
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      imagesList.push(img.src);
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = imagesList[currentIndex];
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imagesList.length;
    lightboxImg.src = imagesList[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
    lightboxImg.src = imagesList[currentIndex];
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   5. GIFT BOX COPY CLIPBOARD
   ========================================================================== */
function initGiftBoxCopy() {
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const copyText = btn.getAttribute('data-copy');
      if (copyText) {
        navigator.clipboard.writeText(copyText).then(() => {
          showToast('✨ ' + (btn.getAttribute('data-toast') || 'Đã sao chép vào bộ nhớ tạm!'));
        }).catch(() => {
          const tempInput = document.createElement('input');
          tempInput.value = copyText;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast('✨ Đã sao chép thành công!');
        });
      }
    });
  });
}

/* ==========================================================================
   6. CALENDAR EVENT GENERATION (Google Calendar & iCal)
   ========================================================================== */
function initCalendarButtons() {
  const btnGoogleCal = document.getElementById('btnGoogleCal');
  const btnICal = document.getElementById('btnICal');

  const title = encodeURIComponent("Lễ Vu Quy - Cô Dâu Ma Thị Nguyệt");
  const details = encodeURIComponent("Thân mời bạn đến dự buổi tiệc cưới chung vui cùng cô dâu Ma Thị Nguyệt và gia đình tại Tư gia nhà gái - Xóm Đoàn Kết, Xã Bình Thành, Huyện Định Hóa, Tỉnh Thái Nguyên.");
  const location = encodeURIComponent("Xóm Đoàn Kết, Xã Bình Thành, Huyện Định Hóa, Tỉnh Thái Nguyên");
  
  // 16:00 to 20:00 (GMT+7 is 09:00 to 13:00 UTC) on 2027-02-28
  const startUtc = "20270228T090000Z";
  const endUtc = "20270228T130000Z";

  if (btnGoogleCal) {
    btnGoogleCal.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;
    btnGoogleCal.target = "_blank";
  }

  if (btnICal) {
    btnICal.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Dam Cuoi//Co Dau Ma Thi Nguyet//VI",
        "BEGIN:VEVENT",
        `SUMMARY:Lễ Vu Quy - Cô Dâu Ma Thị Nguyệt`,
        `DESCRIPTION:Thân mời bạn đến dự tiệc cưới chung vui cùng cô dâu và gia đình tại Tư Gia Nhà Gái.`,
        `LOCATION:Xóm Đoàn Kết, Xã Bình Thành, Huyện Định Hóa, Tỉnh Thái Nguyên`,
        `DTSTART:${startUtc}`,
        `DTEND:${endUtc}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'DamCuoi_MaThiNguyet.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📅 Đã tải lịch nhắc hẹn đám cưới!');
    });
  }
}

/* ==========================================================================
   7. RSVP FORM & GUESTBOOK WISHES
   ========================================================================== */
function initRSVPForm() {
  const rsvpForm = document.getElementById('rsvpForm');
  const wishesList = document.getElementById('wishesList');

  const defaultWishes = [
    {
      name: "Gia đình Bác Hùng",
      side: "Nhà Gái",
      attend: "yes",
      content: "Chúc cháu Nguyệt trăm năm hạnh phúc, một đời an yên, luôn rạng rỡ và ngập tràn nụ cười!",
      time: "Vừa xong"
    },
    {
      name: "Phương Thảo & Hội Bạn Thân",
      side: "Bạn Cô Dâu",
      attend: "yes",
      content: "Chúc mừng công chúa Nguyệt bước sang trang mới của cuộc đời! Mãi xinh đẹp, hạnh phúc và bình yên nha bạn tôi!",
      time: "15 phút trước"
    },
    {
      name: "Chị Mai & Đồng Nghiệp",
      side: "Đồng Nghiệp",
      attend: "yes",
      content: "Chúc cô dâu Ma Thị Nguyệt ngày cưới thật lộng lẫy, gia đình nhỏ luôn ấm áp, ngập tràn hạnh phúc và tài lộc!",
      time: "1 giờ trước"
    }
  ];

  let storedWishes = [];
  try {
    const saved = localStorage.getItem('wedding_wishes_co_dau_nguyet');
    if (saved) storedWishes = JSON.parse(saved);
  } catch (e) {
    storedWishes = [];
  }

  const allWishes = [...storedWishes, ...defaultWishes];

  function renderWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = allWishes.map(w => `
      <div class="wish-card">
        <div class="wish-header">
          <span class="wish-sender-name">${escapeHTML(w.name)}</span>
          <span class="wish-badge">${escapeHTML(w.side || 'Khách quý')}</span>
        </div>
        <p class="wish-content">“${escapeHTML(w.content)}”</p>
        <div style="text-align: right; margin-top: 4px;">
          <span class="wish-time">${escapeHTML(w.time || 'Gần đây')}</span>
        </div>
      </div>
    `).join('');
  }

  renderWishes();

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guestName').value.trim();
      const side = document.querySelector('input[name="guestSide"]:checked')?.value || 'Khách mời';
      const attend = document.querySelector('input[name="attendance"]:checked')?.value || 'yes';
      const count = document.getElementById('guestCount')?.value || '1 người';
      const message = document.getElementById('guestMessage').value.trim();

      if (!name) {
        showToast('⚠️ Vui lòng nhập họ và tên của bạn!');
        return;
      }

      const newWish = {
        name: name,
        side: side,
        attend: attend,
        count: count,
        content: message || 'Gửi vạn lời chúc phúc tốt đẹp nhất đến cô dâu Ma Thị Nguyệt trong ngày trọng đại!',
        time: 'Vừa xong'
      };

      allWishes.unshift(newWish);
      storedWishes.unshift(newWish);
      
      try {
        localStorage.setItem('wedding_wishes_co_dau_nguyet', JSON.stringify(storedWishes));
      } catch (err) {
        console.log('LocalStorage save error:', err);
      }

      renderWishes();
      rsvpForm.reset();

      // Confetti celebration
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.7 }
        });
      }

      showToast('💌 Cảm ơn bạn đã gửi lời chúc & xác nhận tham dự!');
    });
  }
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   8. FALLING SAKURA / ROSE PETALS & SPARKLES CANVAS
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = 30;
  const petals = [];

  const petalColors = [
    'rgba(248, 204, 211, 0.85)', // Soft Blush Pink
    'rgba(252, 232, 235, 0.9)',  // Very Light Pink
    'rgba(196, 77, 88, 0.65)',   // Rose Red
    'rgba(212, 175, 55, 0.65)'   // Shimmer Gold
  ];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.5 - 0.5,
      speedY: Math.random() * 1.2 + 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      opacity: Math.random() * 0.5 + 0.4
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, p.size / 3, 0, p.size);
    ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function updatePetals() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      drawPetal(p);
    });

    requestAnimationFrame(updatePetals);
  }

  requestAnimationFrame(updatePetals);
}

/* ==========================================================================
   9. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
