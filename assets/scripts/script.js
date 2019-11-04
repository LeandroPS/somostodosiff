import "babel-polyfill";

import axios from "axios";

const getVideos = async () => {
    const videos = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
            params: {
                channelId: "UCXpOsvhSApM_ZPFRfwDsdqw",
                maxResults: 20,
                part: "snippet",
                type: "video",
                key: "AIzaSyBvmrm7UADWfgbgobg_VMDNsSWtKcH63u4"
            }
        }
    );

    return videos.data.items;
};

(async function() {
    // console.log(await getVideos());
    // console.log("hey");

    const videos = await getVideos();

    console.log(videos);

    videos.forEach(item => {
        var video = document.createElement("div");
        video.classList.add("video");
        video.style.backgroundImage = `url(${item.snippet.thumbnails.medium.url})`;

        document.querySelector(".video-container").appendChild(video);
    });
})();
