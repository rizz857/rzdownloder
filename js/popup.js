// ===========================================
// RZ DOWNLOADER
// POPUP.JS - NEO BRUTALISM EDITION (FULL FIX)
// ===========================================

// ===========================================
// ELEMENTS MAPPING
// ===========================================
const mediaModal = document.getElementById("mediaModal");
const mediaPopup = document.querySelector(".media-popup");
const closePopupBtn = document.getElementById("closePopup");

const popupVideo = document.getElementById("popupVideo");
const popupTitle = document.getElementById("popupTitle");
const popupAuthor = document.getElementById("popupAuthor");
const popupPlatform = document.getElementById("popupPlatform");

const tabVideo = document.getElementById("videoTab");
const tabPhoto = document.getElementById("photoTab");
const tabAudio = document.getElementById("audioTab");

const panelVideo = document.getElementById("videoPanel");
const panelPhoto = document.getElementById("photoPanel");
const panelAudio = document.getElementById("audioPanel");

const photoList = document.getElementById("photoList");
const btnDownloadVideo = document.getElementById("downloadVideo");
const btnDownloadPhoto = document.getElementById("downloadAllPhoto");
const btnDownloadAudio = document.getElementById("downloadAudio");

let popupData = null;
let startY = 0;
let moveY = 0;

// ===========================================
// RESET & TAB
// ===========================================
function resetPopup() {
    popupData = null;
    popupVideo.pause();
    popupVideo.removeAttribute("src");
    popupVideo.load();
    photoList.innerHTML = "";
    
    [tabVideo, tabPhoto, tabAudio].forEach(t => {
        if(t) { t.classList.remove("active"); t.style.display = "flex"; }
    });
    
    [panelVideo, panelPhoto, panelAudio].forEach(p => {
        if(p) p.classList.remove("active");
    });
}

function setActiveTab(tabType) {
    [tabVideo, tabPhoto, tabAudio].forEach(t => t?.classList.remove("active"));
    [panelVideo, panelPhoto, panelAudio].forEach(p => p?.classList.remove("active"));
    
    if (tabType === "video") {
        tabVideo?.classList.add("active");
        panelVideo?.classList.add("active");
        popupVideo.style.display = "block";
    } else if (tabType === "photo") {
        tabPhoto?.classList.add("active");
        panelPhoto?.classList.add("active");
        popupVideo.style.display = "none";
    } else if (tabType === "audio") {
        tabAudio?.classList.add("active");
        panelAudio?.classList.add("active");
        popupVideo.style.display = "none";
    }
}

