import "babel-polyfill";

import axios from "axios";

import principles from "./principles";

const qs = document.querySelector.bind(document);
const qsAll = document.querySelectorAll.bind(document);

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
    qs("div.glass").classList.add("show");
    qs("div.video-panel").classList.add("show");

    qs("iframe.video-iframe").setAttribute("src", video);
    qs("main").classList.add("blurred");
};

const closeVideo = () => {
    qs("div.glass").classList.remove("show");
    qs("div.video-panel").classList.remove("show");
    qs("iframe.video-iframe").setAttribute("src", "");

    qs("main").classList.remove("blurred");
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

const setPrinciple = principle => {
    qs("div.principle-panel .alternate .current").classList.remove("current");
    qs("div.principle-panel .alternate .principle").classList.add("current");

    document
        .querySelector("div.principle-panel .principle img")
        .setAttribute("src", principle.pictogram);
    qs("div.principle-panel .principle .title").innerText = principle.title;
    qs("div.principle-panel .principle .content").innerHTML =
        principle.description;
    document
        .querySelector("div.principle-panel a.see-more")
        .setAttribute("href", principle.document);
};

const openSuggestions = () => {
    qs("div.suggestions-panel").classList.add("show");
};

const closePanel = () => {
    document
        .querySelectorAll("div.popup-panel")
        .forEach(element => element.classList.remove("show"));
};

const setSending = () => {
    qs(".suggestions-panel .alternate .form").style.opacity = 0.7;

    qs(".suggestions-panel .alternate .form form button").innerText =
        "Enviando...";
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
                    Nome: qs(".suggestions-panel input.name").value,
                    Email: qs(".suggestions-panel input.email").value,
                    Mensagem: qs(".suggestions-panel textarea.message").value
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

        qs(".video-container").appendChild(video);
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
                            ${item.Data.split("-")[2]}/${
                item.Data.split("-")[1]
            } 
                            ${item.Hora.split(":")[0]}h${
                item.Hora.split(":")[1]
            }
                        </span>
                        <span class="title">${item.Assunto}</span>
                    </div>
                </div>
            `;

            agenda_wrapper.classList.add("agenda-wrapper");

            qs(".agenda-container").appendChild(agenda_wrapper);
        });

    principles.forEach(principle => {
        var principle_wrapper = document.createElement("div");

        principle_wrapper.innerHTML = `
            <a href="${principle.document}" target="_blank">
                <div class="principle">
                    <img
                        class="pictogram"
                        src="${principle.pictogram}"
                    />
                    <div class="text">
                        ${principle.title}
                    </div>
                </div>
            </a>
        `;

        qs(".principles-container").appendChild(principle_wrapper);
    });

    principles
        .filter(principle => principle.title !== "VALORIZAÇÃO DOS SERVIDORES")
        .forEach(principle => {
            const principle_pictogram = document.createElement("img");

            principle_pictogram.setAttribute("src", principle.pictogram);

            principle_pictogram.onclick = () => setPrinciple(principle);

            qs(".principles-pictograms").appendChild(principle_pictogram);
        });

    qsAll("button.carousel-back").forEach(element => {
        element.onclick = () => {
            scrollLeft(element.closest(".carousel"));
        };
    });

    qsAll("button.carousel-forward").forEach(element => {
        element.onclick = () => {
            scrollRight(element.closest(".carousel"));
        };
    });

    qs("div.glass").onclick = closeVideo;

    qs(".mid-banner.suggestions").onclick = openSuggestions;

    qsAll(".close-panel").forEach(element => {
        element.onclick = closePanel;
    });

    qs(".principles-for-students").onclick = () => {
        qs("div.principle-panel .alternate .current").classList.remove(
            "current"
        );
        qs("div.principle-panel .alternate .principles-list").classList.add(
            "current"
        );
        qs("div.principle-panel").classList.add("show");
    };

    qs(".suggestions-panel form").onsubmit = e => {
        e.preventDefault();
        sendSuggestion();
    };
})();
