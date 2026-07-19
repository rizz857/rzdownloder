// =========================================
// RZ Downloader - Donation Page (Neo Brutalism)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    initSidebar();
    initCopyDana();
    initDownloadQR();
    initFAQ();
    initLenis();
    initAnimations();
    initRipple(); 
});

// =========================
// SIDEBAR
// =========================
function initSidebar() {
    const menuBtn = document.getElementById("menuBtn");
    const closeMenu = document.getElementById("closeMenu");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (!sidebar || !overlay) return;

    function openSidebar() {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
        if (window.lenis) window.lenis.stop(); // Kunci Lenis
    }

    function closeSidebar() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
        if (window.lenis) window.lenis.start(); // Buka Lenis
    }

    menuBtn?.addEventListener("click", openSidebar);
    closeMenu?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);
}

// =========================
// COPY DANA (Dengan Fallback)
// =========================
function initCopyDana() {
    const copyDana = document.getElementById("copyDana");
    const danaNumber = document.getElementById("danaNumber");

    copyDana?.addEventListener("click", async () => {
        const number = danaNumber.textContent.trim();

        // Ubah gaya tombol sementara (Visual Feedback Neo Brutalism)
        const originalHTML = copyDana.innerHTML;
        copyDana.innerHTML = `<i class="ti ti-check"></i> Disalin!`;
        copyDana.style.background = "var(--green)";
        copyDana.style.color = "var(--text)";

        const showSuccess = () => {
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Nomor DANA berhasil disalin.",
                    timer: 1600,
                    showConfirmButton: false
                });
            }
            setTimeout(() => {
                copyDana.innerHTML = originalHTML;
                copyDana.style.background = "";
            }, 1600);
        };

        try {
            await navigator.clipboard.writeText(number);
            showSuccess();
        } catch {
            // Fallback untuk browser lawas / strict HTTP
            const input = document.createElement("input");
            input.value = number;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            input.remove();
            showSuccess();
        }
    });
}

// =========================
// DOWNLOAD QR
// =========================
function initDownloadQR() {
    const downloadQR = document.getElementById("downloadQR");

    downloadQR?.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = "assets/qris.png";
        link.download = "RZ-Downloader-QRIS.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
}

// =========================
// FAQ
// =========================
function initFAQ() {
    document.querySelectorAll(".faq-item").forEach(item => {
        const btn = item.querySelector("button");
        
        btn?.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Tutup semua FAQ
            document.querySelectorAll(".faq-item").forEach(el => {
                el.classList.remove("active");
                const icon = el.querySelector("i");
                if(icon) icon.style.transform = "rotate(0deg)";
            });

            // Buka yang diklik
            if (!isActive) {
                item.classList.add("active");
                const icon = item.querySelector("i");
                if(icon) icon.style.transform = "rotate(180deg)";
            }
        });
    });
}

// =========================
// LENIS (SMOOTH SCROLL)
// =========================
function initLenis() {
    if (typeof Lenis !== "undefined") {
        window.lenis = new Lenis({
            duration: 1.15,
            smoothWheel: true,
            smoothTouch: true
        });

        function raf(time) {
            window.lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
}

// =========================
// ANIMASI (GSAP + OBSERVER BERSAMAAN)
// =========================
function initAnimations() {
    // 1. GSAP HANYA UNTUK HERO (Langsung terlihat saat web dibuka)
    if (typeof gsap !== "undefined") {
        gsap.from(".hero-badge", { opacity: 0, y: -30, duration: 0.7, ease: "back.out(1.8)" });
        gsap.from(".hero h1", { opacity: 0, y: 40, duration: 0.8, delay: 0.15, ease: "power3.out" });
        gsap.from(".hero p", { opacity: 0, y: 30, duration: 0.7, delay: 0.35 });
    }

    // 2. SCROLL REVEAL UNTUK ELEMEN BAWAH
    // Memilih semua kartu yang ada di halaman donasi
    const elements = document.querySelectorAll(".donation-card, .support-card, .contact-card, .thanks-card, .faq-item");
    
    // Tambahkan class awal (untuk disembunyikan) ke semua kartu
    elements.forEach(el => el.classList.add("reveal-item"));
    
    // Logika pengamat scroll
    const observer = new IntersectionObserver((entries) => {
        let delayCounter = 0; // Penghitung jeda
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Beri jeda 100ms antar kartu agar muncul bergantian (Stagger)
                setTimeout(() => {
                    entry.target.classList.add("show");
                }, delayCounter * 100);
                
                delayCounter++; // Tambah jeda untuk kartu berikutnya
                observer.unobserve(entry.target); // Animasi cukup dimainkan 1x
            }
        });
    }, { 
        threshold: 0.15, // Kartu akan muncul jika 15% bagiannya sudah terlihat di layar
        rootMargin: "0px 0px -50px 0px" // Pemicu agak ke bawah sedikit
    });
    
    // Mulai amati kartu-kartunya
    elements.forEach(el => observer.observe(el));
}

// =========================
// RIPPLE EFFECT (ANIMASI KLIK)
// =========================
function initRipple() {
    document.addEventListener("click", (e) => {
        // Cari elemen yang diklik (tombol atau kartu kontak)
        const btn = e.target.closest("button, .donation-btn, .copy-btn, .contact-card, .sidebar > a");
        if (!btn) return;

        // Buat elemen gelombang
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        
        // Hitung posisi klik agar gelombang muncul dari titik jari/mouse
        const rect = btn.getBoundingClientRect();
        
        // Atur ukuran gelombang berdasarkan lebar elemen
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        
        // Pusatkan gelombang ke titik klik
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        // Masukkan gelombang ke dalam tombol
        btn.appendChild(ripple);

        // Hapus elemen gelombang setelah animasinya selesai (600ms)
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}
