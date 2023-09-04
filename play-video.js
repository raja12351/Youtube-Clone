window.addEventListener("load",()=>{
    let videoId = document.cookie.split("=")[1];
    console.log("inside js");
    if(YT){
        new YT.Player("video-placeholder",{
            height: "400",
            width: "800",
            videoId,
        })
    }
});