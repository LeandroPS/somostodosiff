import "babel-polyfill";

import axios from "axios";

const getPosts = async () => {
    const posts = await axios.get(
        `http://somostodosiff.eco.br/admin/api/collections/get/mural`,
        {
            params: {
                token: "97848f04cace217c4f95d2c885d775"
            }
        }
    );

    return posts.data.entries;
};

const appendCode = scriptAddress => {
    var script = document.createElement("script");
    script.src = scriptAddress;

    document.head.appendChild(script);
};

(async function() {
    const posts = await getPosts();

    await posts.forEach(item => {
        var post_item = document.createElement("div");
        post_item.classList.add("post-wrapper");

        post_item.innerHTML = item.Codigo;

        document.querySelector(".posts-container").appendChild(post_item);
    });

    appendCode("https://platform.twitter.com/widgets.js");
    appendCode("http://www.instagram.com/embed.js");

    window.instgrm.Embeds.process();
})();
