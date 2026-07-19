// ===========================================
// RZ DOWNLOADER
// API.JS - NEO BRUTALISM EDITION
// ===========================================

// ===========================================
// 1. CONFIGURATION
// ===========================================
const API_KEY = "kyzz649058754"; 
const BASE_API = "https://api.kyzzz.eu.cc/api/download";

const API = {
    aio: `${BASE_API}/aio`,
    tiktok: `${BASE_API}/tiktok`,
    instagram: `${BASE_API}/instagram`,
    facebook: `${BASE_API}/facebook`,
    pinterest: `${BASE_API}/pinterest`,
    youtubeMp4: `${BASE_API}/youtube-mp4`,
    youtubeMp3: `${BASE_API}/youtube-mp3`
};

const REQUEST_TIMEOUT = 60000; 

// ===========================================
// 2. PLATFORM DETECTOR
// ===========================================
function detectPlatform(url) {
    url = url.toLowerCase();
    
    if (url.includes("vt.tiktok.com") || url.includes("tiktok.com")) return "tiktok";
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("facebook.com") || url.includes("fb.watch")) return "facebook";
    if (url.includes("youtu.be") || url.includes("youtube.com")) return "youtube";
    if (url.includes("pin.it") || url.includes("pinterest.")) return "pinterest";
    
    return "aio";
}

// ===========================================
// 3. URL BUILDER & FETCH TIMEOUT
// ===========================================
function buildURL(endpoint, url) {
    return `${endpoint}?url=${encodeURIComponent(url)}&apikey=${API_KEY}`;
}

async function fetchJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (err) {
        clearTimeout(timer);
        if (err.name === "AbortError") {
            throw new Error("Koneksi timeout. Server API sedang sibuk.");
        }
        throw err;
    }
}

// ===========================================
// 4. FETCH DATA (MAIN FUNCTION)
// ===========================================
async function getDownloadData(inputUrl) {
    const platform = detectPlatform(inputUrl);
    let endpoint = API.aio;

    switch (platform) {
        case "tiktok": endpoint = API.tiktok; break;
        case "instagram": endpoint = API.instagram; break;
        case "facebook": endpoint = API.facebook; break;
        case "youtube": endpoint = API.youtubeMp4; break;
        case "pinterest": endpoint = API.pinterest; break;
        default: endpoint = API.aio;
    }

    try {
        const json = await fetchJSON(buildURL(endpoint, inputUrl));

        if (!json || json.status !== true || !json.result) {
            throw new Error(json?.message || "Media tidak ditemukan atau API Key Limit.");
        }

        return normalizeResponse(platform, json);
    } catch (err) {
        console.warn(`[Primary API] Gagal fetching untuk ${platform}:`, err.message);

        // Jika errornya dari validasi Pinterest (media kosong), langsung lempar errornya
        if (err.message.includes("API gagal mendapatkan link media")) {
            throw new Error("API merespon, tapi link media kosong. Coba link Pinterest lain.");
        }

        if (platform !== "aio") {
            console.log("[Fallback] Mencoba menggunakan endpoint AIO...");
            try {
                const aioJson = await fetchJSON(buildURL(API.aio, inputUrl));
                if (aioJson && aioJson.status && aioJson.result) {
                    return normalizeResponse("aio", aioJson);
                }
            } catch (e) {
                console.warn("[Fallback AIO] Gagal:", e.message);
            }
        }

        // Tampilkan pesan error spesifik jika ada, atau gunakan default
        throw new Error(err.message || "Gagal mengambil data. URL mungkin bersifat Private atau API sedang error.");
    }
}


// ===========================================
// 5. NORMALIZE RESPONSE
// ===========================================
function normalizeResponse(platform, json) {
    const result = json.result || {};
    
    const output = {
        platform: result.platform || platform,
        title: result.title || result.description || "Untitled Media",
        author: result.uploader || result.author?.nickname || result.author || "Unknown",
        thumbnail: result.thumbnail || result.cover || result.origin_cover || "",
        duration: result.duration || 0,
        videos: [],
        audios: [],
        images: [],
        qualities: []
    };

    // --- TIKTOK ---
    if (platform === "tiktok") {
        if (result.video?.url) {
            output.videos.push({
                url: result.video.url,
                quality: result.video.quality || "HD"
            });
        }
        if (Array.isArray(result.formats)) {
            result.formats.forEach(item => {
                output.qualities.push({
                    url: item.url,
                    quality: item.quality || "Unknown"
                });
            });
        }
        if (result.audio?.url) output.audios.push({ url: result.audio.url, ext: "mp3" });
        if (Array.isArray(result.images)) {
            result.images.forEach(img => output.images.push({ url: img }));
        }
    } 
    
    // --- INSTAGRAM ---
    else if (platform === "instagram") {
        if (Array.isArray(result.medias)) {
            result.medias.forEach(media => {
                if (media.type === "image") output.images.push({ url: media.url });
                else output.videos.push({ url: media.url, quality: media.quality || "HD" });
            });
        }
    } 
    
    // --- FACEBOOK ---
    else if (platform === "facebook") {
        const fbData = Array.isArray(result) ? result : (result.video || result.formats || []);
        if (Array.isArray(fbData)) {
            fbData.forEach(video => {
                if(video.url) output.videos.push({ url: video.url, quality: video.quality || "Video" });
            });
        }
    } 
    
    // --- PINTEREST (UPDATE TERBARU) ---
    else if (platform === "pinterest") {
        // Mengambil username juga jika tersedia
        if (result.username) {
            output.author = `${result.author || "Unknown"} (@${result.username})`;
        }

        const mediaUrl = result.media;
        
        // Memastikan media url bukan string kosong atau "-"
        if (mediaUrl && mediaUrl !== "-") {
            // Cek apakah jenisnya video atau dari ekstensinya
            if (result.type === "video" || mediaUrl.includes(".mp4")) {
                output.videos.push({ url: mediaUrl, quality: "HD" });
            } else {
                output.images.push({ url: mediaUrl });
            }
        } else {
             // Jika API merespon "-", lemparkan error agar tidak nyangkut di popup kosong
             throw new Error("API gagal mendapatkan link media dari Pinterest.");
        }
    } 
    
    // --- YOUTUBE ---
    else if (platform === "youtube") {
        if (result.url) output.videos.push({ url: result.url, quality: result.quality || "HD" });
    } 
    
    // --- AIO / DEFAULT ---
    else {
        if (result.video?.url) output.videos.push({ url: result.video.url, quality: "HD" });
        if (result.audio?.url) output.audios.push({ url: result.audio.url, ext: "mp3" });
        if (Array.isArray(result.images)) result.images.forEach(img => output.images.push({ url: img }));
    }

    // =====================================
    // VALIDASI AKHIR
    // =====================================
    if (output.videos.length === 0 && output.images.length === 0 && output.audios.length === 0) {
        throw new Error("Gagal mengekstrak link media. URL mungkin tidak valid atau tidak didukung.");
    }

    return output;
}

// =====================================
// EXPORT TO GLOBAL WINDOW
// =====================================
window.getDownloadData = getDownloadData;
window.detectPlatform = detectPlatform;
