// ===============================
// RZ DOWNLOADER API
// KYZZ MULTI PLATFORM
// OPTIMIZED RATE LIMIT
// ===============================


const API_KEY = "kyzz42272225040205";

const API_HOST = "https://api.kyzzz.eu.cc";


// CACHE
let apiCache = new Map();


// REQUEST LOCK
let isRequesting = false;


// LAST REQUEST TIME
let lastRequestTime = 0;


// MIN DELAY 1 SECOND
const REQUEST_DELAY = 1100;






// ===============================
// DETECT PLATFORM
// ===============================

function detectPlatform(url){

    url = url.toLowerCase();


    if(
        url.includes("tiktok.com") ||
        url.includes("vt.tiktok.com")
    )
        return "tiktok";


    if(
        url.includes("facebook.com") ||
        url.includes("fb.watch")
    )
        return "facebook";


    if(
        url.includes("instagram.com")
    )
        return "instagram";


    if(
        url.includes("pinterest.") ||
        url.includes("pin.it")
    )
        return "pinterest";


    throw new Error(
        "Platform tidak didukung"
    );

}







// ===============================
// DELAY
// ===============================


function sleep(ms){

    return new Promise(
        resolve=>setTimeout(resolve,ms)
    );

}









// ===============================
// FETCH OPTIMIZED
// ===============================


async function requestAPI(url){


    // BLOCK DOUBLE CLICK

    if(isRequesting){

        throw new Error(
            "Tunggu request sebelumnya selesai"
        );

    }



    isRequesting = true;



    try{


        const now =
        Date.now();



        const diff =
        now - lastRequestTime;



        if(diff < REQUEST_DELAY){


            await sleep(
                REQUEST_DELAY - diff
            );


        }



        lastRequestTime =
        Date.now();





        let response =
        await fetch(url);



        // RATE LIMIT HANDLER

        if(
            response.status === 429
        ){


            await sleep(2000);



            response =
            await fetch(url);


        }






        return await response.json();



    }
    finally{


        isRequesting = false;


    }


}









// ===============================
// GET DOWNLOAD DATA
// ===============================


async function getDownloadData(inputUrl){



    const platform =
    detectPlatform(inputUrl);




    // CACHE KEY

    const cacheKey =
    platform + ":" + inputUrl;





    // CHECK CACHE

    if(apiCache.has(cacheKey)){


        return apiCache.get(cacheKey);


    }








    const endpoint =

    `${API_HOST}/api/download/${platform}?url=${encodeURIComponent(inputUrl)}&apikey=${API_KEY}`;







    const json =
    await requestAPI(endpoint);






    if(!json.status){


        throw new Error(

            json.error ||
            "Gagal mengambil media"

        );


    }





    const result =
    json.result || {};





    let medias = [];








    // ===============================
    // TIKTOK
    // ===============================


    if(platform==="tiktok"){



        if(
            result.hdplay ||
            result.play
        ){


            medias.push({

                type:"video",

                url:
                result.hdplay ||
                result.play


            });


        }




        if(result.wmplay){


            medias.push({

                type:"video",

                url:
                result.wmplay


            });


        }




        if(result.music){


            medias.push({

                type:"audio",

                url:
                result.music


            });


        }


    }










    // ===============================
    // OTHER PLATFORM
    // ===============================


    else{


        let list = [];



        if(Array.isArray(result)){

            list=result;

        }
        else if(
            Array.isArray(result.medias)
        ){

            list=result.medias;

        }
        else if(
            Array.isArray(result.data)
        ){

            list=result.data;

        }






        list.forEach(item=>{


            if(
                item &&
                item.url
            ){


                medias.push({

                    type:

                    (
                        item.type==="audio" ||
                        item.type==="mp3"
                    )

                    ?
                    "audio"
                    :
                    "video",



                    url:item.url


                });


            }


        });



    }









    const data = {


        title:

        result.title ||
        result.caption ||
        "Media Downloader",




        author:


        typeof result.author==="object"

        ?

        (
            result.author.nickname ||
            result.author.unique_id ||
            "Unknown"
        )


        :

        (
            result.author ||
            "Unknown"
        ),




        thumbnail:

        result.cover ||
        result.thumbnail ||
        "",





        source:

        platform.toUpperCase(),




        medias


    };






    // SAVE CACHE 5 MENIT

    apiCache.set(
        cacheKey,
        data
    );


    setTimeout(()=>{


        apiCache.delete(cacheKey);


    },300000);





    return data;


}






window.getDownloadData =
getDownloadData;