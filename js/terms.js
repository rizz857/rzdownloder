/* ==========================================
   RZ DOWNLOADER - TERMS
   Neo Brutalism JS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================
       GSAP + ScrollTrigger
    ========================== */
    
    gsap.registerPlugin(ScrollTrigger);
    
    /* ==========================
       LENIS
    ========================== */
    
    const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        smoothTouch: false
    });
    
    lenis.on("scroll", ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
    
    /* ==========================
       SIDEBAR
    ========================== */
    
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuBtn = document.getElementById("menuBtn");
    const closeMenu = document.getElementById("closeMenu");
    
    function openSidebar() {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }
    
    function closeSidebar() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }
    
    menuBtn?.addEventListener("click", openSidebar);
    closeMenu?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);
    
    /* ==========================
       FAQ ACCORDION
    ========================== */
    
    document.querySelectorAll(".faq-item").forEach(item => {
        
        item.querySelector("button").addEventListener("click", () => {
            
            document.querySelectorAll(".faq-item").forEach(other => {
                
                if (other !== item)
                    other.classList.remove("active");
                
            });
            
            item.classList.toggle("active");
            
            ScrollTrigger.refresh();
            
        });
        
    });
    
  const contactFloat = document.querySelector(".contact-float");
const contactBtn = document.getElementById("contactBtn");

contactBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    contactFloat.classList.toggle("active");
});

document.querySelectorAll(".contact-menu a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.stopPropagation();
    });
});

document.addEventListener("click", function(e) {
    
    if (!contactFloat.contains(e.target)) {
        contactFloat.classList.remove("active");
    }
    
});
    
    /* ==========================
       HERO
    ========================== */
    
    gsap.from(".hero > *", {
        
        y: 50,
        opacity: 0,
        stagger: .12,
        duration: .8,
        ease: "power3.out",
        clearProps: "all"
        
    });
    
    /* ==========================
       FEATURE CARD
    ========================== */
    
    gsap.utils.toArray(".feature-card").forEach(card => {
        
        gsap.from(card, {
            
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            
            y: 70,
            opacity: 0,
            scale: .95,
            duration: .7,
            ease: "power3.out",
            clearProps: "all"
            
        });
        
    });
    
    /* ==========================
       FAQ
    ========================== */
    
    gsap.utils.toArray(".faq-item").forEach((item, i) => {
        
        gsap.from(item, {
            
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            
            y: 40,
            opacity: 0,
            delay: i * .03,
            duration: .55,
            ease: "power2.out",
            clearProps: "all"
            
        });
        
    });
    
    /* ==========================
       DISCLAIMER
    ========================== */
    
    gsap.from(".section-head", {
        
        scrollTrigger: {
            trigger: ".section-head",
            start: "top 85%"
        },
        
        y: 40,
        opacity: 0,
        duration: .8,
        clearProps: "all"
        
    });
    
    /* ==========================
       FOOTER
    ========================== */
    
    gsap.from("footer", {
        
        scrollTrigger: {
            trigger: "footer",
            start: "top bottom"
        },
        
        y: 80,
        opacity: 0,
        duration: .8,
        ease: "power3.out",
        clearProps: "all"
        
    });
    
    /* ==========================
       ACTIVE MENU
    ========================== */
    
    document.querySelectorAll(".sidebar a").forEach(link => {
        
        if (link.pathname === location.pathname) {
            
            link.classList.add("active");
            
        }
        
    });
    
    /* ==========================
       REFRESH
    ========================== */
    
    window.addEventListener("load", () => {
        
        ScrollTrigger.refresh();
        
    });
    
});
document.querySelectorAll(".contact-menu a").forEach(a => {

    a.addEventListener("click", () => {

        console.log("CLICK :", a.href);

    });

});