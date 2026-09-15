/* ======================================================
   DYNAMIC GLOWING BUTTERFLIES & NETWORK PRELOADER SCRIPT
   ====================================================== */

// --- 1. NETWORK DETECTION & PRELOADER CONTROLLER ---
const preloader = document.getElementById('preloader');
const networkText = document.getElementById('network-text');
const preloaderStatus = document.getElementById('preloader-status');

function detectNetwork() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let estimatedDelay = 1200; // Standar delay fallback

  if (conn) {
    const type = conn.effectiveType; // '4g', '3g', '2g', 'slow-2g'
    const downlink = conn.downlink ? `${conn.downlink} Mbps` : '';

    if (type === '4g') {
      networkText.innerText = `Jaringan Cepat (${downlink || '4G/Wi-Fi'})`;
      preloaderStatus.innerText = "Koneksi stabil, menyiapkan tampilan...";
      estimatedDelay = 1000;
    } else if (type === '3g') {
      networkText.innerText = `Jaringan 3G (${downlink || 'Stabil'})`;
      preloaderStatus.innerText = "Mengoptimalkan data aset...";
      estimatedDelay = 1800;
    } else {
      networkText.innerText = "Koneksi Hemat Daya / 2G";
      preloaderStatus.innerText = "Menyesuaikan bandwidth...";
      estimatedDelay = 2600;
    }
  } else {
    networkText.innerText = navigator.onLine ? "Jaringan Terhubung Online" : "Mode Offline";
    preloaderStatus.innerText = "Memuat Wanzy Community...";
    estimatedDelay = 1300;
  }

  return estimatedDelay;
}

// Fade out preloader saat web selesai dimuat
window.addEventListener('load', () => {
  const networkDelay = detectNetwork();

  setTimeout(() => {
    preloader.classList.add('fade-out');
  }, networkDelay);
});

window.addEventListener('online', () => {
  networkText.innerText = "Jaringan Kembali Online";
});

window.addEventListener('offline', () => {
  networkText.innerText = "Koneksi Terputus (Offline)";
});


// --- 2. FLYING BUTTERFLIES CANVAS ANIMATION ---
const canvas = document.getElementById('butterflyCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

class Butterfly {
  constructor() {
    this.reset(true);
  }

  reset(init = false) {
    this.x = Math.random() * width;
    this.y = init ? Math.random() * height : height + 50;
    this.size = Math.random() * 8 + 9;
    this.speedY = Math.random() * 1.2 + 0.65;
    this.speedX = (Math.random() - 0.5) * 1.4;
    this.flapSpeed = Math.random() * 0.16 + 0.12;
    this.angle = Math.random() * Math.PI * 2;
    this.colorHue = Math.random() * 50 + 265; // Neon Purple / Pink
    this.opacity = Math.random() * 0.45 + 0.45;
  }

  update() {
    this.y -= this.speedY;
    this.x += Math.sin(this.angle * 0.6) * 1.5 + this.speedX;
    this.angle += this.flapSpeed;

    if (this.y < -50 || this.x < -60 || this.x > width + 60) {
      this.reset(false);
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.sin(this.angle * 0.35) * 0.35);

    const wingFlap = Math.abs(Math.sin(this.angle));

    // Outer Glow Effect
    ctx.shadowBlur = 14;
    ctx.shadowColor = `hsl(${this.colorHue}, 100%, 75%)`;

    // Upper Wings
    ctx.fillStyle = `hsla(${this.colorHue}, 90%, 70%, ${this.opacity})`;
    
    // Left Upper Wing
    ctx.beginPath();
    ctx.ellipse(-this.size * wingFlap * 0.85, -this.size * 0.35, this.size * wingFlap, this.size * 1.25, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Right Upper Wing
    ctx.beginPath();
    ctx.ellipse(this.size * wingFlap * 0.85, -this.size * 0.35, this.size * wingFlap, this.size * 1.25, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Lower Wings
    ctx.fillStyle = `hsla(${this.colorHue + 15}, 95%, 75%, ${this.opacity * 0.9})`;
    
    // Left Lower Wing
    ctx.beginPath();
    ctx.ellipse(-this.size * wingFlap * 0.55, this.size * 0.45, this.size * wingFlap * 0.7, this.size * 0.8, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Right Lower Wing
    ctx.beginPath();
    ctx.ellipse(this.size * wingFlap * 0.55, this.size * 0.45, this.size * wingFlap * 0.7, this.size * 0.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Slender Body
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 1.8, this.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// Inisialisasi 24 kupu-kupu beterbangan
const butterflies = Array.from({ length: 24 }, () => new Butterfly());

function animate() {
  ctx.clearRect(0, 0, width, height);
  butterflies.forEach(b => {
    b.update();
    b.draw();
  });
  requestAnimationFrame(animate);
}

// Jalankan animasi loop
animate();