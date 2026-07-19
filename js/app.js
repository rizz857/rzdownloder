// ======================================
// RZ DOWNLOADER
// APP.JS - NEO BRUTALISM EDITION
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initSidebar();
    initHero();
    initContact();
    initDownload();
    initFAQ();
    initReveal();
    initFloating();
});

// ======================================
// PAGE LOADER (BULLETPROOF FIX)
// ======================================
function initLoader() {
    const loader = document.getElementById("preloader");
    const loaderBar = document.getElementById("loaderBar");
    const introVideo = document.getElementById("introVideo");
    
    if (!loader) return;

    // Kunci scroll saat loading
    document.body.style.overflow = "hidden";
    
    // Status agar fungsi sembunyi tidak dieksekusi berkali-kali
    let isFinished = false;

    // Fungsi utama untuk menyembunyikan loader
    const hideLoader = () => {
        if (isFinished) return;
        isFinished = true;
        
        if (loaderBar) loaderBar.style.width = "100%"; // Penuhkan bar
        
        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";
        document.body.style.overflow = ""; // Buka scroll
        
        setTimeout(() => {
            loader.remove();
        }, 500);
    };

    // FAILSAFE: Timer cadangan. Apapun yang terjadi, maksimal 5 detik otomatis masuk beranda!
    const failsafeTimer = setTimeout(() => {
        hideLoader();
    }, 5000); 

    if (introVideo) {
        // Tangani masalah pemutaran otomatis yang diblokir browser
        const playPromise = introVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Jika video diblokir, langsung paksa masuk beranda setelah 1.5 detik
                clearTimeout(failsafeTimer);
                setTimeout(hideLoader, 1500);
            });
        }

        // Jalankan loading bar & deteksi manual waktu video
        if (loaderBar) {
            introVideo.addEventListener("timeupdate", () => {
                if (introVideo.duration) {
                    const progress = (introVideo.currentTime / introVideo.duration) * 100;
                    loaderBar.style.width = `${progress}%`;
                    
                    // DETEKSI CERDAS: Jika video sudah 95% jalan, anggap selesai
                    // (Ini mengatasi bug browser yang tidak mau memicu event 'ended')
                    if (introVideo.currentTime >= introVideo.duration - 0.1) {
                        clearTimeout(failsafeTimer);
                        hideLoader();
                    }
                }
            });
        }

        // Event standar jika video benar-benar tamat
        introVideo.addEventListener("ended", () => {
            clearTimeout(failsafeTimer);
            hideLoader();
        });
        
        introVideo.addEventListener("error", () => {
            clearTimeout(failsafeTimer);
            hideLoader();
        });

    } else {
        // Jika tag video dihapus/tidak ditemukan
        clearTimeout(failsafeTimer);
        setTimeout(hideLoader, 1500);
    }
}

function initSidebar() {
    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeMenu");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    
    if (!sidebar || !overlay) return;
    
    function openMenu() {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Mencegah scroll saat menu terbuka
    }
    
    function closeMenu() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = ""; 
    }
    
    menuBtn?.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);
    overlay?.addEventListener("click", closeMenu);
}

// ======================================
// HERO ANIMATION (GSAP)
// ======================================
function initHero() {
    if (typeof gsap === "undefined") return;

    gsap.from(".hero-badge", {
        y: -30,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.8)"
    });

    gsap.from(".hero h1", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: "power3.out"
    });

    gsap.from(".hero p", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        delay: 0.35
    });

    gsap.from(".hero-action > *", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        delay: 0.45,
        ease: "back.out(1.7)"
    });

    gsap.from(".hero-preview", {
        x: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "back.out(1.2)"
    });
}

// ======================================
// CONTACT FLOAT
// ======================================
function initContact() {
    const btn = document.getElementById("contactBtn");
    const menu = document.querySelector(".contact-menu");
    
    if (!btn || !menu) return;
    
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("active");
        // Update opacity & pointer events based on toggle
        if(menu.classList.contains("active")) {
            menu.style.opacity = "1";
            menu.style.pointerEvents = "auto";
            menu.style.transform = "translateY(0)";
        } else {
            menu.style.opacity = "0";
            menu.style.pointerEvents = "none";
            menu.style.transform = "translateY(20px)";
        }
    });
    
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove("active");
            menu.style.opacity = "0";
            menu.style.pointerEvents = "none";
            menu.style.transform = "translateY(20px)";
        }
    });
}

// ======================================
// FLOATING 3D EFFECT
// ======================================
function initFloating() {
    const floatItems = document.querySelectorAll(".platform-card, .feature-card, .preview-platform div");
    
    floatItems.forEach(item => {
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rx = (y - rect.height / 2) / 15;
            const ry = (rect.width / 2 - x) / 15;
            
            item.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
        });
        
        item.addEventListener("mouseleave", () => {
            item.style.transform = "";
        });
    });
}

