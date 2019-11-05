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

const getAgenda = async () => {
    const agenda = await axios.get(
        `http://somostodosiff.eco.br/admin/api/collections/get/agenda`,
        {
            params: {
                token: "97848f04cace217c4f95d2c885d775"
            }
        }
    );

    return agenda.data.entries;
};

const setVideo = video => {
    document.querySelector("div.glass").classList.add("show");
    document.querySelector("div.video-panel").classList.add("show");

    document.querySelector("iframe.video-iframe").setAttribute("src", video);
    document.querySelector("main").classList.add("blurred");
};

const closeVideo = () => {
    document.querySelector("div.glass").classList.remove("show");
    document.querySelector("div.video-panel").classList.remove("show");
    document.querySelector("iframe.video-iframe").setAttribute("src", "");

    document.querySelector("main").classList.remove("blurred");
};

(async function() {
    const videos = await getVideos();
    const agenda = await getAgenda();

    console.log(videos);

    videos.forEach(item => {
        var video = document.createElement("div");
        video.classList.add("video");
        video.style.backgroundImage = `url(${item.snippet.thumbnails.medium.url})`;
        // video.setAttribute(
        //     "video-address",
        //     "https://www.youtube.com/embed/" + item.id.videoId
        // );
        video.onclick = () =>
            setVideo("https://www.youtube.com/embed/" + item.id.videoId);

        document.querySelector(".video-container").appendChild(video);
    });

    agenda.forEach(item => {
        var agenda_item = document.createElement("div");
        agenda_item.classList.add("agenda");

        var time = document.createElement("span");
        time.classList.add("date");
        time.innerText = `${item.Data.split("-")[1]}/${
            item.Data.split("-")[2]
        } ${item.Hora.split(":")[0]}h${item.Hora.split(":")[1]}`;
        var title = document.createElement("span");
        title.classList.add("title");
        title.innerText = item.Assunto;

        agenda_item.appendChild(time);
        agenda_item.appendChild(title);

        document.querySelector(".agenda-container").appendChild(agenda_item);
    });

    document.querySelector("div.glass").onclick = closeVideo;
})();
