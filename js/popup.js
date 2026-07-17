// ===============================
// RZ DOWNLOADER POPUP
// ===============================


// ELEMENT

const videoModal =
document.getElementById("videoModal");

const videoBox =
document.querySelector(".video-box");


const videoPlayer =
document.getElementById("videoPlayer");


const videoTitle =
document.getElementById("videoTitle");


const videoAuthor =
document.getElementById("videoAuthor");


const videoPlatform =
document.getElementById("videoPlatform");


const videoDownload =
document.getElementById("videoDownload");


const audioDownload =
document.getElementById("audioDownload");


const showTitleBtn =
document.getElementById("showTitleBtn");



let titleExpanded = false;


let currentVideo = "";
let currentAudio = "";


let startY = 0;
let moveY = 0;





// ===============================
// OPEN POPUP
// ===============================


function openVideoPopup(data){


if(!data || !videoModal || !videoBox)
return;



let medias =
Array.isArray(data.medias)
?
[...data.medias]
:
[];




// KYZZ SUPPORT


if(data.play){

medias.push({

type:"video",

url:data.play

});

}



if(data.hdplay){

medias.push({

type:"video",

url:data.hdplay

});

}



if(data.music){

medias.push({

type:"audio",

url:data.music

});

}






// TITLE


if(videoTitle){


const fullTitle =
data.title ||
"RZ Downloader";



videoTitle.dataset.full =
fullTitle;



videoTitle.textContent =
fullTitle;



titleExpanded = false;



if(showTitleBtn){



if(fullTitle.length > 80){


videoTitle.classList.add(
"collapsed"
);



showTitleBtn.style.display =
"flex";



showTitleBtn.innerHTML =
`
Show More
<i class="ti ti-chevron-down"></i>
`;



}else{


videoTitle.classList.remove(
"collapsed"
);



showTitleBtn.style.display =
"none";


}



}


}






// SHOW MORE BUTTON


if(showTitleBtn){



showTitleBtn.onclick = ()=>{



titleExpanded =
!titleExpanded;



if(titleExpanded){



videoTitle.classList.remove(
"collapsed"
);



showTitleBtn.innerHTML =
`
Show Less
<i class="ti ti-chevron-up"></i>
`;



}else{


videoTitle.classList.add(
"collapsed"
);



showTitleBtn.innerHTML =
`
Show More
<i class="ti ti-chevron-down"></i>
`;



}



};



}
// ===============================
// AUTHOR & PLATFORM
// ===============================


let author =
data.author || "Unknown";


if(typeof author === "object"){

author =
author.nickname ||
author.unique_id ||
"Unknown";

}



if(videoAuthor)

videoAuthor.textContent =
author;




if(videoPlatform)

videoPlatform.textContent =
data.source ||
"Downloader";







// ===============================
// FIND MEDIA
// ===============================


const video =
medias.find(
m =>
m.type === "video" ||
m.type === "mp4"
);



const audio =
medias.find(
m =>
m.type === "audio" ||
m.type === "mp3"
);






if(video){


currentVideo =
video.url;



if(videoPlayer)

videoPlayer.src =
currentVideo;



if(videoDownload)

videoDownload.style.display =
"flex";



}else{


currentVideo = "";


if(videoDownload)

videoDownload.style.display =
"none";


}







if(audio){


currentAudio =
audio.url;



if(audioDownload)

audioDownload.style.display =
"flex";


}else{


currentAudio = "";


if(audioDownload)

audioDownload.style.display =
"none";


}








// OPEN MODAL


videoModal.classList.add(
"active"
);



document.body.classList.add(
"no-scroll"
);




if(window.gsap){


gsap.fromTo(
videoBox,
{
y:"100%",
opacity:0
},
{
y:0,
opacity:1,
duration:.45,
ease:"back.out"
}

);


}else{


videoBox.style.transform =
"translateY(0)";


}



}









// ===============================
// CLOSE POPUP
// ===============================


function closeVideoPopup(){


if(!videoModal)
return;



if(window.gsap){


gsap.to(
videoBox,
{

y:"100%",

duration:.3,


onComplete(){

hidePopup();

}

});


}else{


hidePopup();


}


}






function hidePopup(){


videoModal.classList.remove(
"active"
);



document.body.classList.remove(
"no-scroll"
);



if(videoPlayer){

videoPlayer.pause();

videoPlayer.src = "";

}



if(videoBox)

videoBox.style.transform = "";



}









// ===============================
// DOWNLOAD
// ===============================


videoDownload?.addEventListener(
"click",
()=>{


if(!currentVideo)
return;



buttonLoading(
videoDownload
);



downloadFile(
  currentVideo,
  `RZ-Video-${randomNumber()}.mp4`
);



});






audioDownload?.addEventListener(
"click",
()=>{


if(!currentAudio)
return;



buttonLoading(
audioDownload
);



downloadFile(
  currentAudio,
  `RZ-Audio-${randomNumber()}.mp3`
);



});








// ===============================
// DOWNLOAD FILE
// ===============================


async function downloadFile(url,name){


try{


const response =
await fetch(url);



const blob =
await response.blob();



const blobUrl =
URL.createObjectURL(blob);



const link =
document.createElement("a");



link.href =
blobUrl;



link.download =
name;



document.body.appendChild(link);



link.click();



link.remove();



URL.revokeObjectURL(blobUrl);



}catch(err){


console.error(
"Download error",
err
);



location.href =
url;



}



}








// ===============================
// BUTTON LOADING
// ===============================


function buttonLoading(btn){
  
  

if(btn.classList.contains("loading"))
return;



const old =
btn.innerHTML;



btn.classList.add(
"loading"
);



btn.innerHTML =
`
<span class="download-loader"></span>
Downloading
`;



setTimeout(()=>{


btn.innerHTML =
old;



btn.classList.remove(
"loading"
);



},1200);



}


function randomNumber(){

    return Math.floor(
        1000 + Math.random() * 9000
    );

}






// ===============================
// BACKDROP CLOSE
// ===============================


videoModal?.addEventListener(
"click",
e=>{


if(e.target === videoModal){

closeVideoPopup();

}


});









// ===============================
// SWIPE DOWN CLOSE
// ===============================


videoBox?.addEventListener(
"touchstart",
e=>{


startY =
e.touches[0].clientY;


});






videoBox?.addEventListener(
"touchmove",
e=>{


moveY =
e.touches[0].clientY - startY;



if(moveY > 0){


videoBox.style.transform =
`translateY(${moveY}px)`;


}


});






videoBox?.addEventListener(
"touchend",
()=>{


if(moveY > 130){


closeVideoPopup();


}else{


videoBox.style.transform =
"translateY(0)";


}



moveY = 0;


});









// ===============================
// GLOBAL
// ===============================


window.openVideoPopup =
openVideoPopup;


window.closeVideoPopup =
closeVideoPopup;