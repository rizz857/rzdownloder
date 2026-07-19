// ======================================
// RZ DOWNLOADER
// panduan.js
// ======================================

// ======================================
// LENIS
// ======================================

const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    smoothTouch: true
});

function raf(time){
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sinkronkan Lenis dengan ScrollTrigger
if(window.ScrollTrigger){
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

// ======================================
// SIDEBAR
// ======================================

const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeMenu");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function openSidebar(){

    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("no-scroll");

}

function closeSidebar(){

    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");

}

menuBtn?.addEventListener("click", openSidebar);
closeBtn?.addEventListener("click", closeSidebar);
overlay?.addEventListener("click", closeSidebar);

document.querySelectorAll(".sidebar a").forEach(link=>{
    link.addEventListener("click",closeSidebar);
});

// ======================================
// FAQ
// ======================================

document.querySelectorAll(".faq-box").forEach(box=>{

    const btn = box.querySelector("button");

    btn?.addEventListener("click",()=>{

        const opened = box.classList.contains("open");

        document.querySelectorAll(".faq-box")
        .forEach(item=>item.classList.remove("open"));

        if(!opened){
            box.classList.add("open");
        }

    });

});

// ======================================
// GSAP HERO
// ======================================

if(window.gsap){

gsap.from(".hero-badge",{
    opacity:0,
    y:-30,
    duration:.7,
    ease:"back.out(1.7)"
});

gsap.from(".hero h1",{
    opacity:0,
    y:50,
    duration:.9,
    delay:.15
});

gsap.from(".hero p",{
    opacity:0,
    y:40,
    duration:.7,
    delay:.35
});

gsap.from(".hero-buttons a",{
    opacity:0,
    y:25,
    duration:.5,
    delay:.55,
    stagger:.1
});

}

// ======================================
// REVEAL
// ======================================

const cards = document.querySelectorAll(`
.step-card,
.platform-card,
.tip-card,
.faq-box,
.cta-card
`.replace(/\n/g,""));

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");
            observer.unobserve(entry.target);

        }

    });

},{
    threshold:0.05,
    rootMargin:"0px 0px -80px 0px"
});

cards.forEach(card=>observer.observe(card));

// ======================================
// GSAP SCROLL
// ======================================

if(window.gsap && window.ScrollTrigger){

gsap.utils.toArray(".step-card").forEach((el,i)=>{

    gsap.from(el,{
        scrollTrigger:{
            trigger:el,
            start:"top 90%"
        },
        opacity:0,
        y:50,
        duration:.6,
        delay:i*0.05
    });

});

gsap.utils.toArray(".platform-card").forEach((el,i)=>{

    gsap.from(el,{
        scrollTrigger:{
            trigger:el,
            start:"top 90%"
        },
        opacity:0,
        scale:.9,
        duration:.6,
        delay:i*0.05
    });

});

gsap.utils.toArray(".tip-card").forEach((el,i)=>{

    gsap.from(el,{
        scrollTrigger:{
            trigger:el,
            start:"top 90%"
        },
        opacity:0,
        x:-30,
        duration:.5,
        delay:i*0.05
    });

});

gsap.utils.toArray(".faq-box").forEach((el)=>{

    gsap.from(el,{
        scrollTrigger:{
            trigger:el,
            start:"top 90%"
        },
        opacity:0,
        y:35,
        duration:.5
    });

});

gsap.from(".cta-card",{
    scrollTrigger:{
        trigger:".cta-card",
        start:"top 85%"
    },
    opacity:0,
    scale:.95,
    duration:.8
});

}

// ======================================
// CARD EFFECT
// ======================================

document.querySelectorAll(
".step-card,.platform-card,.tip-card"
).forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        gsap.to(card,{
            y:-6,
            duration:.2
        });

    });

    card.addEventListener("mouseleave",()=>{

        gsap.to(card,{
            y:0,
            rotate:0,
            duration:.2
        });

    });

});

// ======================================
// ACTIVE MENU
// ======================================

document.querySelectorAll(".sidebar a").forEach(link=>{

    if(link.getAttribute("href")==="panduan.html"){

        link.classList.add("active");

    }

});

// ======================================
// NAVBAR
// ======================================

window.addEventListener("scroll",()=>{

    const nav = document.querySelector(".navbar");

    if(!nav) return;

    if(window.scrollY>120){

        nav.style.boxShadow="10px 10px 0 #111";

    }else{

        nav.style.boxShadow="0 6px 0 #111";

    }

});

// ======================================
// PAGE LOAD
// ======================================

window.addEventListener("load",()=>{

    document.body.classList.add("loaded");

    if(window.ScrollTrigger){
        ScrollTrigger.refresh();
    }

});