// ======================================
// DOWNLOAD BUTTON LOGIC
// ======================================
function initDownload() {
    const btn = document.getElementById("downloadBtn");
    const input = document.getElementById("urlInput");
    const status = document.getElementById("statusText");
    
    if (!btn || !input || !status) return;
    
    btn.addEventListener("click", async () => {
        const url = input.value.trim();
        
        if (!url) {
            Swal.fire({
                icon: "warning",
                title: "URL Kosong",
                text: "Masukkan link video/media terlebih dahulu.",
                confirmButtonColor: "#ff90e8"
            });
            return;
        }
        
        // State: Loading
        btn.disabled = true;
        btn.innerHTML = `<i class="ti ti-loader-2" style="animation: spin 1s linear infinite;"></i><span>Processing...</span>`;
        
        status.innerHTML = `<i class="ti ti-loader-2"></i> Mengambil data...`;
        status.style.borderColor = "#ffc900"; // Yellow warning color
        
        try {
            // Asumsi getDownloadData ada di api.js
            if(typeof getDownloadData === "function") {
                const data = await getDownloadData(url);
                status.innerHTML = `<i class="ti ti-circle-check"></i> Media berhasil ditemukan!`;
                status.style.borderColor = "#23a094"; // Green success color
                
                if(typeof openVideoPopup === "function") {
                    openVideoPopup(data);
                }
            } else {
                // Fallback simulasi jika api.js belum siap
                await new Promise(resolve => setTimeout(resolve, 2000));
                status.innerHTML = `<i class="ti ti-circle-check"></i> (Simulasi) Media ditemukan!`;
                status.style.borderColor = "#23a094";
                document.getElementById("mediaModal")?.classList.add("active");
            }
            
        } catch (err) {
            console.error(err);
            status.innerHTML = `<i class="ti ti-alert-circle"></i> ${err.message || "Terjadi kesalahan"}`;
            status.style.borderColor = "#ff5f56"; // Red error color
            
            Swal.fire({
                icon: "error",
                title: "Download Gagal",
                text: err.message || "API tidak merespon",
                confirmButtonColor: "#ff90e8"
            });
        } finally {
            // State: Reset
            btn.disabled = false;
            btn.innerHTML = `<i class="ti ti-search"></i><span>Download</span>`;
        }
    });
    
    // Enter key to download
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            btn.click();
        }
    });
}

// ======================================
// FAQ ACCORDION
// ======================================
function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    
    faqItems.forEach(item => {
        const btn = item.querySelector("button");
        const icon = item.querySelector("i");
        
        btn?.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Close all first
            faqItems.forEach(el => {
                el.classList.remove("active");
                const elIcon = el.querySelector("i");
                if(elIcon) elIcon.style.transform = "rotate(0deg)";
            });
            
            // Open clicked
            if (!isActive) {
                item.classList.add("active");
                if(icon) icon.style.transform = "rotate(180deg)";
            }
        });
    });
}

// ======================================
// SCROLL REVEAL (Intersection Observer)
// ======================================
function initReveal() {
    const elements = document.querySelectorAll(".platform-card, .feature-card, .faq-item, .download-card");
    
    // Set initial state
    elements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// ======================================
// SMOOTH SCROLL (LENIS)
// ======================================
if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        smoothTouch: true
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// ======================================
// KEYBOARD SHORTCUT (CTRL + /)
// ======================================
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        const input = document.getElementById("urlInput");
        if (input) {
            input.focus();
            input.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
});

// ======================================
// GLOBAL CSS FOR SPIN ANIMATION
// ======================================
const style = document.createElement("style");
style.innerHTML = `
@keyframes spin { 
    100% { transform: rotate(360deg); } 
}
`;
document.head.appendChild(style);

// ======================================
// CONSOLE GREETING
// ======================================
console.clear();
console.log(
    "%c RZ Downloader %c Neo Brutalism Edition ",
    "font-size:16px; font-weight:900; color:#0f172a; background:#ff90e8; padding:5px 10px; border: 2px solid #0f172a; border-radius: 4px;",
    "font-size:16px; font-weight:700; color:#0f172a; background:#ffc900; padding:5px 10px; border: 2px solid #0f172a; border-radius: 4px;"
);
// ======================================
// START DOWNLOAD BUTTON LOGIC
// ======================================
const startBtn = document.querySelector(".hero-btn");
const downloadSection = document.querySelector(".download-section");

if (startBtn && downloadSection) {
    // Memaksa tombol agar terlihat jika GSAP gagal me-load
    startBtn.style.opacity = "1";
    startBtn.style.visibility = "visible";

    startBtn.addEventListener("click", () => {
        // Scroll mulus ke bagian input URL
        downloadSection.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
        });
        
        // Fokuskan kursor ke input box setelah scroll
        setTimeout(() => {
            document.getElementById("urlInput")?.focus();
        }, 500);
    });
}
