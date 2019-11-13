import "babel-polyfill";

import axios from "axios";

const getVideos = async () => {
    const videos = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
            params: {
                playlistId: "PLYIeFndJrJUn8RJf5o9O1EiaXzuHjiO-N",
                maxResults: 20,
                part: "snippet",
                type: "playlist",
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

const scrollLeft = elem => {
    elem.scroll({
        left: elem.scrollLeft - 340,
        behavior: "smooth"
    });
};

const scrollRight = elem => {
    elem.scroll({
        left: elem.scrollLeft + 340,
        behavior: "smooth"
    });
};

const openSuggestions = () => {
    document.querySelector("div.suggestions-panel").classList.add("show");
};

const closeSuggestions = () => {
    document.querySelector("div.suggestions-panel").classList.remove("show");
};

const setSending = () => {
    document.querySelector(
        ".suggestions-panel .alternate .form"
    ).style.opacity = 0.7;

    document.querySelector(
        ".suggestions-panel .alternate .form form button"
    ).innerText = "Enviando...";
};

const setFeedback = success => {
    document
        .querySelector(".suggestions-panel .alternate .current")
        .classList.remove("current");
    document
        .querySelector(".feedback.feedback-" + (success ? "success" : "fail"))
        .classList.add("current");
};

const sendSuggestion = async () => {
    try {
        setSending();

        await axios.post(
            `http://somostodosiff.eco.br/admin/api/forms/submit/contato`,
            {
                form: {
                    Nome: document.querySelector(
                        ".suggestions-panel input.name"
                    ).value,
                    Email: document.querySelector(
                        ".suggestions-panel input.email"
                    ).value,
                    Mensagem: document.querySelector(
                        ".suggestions-panel textarea.message"
                    ).value
                }
            },
            {
                params: {
                    token: "97848f04cace217c4f95d2c885d775"
                }
            }
        );

        setFeedback(true);
    } catch (error) {
        setFeedback(false);
    }
};

(async function() {
    const videos = await getVideos();
    let agenda = await getAgenda();

    videos.forEach(item => {
        var video = document.createElement("div");
        video.classList.add("video");
        video.style.backgroundImage = `url(${item.snippet.thumbnails.medium.url})`;
        video.onclick = () =>
            setVideo(
                "https://www.youtube.com/embed/" +
                    item.snippet.resourceId.videoId
            );

        document.querySelector(".video-container").appendChild(video);
    });

    agenda
        .filter(item => {
            return new Date(item.Data) >= new Date();
        })
        .sort((first_item, second_item) => {
            return (
                new Date(first_item.Data + " " + first_item.Hora) -
                new Date(second_item.Data + " " + second_item.Hora)
            );
        })
        .forEach(item => {
            var agenda_wrapper = document.createElement("div");

            agenda_wrapper.innerHTML = `
            <div class="agenda">
                <div>
                </div>
                <div class="info">
                    <span class="date">
                        ${item.Data.split("-")[2]}/${item.Data.split("-")[1]} 
                        ${item.Hora.split(":")[0]}h${item.Hora.split(":")[1]}
                    </span>
                    <span class="title">${item.Assunto}</span>
                </div>
            </div>
        `;

            agenda_wrapper.classList.add("agenda-wrapper");

            document
                .querySelector(".agenda-container")
                .appendChild(agenda_wrapper);
        });

    document.querySelectorAll("button.carousel-back").forEach(element => {
        element.onclick = () => {
            scrollLeft(element.closest(".carousel"));
        };
    });

    document.querySelectorAll("button.carousel-forward").forEach(element => {
        element.onclick = () => {
            scrollRight(element.closest(".carousel"));
        };
    });

    document.querySelector("div.glass").onclick = closeVideo;

    document.querySelector(".mid-banner.suggestions").onclick = openSuggestions;

    document.querySelectorAll(".close-suggestions").forEach(element => {
        element.onclick = closeSuggestions;
    });

    document.querySelector(".suggestions-panel form").onsubmit = e => {
        e.preventDefault();
        sendSuggestion();
    };
})();
