
// ======================================

"use strict";

// ======================================
// GSAP
// ======================================

if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

// ======================================
// LENIS
// ======================================

let lenis = null;

if (window.Lenis) {

    lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        smoothTouch: true,
        touchMultiplier: 1.15,
        wheelMultiplier: 1
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on("scroll", () => {
        if (window.ScrollTrigger) {
            ScrollTrigger.update();
        }
    });

}

// ======================================
// ELEMENT
// ======================================

const body = document.body;

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// ======================================
// SIDEBAR
// ======================================

function openSidebar() {

    if (!sidebar || !overlay) return;

    sidebar.classList.add("active");
    overlay.classList.add("active");

    body.classList.add("no-scroll");

}

function closeSidebar() {

    if (!sidebar || !overlay) return;

    sidebar.classList.remove("active");
    overlay.classList.remove("active");

    body.classList.remove("no-scroll");

}

menuBtn?.addEventListener("click", openSidebar);

closeMenu?.addEventListener("click", closeSidebar);

overlay?.addEventListener("click", closeSidebar);

// ======================================
// CLOSE WITH ESC
// ======================================

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        closeSidebar();

    }

});

// ======================================
// CLOSE WHEN CLICK LINK
// ======================================

document
.querySelectorAll(".sidebar a")
.forEach(link => {

    link.addEventListener("click", () => {

        closeSidebar();

    });

});

// ======================================
// HERO ANIMATION
// ======================================

if (window.gsap) {

    gsap.from(".hero-badge", {

        y: -35,
        opacity: 0,
        duration: .7,
        ease: "back.out(1.5)"

    });

    gsap.from(".hero h1", {

        y: 50,
        opacity: 0,
        duration: .8,
        delay: .15,
        ease: "power3.out"

    });

    gsap.from(".hero p", {

        y: 30,
        opacity: 0,
        duration: .7,
        delay: .3

    });

    gsap.from(".hero-buttons", {

        y: 25,
        opacity: 0,
        duration: .7,
        delay: .45

    });

}
// ======================================
// PART 2
// FAQ + SCROLL ANIMATION
// ======================================

// ======================================
// FAQ
// ======================================

document
.querySelectorAll(".faq-box")
.forEach(box => {

    const btn = box.querySelector("button");

    if (!btn) return;

    btn.addEventListener("click", () => {

        document
        .querySelectorAll(".faq-box")
        .forEach(item => {

            if (item !== box) {

                item.classList.remove("open");

            }

        });

        box.classList.toggle("open");

        if (window.ScrollTrigger) {

            ScrollTrigger.refresh();

        }

    });

});

// ======================================
// GSAP SCROLL ANIMATION
// ======================================

if (window.gsap && window.ScrollTrigger) {

    gsap.utils.toArray(".stats-card").forEach((card, i) => {

        gsap.from(card, {

            y: 60,
            opacity: 0,
            duration: .65,
            delay: i * .05,

            scrollTrigger: {

                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
                once: true

            }

        });

    });



    gsap.utils.toArray(".feature-card").forEach((card, i) => {

        gsap.from(card, {

            y: 70,
            opacity: 0,
            duration: .7,
            delay: i * .04,

            scrollTrigger: {

                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
                once: true

            }

        });

    });



    gsap.utils.toArray(".adv-card").forEach((card, i) => {

        gsap.from(card, {

            x: -40,
            opacity: 0,
            duration: .55,
            delay: i * .04,

            scrollTrigger: {

                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
                once: true

            }

        });

    });



    gsap.utils.toArray(".tech-card").forEach((card, i) => {

        gsap.from(card, {

            scale: .9,
            opacity: 0,
            duration: .6,
            delay: i * .05,

            scrollTrigger: {

                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
                once: true

            }

        });

    });



    gsap.utils.toArray(".faq-box").forEach((box, i) => {

        gsap.from(box, {

            y: 40,
            opacity: 0,
            duration: .55,
            delay: i * .05,

            scrollTrigger: {

                trigger: box,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true

            }

        });

    });



    gsap.from(".cta-card", {

        y: 60,
        opacity: 0,
        duration: .8,

        scrollTrigger: {

            trigger: ".cta-card",
            start: "top 88%",
            toggleActions: "play none none none",
            once: true

        }

    });

}
// ======================================
// PART 3
// HOVER + ACTIVE MENU + NAVBAR + READY
// ======================================

// ======================================
// CARD HOVER
// ======================================

if (window.gsap) {

    document
    .querySelectorAll(
        ".stats-card,.feature-card,.adv-card,.tech-card"
    )
    .forEach(card => {

        card.addEventListener("mouseenter", () => {

            gsap.to(card, {
                y: -6,
                duration: .18,
                ease: "power2.out"
            });

        });

        card.addEventListener("mouseleave", () => {

            gsap.to(card, {
                y: 0,
                duration: .18,
                ease: "power2.out"
            });

        });

    });

}

// ======================================
// ACTIVE SIDEBAR
// ======================================

const currentPage =
location.pathname
.split("/")
.pop() || "fitur.html";

document
.querySelectorAll(".sidebar a")
.forEach(link => {

    const href =
    link.getAttribute("href");

    if (href === currentPage) {

        link.classList.add("active");

    } else {

        link.classList.remove("active");

    }

});

// ======================================
// NAVBAR EFFECT
// ======================================

const navbar =
document.querySelector(".navbar");

window.addEventListener(
"scroll",
() => {

    if (!navbar) return;

    if (window.scrollY > 20) {

        navbar.style.boxShadow =
        "0 10px 24px rgba(0,0,0,.12)";

    } else {

        navbar.style.boxShadow =
        "";

    }

},
{
passive:true
}
);

// ======================================
// PAGE READY
// ======================================

window.addEventListener(
"load",
() => {

    document.body.classList.add(
        "page-loaded"
    );

    if (window.ScrollTrigger) {

        ScrollTrigger.refresh(true);

    }

});

// ======================================
// RESIZE FIX
// ======================================

let resizeTimer;

window.addEventListener(
"resize",
() => {

    clearTimeout(resizeTimer);

    resizeTimer =
    setTimeout(() => {

        if (window.ScrollTrigger) {

            ScrollTrigger.refresh(true);

        }

    },250);

});

// ======================================
// IMAGE LOADED FIX
// ======================================

document
.querySelectorAll("img")
.forEach(img => {

    if (img.complete) return;

    img.addEventListener("load", () => {

        if (window.ScrollTrigger) {

            ScrollTrigger.refresh();

        }

    });

});