// ===========================================
// OPEN POPUP
// ===========================================
async function openVideoPopup(data) {
    if (!data) return;
    
    resetPopup();
    popupData = data;
    
    popupTitle.textContent = data.title || "Media Siap Diunduh";
    popupAuthor.textContent = data.author || "Unknown User";
    popupPlatform.textContent = data.platform || "RZ Downloader";

    if (data.videos && data.videos.length > 0) setActiveTab("video");
    else if (data.images && data.images.length > 0) setActiveTab("photo");
    else if (data.audios && data.audios.length > 0) setActiveTab("audio");

    renderVideo();
    renderPhoto();
    renderAudio();

    // Tampilkan Modal
    mediaModal.classList.add("active");
    
    // KUNCI SCROLL TOTAL (Lenis & Browser)
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (window.lenis) window.lenis.stop();

    if (typeof gsap !== "undefined") {
        gsap.fromTo(mediaPopup, 
            { y: 100, opacity: 0, scale: 0.9 }, 
            { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" }
        );
    }
}

// ===========================================
// CLOSE POPUP
// ===========================================
function closeVideoPopup() {
    if (typeof gsap !== "undefined") {
        gsap.to(mediaPopup, {
            y: 100, opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in",
            onComplete: () => {
                mediaModal.classList.remove("active");
                
                // BUKA KUNCI SCROLL TOTAL
                document.body.style.overflow = "";
                document.documentElement.style.overflow = "";
                if (window.lenis) window.lenis.start();
                
                mediaPopup.style.transform = ""; 
                resetPopup();
            }
        });
    } else {
        mediaModal.classList.remove("active");
        
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if (window.lenis) window.lenis.start();
        
        resetPopup();
    }
}

// ===========================================
// RENDER MEDIA
// ===========================================
function renderVideo() {
    if (!popupData.videos || popupData.videos.length === 0) {
        if(tabVideo) tabVideo.style.display = "none";
        return;
    }
    const firstVideo = popupData.videos[0];
    popupVideo.src = firstVideo.url;
    popupVideo.poster = popupData.thumbnail || "";
    
    btnDownloadVideo.onclick = () => downloadMedia(firstVideo.url, `RZ-Video-${Date.now()}.mp4`);
}

function renderPhoto() {
    if (!popupData.images || popupData.images.length === 0) {
        if(tabPhoto) tabPhoto.style.display = "none";
        return;
    }
    
    // Horizontal Slider Styling
    photoList.style.display = "flex";
    photoList.style.overflowX = "auto";
    photoList.style.gap = "1rem";
    photoList.style.paddingBottom = "15px";
    photoList.style.scrollSnapType = "x mandatory";
    photoList.style.scrollBehavior = "smooth";
    photoList.style.scrollbarWidth = "none";
    
    popupData.images.forEach((item, index) => {
        const img = document.createElement("img");
        img.src = item.url;
        img.loading = "lazy";
        
        img.style.flex = "0 0 100%";
        img.style.height = "320px";
        img.style.objectFit = "cover";
        img.style.scrollSnapAlign = "center";
        img.style.border = "var(--border-thick) solid var(--black)";
        img.style.borderRadius = "var(--radius)";
        img.style.boxShadow = "var(--shadow-solid-sm)";
        photoList.appendChild(img);
    });

    btnDownloadPhoto.onclick = () => {
        popupData.images.forEach((item, index) => {
            setTimeout(() => downloadMedia(item.url, `RZ-Photo-${index + 1}.jpg`), index * 400); 
        });
    };
}

function renderAudio() {
    if (!popupData.audios || popupData.audios.length === 0) {
        if(tabAudio) tabAudio.style.display = "none";
        return;
    }
    const audio = popupData.audios[0];
    btnDownloadAudio.onclick = () => downloadMedia(audio.url, `RZ-Audio-${Date.now()}.mp3`);
}

// ===========================================
// DOWNLOAD LOGIC
// ===========================================
async function downloadMedia(url, filename) {

    if (typeof Swal !== "undefined") {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: "Memulai download...",
            showConfirmButton: false,
            timer: 1500
        });
    }

    try {

        const res = await fetch(url);

        if (!res.ok) throw new Error("Fetch gagal");

        const blob = await res.blob();

        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = blobUrl;
        a.download = filename;
        a.style.display = "none";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 1000);

    } catch (e) {

        if (typeof Swal !== "undefined") {
            Swal.fire({
                icon: "error",
                title: "Download gagal",
                text: "Browser memblokir file (CORS)."
            });
        }

        console.error(e);

    }

}

// ===========================================
// EVENT LISTENERS
// ===========================================
tabVideo?.addEventListener("click", () => setActiveTab("video"));
tabPhoto?.addEventListener("click", () => setActiveTab("photo"));
tabAudio?.addEventListener("click", () => setActiveTab("audio"));
closePopupBtn?.addEventListener("click", closeVideoPopup);

mediaModal?.addEventListener("click", (e) => { 
    if (e.target === mediaModal) closeVideoPopup(); 
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mediaModal.classList.contains("active")) closeVideoPopup();
});

// ===========================================
// SWIPE TO CLOSE
// ===========================================
mediaPopup?.addEventListener("touchstart", (e) => {
    if (mediaPopup.scrollTop === 0) startY = e.touches[0].clientY;
    else startY = 0;
}, { passive: true });

mediaPopup?.addEventListener("touchmove", (e) => {
    if (!startY) return;
    moveY = e.touches[0].clientY - startY;
    if (moveY > 0) {
        mediaPopup.style.transform = `translateY(${moveY}px)`;
        mediaPopup.style.transition = "none";
    }
}, { passive: true });

mediaPopup?.addEventListener("touchend", () => {
    if (moveY > 150) closeVideoPopup();
    else {
        mediaPopup.style.transform = "translateY(0)";
        mediaPopup.style.transition = "transform 0.3s ease";
    }
    startY = 0;
    moveY = 0;
});

// ===========================================
// EXPORT TO GLOBAL
// ===========================================
window.openVideoPopup = openVideoPopup;
window.closeVideoPopup = closeVideoPopup;
