// const apiKey = "AIzaSyCSNPIOJr19PhH01325H8WiiOyzRfP1IsU5WzQ";
const baseUrl = "https://www.googleapis.com/youtube/v3";

const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const container = document.getElementById("container");

function getTheTimeGap(publishTime){
    const publishDate = new Date(publishTime);
    const currDate = new Date();

    const secondGap = (currDate.getTime() - publishDate.getTime()) / 1000 ;

    const secondsPerDay = 60 * 60 * 24 ;
    const secondsPerWeek = 7 * secondsPerDay;
    const secondsPerMonth = 30 * secondsPerDay;
    const secondsPerYear = 365 * secondsPerDay;

    if(secondGap < secondsPerDay){
        return `${Math.ceil(secondGap / 3600)} hrs ago`;
    }
    if(secondGap < secondsPerWeek){
        return `${Math.ceil(secondGap/secondsPerDay)} days ago`;
    }
    if(secondGap < secondsPerMonth){
        return `${Math.ceil(secondGap / secondsPerWeek)} weeks ago`;
    }
    if(secondGap < secondsPerYear){
        return `${Math.ceil(secondGap / secondsPerMonth)} months ago`;
    }
    else{
        return `${Math.ceil(secondGap / secondsPerYear)} years ago`;
    }
}

async function getVideoStat(videoId){
    const endPoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
    try{
        const response = await fetch(endPoint);
        const result = await response.json();
        // console.log(result);
        return result.items[0].statistics;
    }catch(error){
        alert("Error in getVideoStat functioning!");
    }
}

async function getChannelLogo(channelId){
    const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;

  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    console.log(result);

    return result.items[0].snippet.thumbnails.high.url;
  } 
  catch (error) {
    alert("Failed to load channel logo for ", channelId);
  }
}

function navigateToVideoId(videoId){
    // console.log("inside video navigator" , videoId);
    document.cookie = `id=${videoId};path=/play-video.html`;
    window.location.href = "http://127.0.0.1:5500/play-video.html";
}

function renderVideosOnUI(videosList){
    container.innerHTML="";
    videosList.forEach((video)=>{
        const videoContainer = document.createElement("div");
        videoContainer.className = "video";
        videoContainer.innerHTML=`
        <img
        src=${video.snippet.thumbnails.high.url}
        class="thumbnail"
        alt="thumbnail"
      />
      <div class="bottom-container">
        <div class="logo-container">
          <img class="logo" src="${video.channelLogo}" alt="dp-logo" />
        </div>
        <div class="title-container">
          <p class="title">
            ${video.snippet.title}
          </p>
          <p class="gray-text">${video.snippet.channelTitle}</p>
          <p class="gray-text">${video.statistics.viewCount} views . ${getTheTimeGap(video.snippet.publishTime)}</p>
        </div>`;

        videoContainer.addEventListener("click",()=>{
            navigateToVideoId(video.id.videoId);
        });

        container.appendChild(videoContainer);
    });
}
// ${video.statistics.viewCount}

async function fetchSearchResult(searchString){
    const endPoint = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=20`;
    try{
        const response = await fetch(endPoint);
        const result = await response.json();
        
        for(i=0;i<result.items.length;i++){
            let videoId = result.items[i].id.videoId;
            let channelId = result.items[i].snippet.channelId;

            let statistics = await getVideoStat(videoId);
            let channelLogo = await getChannelLogo(channelId);

            result.items[i].statistics = statistics;
            result.items[i].channelLogo = channelLogo;
        }
        renderVideosOnUI(result.items);
    }
    catch(error){
        alert("Error in fetchSearchResult funtioning!");
    }
}

searchButton.addEventListener("click",()=>{
    const searchValue = searchInput.value;
    fetchSearchResult(searchValue);
});

fetchSearchResult();
// getVideoStat("0H51GDlLZQY");
// getChannelLogo("UCJsApDpIBPpRRg0n9ZVmKAQ");