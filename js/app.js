// ===============================
// RZ DOWNLOADER APP
// ===============================


// LENIS

if(window.Lenis){

const lenis = new Lenis({

    duration:1.1,
    smoothWheel:true,
    smoothTouch:true

});


function raf(time){

    lenis.raf(time);

    requestAnimationFrame(raf);

}


requestAnimationFrame(raf);

}




// ===============================
// SIDEBAR
// ===============================

const menuBtn =
document.getElementById("menuBtn");

const closeMenu =
document.getElementById("closeMenu");

const sidebar =
document.getElementById("sidebar");

const overlay =
document.getElementById("overlay");



function openSidebar(){

    if(!sidebar || !overlay) return;


    sidebar.classList.add("active");

    overlay.classList.add("active");

    document.body.classList.add("no-scroll");

}



function closeSidebar(){

    if(!sidebar || !overlay) return;


    sidebar.classList.remove("active");

    overlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

}



menuBtn?.addEventListener(
"click",
openSidebar
);


closeMenu?.addEventListener(
"click",
closeSidebar
);


overlay?.addEventListener(
"click",
closeSidebar
);







// ===============================
// CONTACT
// ===============================


const contactBtn =
document.getElementById("contactBtn");


const contactMenu =
document.querySelector(".contact-menu");



if(contactBtn && contactMenu){

contactBtn.addEventListener(
"click",
()=>{

    contactMenu.classList.toggle(
        "active"
    );

});

}







// ===============================
// DOWNLOAD
// ===============================


const downloadBtn =
document.getElementById("downloadBtn");


const urlInput =
document.getElementById("urlInput");


const statusText =
document.getElementById("statusText");





if(downloadBtn && urlInput){


downloadBtn.addEventListener(
"click",
async()=>{


const url =
urlInput.value.trim();



if(!url){

    if(window.Swal){

        Swal.fire({

            icon:"warning",
            title:"URL kosong",
            text:"Masukkan link terlebih dahulu"

        });

    }

    return;

}



try{


downloadBtn.disabled=true;


downloadBtn.innerHTML =
"Loading...";



if(statusText)
statusText.innerHTML =
"Mengambil data...";



const data =
await getDownloadData(url);



if(window.openVideoPopup){

    openVideoPopup(data);

}



if(statusText)
statusText.innerHTML =
"Berhasil ditemukan";



}catch(err){


console.error(err);



if(window.Swal){

Swal.fire({

icon:"error",
title:"Gagal",
text:err.message

});

}



if(statusText)
statusText.innerHTML="";



}finally{


downloadBtn.disabled=false;


downloadBtn.innerHTML =
"DOWNLOAD";


}



});


}








// ===============================
// FAQ
// ===============================


document
.querySelectorAll(".faq-box button")
.forEach(btn=>{


btn.addEventListener(
"click",
()=>{


btn.parentElement
.classList.toggle("open");


});


});







// ===============================
// SCROLL REVEAL
// ===============================


if("IntersectionObserver" in window){


const observer =
new IntersectionObserver(
(entries)=>{


entries.forEach(
entry=>{


if(entry.isIntersecting){

entry.target.classList.add(
"show"
);

}


});


},
{
threshold:.15
}
);



document
.querySelectorAll(
".platform-card,.feature-item,.faq-box,.download-card"
)
.forEach(
el=>observer.observe(el)
);


}








// ===============================
// GSAP
// ===============================


if(window.gsap){


gsap.from(
".hero h1",
{

y:60,
opacity:0,
duration:1,
ease:"back.out"

});


gsap.from(
".hero p",
{

y:40,
opacity:0,
delay:.2,
duration:.8

});


}