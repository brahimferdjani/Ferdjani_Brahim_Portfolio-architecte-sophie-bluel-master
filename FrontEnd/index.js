function loginLogout() {
    const li = document.querySelectorAll("header nav ul li");
    if (!localStorage.token) {
        li[2].innerHTML = `<a id="login" href="login.html">Login</a>`;
    } else if (localStorage.token) {
        li[2].innerHTML = `<a id="login" href="login.html">Logout</a>`;
        li[2].addEventListener("click", (event) => {
            localStorage.removeItem("token");
        })
    }
}

async function getWorks() {
    const url = "http://localhost:5678/api/works";
    try {
        const reponse = await fetch(url);
        return await reponse.json();

    } catch (error) {
        console.log(error);
    }
}

async function renderWorks(works) {
    let html = "";
    works.forEach(work => {
        let htmlSegment = `<figure>
                            <img src="${work.imageUrl}" >
                            <figcaption>${work.title}</figcaption>
                        </figure>`;
        html += htmlSegment;
    });

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = html;
}

async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        const reponse = await fetch(url);
        return await reponse.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderCategories() {
    const categories = await getCategories();
    const groupButtons = document.createElement("div");
    groupButtons.classList.add("group_buttons");
    categories.forEach(category => {
        let button = document.createElement("button");
        button.id = `${category.id}`;
        button.innerText = `${category.name}`;
        groupButtons.appendChild(button);
        button.addEventListener("click", () => {
            filtreWorks(category.id);
        });
        const portfolio = document.querySelector("#portfolio");
        const gallery = document.querySelector(".gallery");
        portfolio.insertBefore(groupButtons, gallery);
    });
    const tousButton = document.createElement("button");
    tousButton.innerText = "Tous";
    tousButton.addEventListener("click", async () => {
        const works = await getWorks();
        renderWorks(works);
    });
    groupButtons.prepend(tousButton);
}

async function filtreWorks(id) {
    const works = await getWorks();
    const filtreDeWorks = works.filter(function (work) {
        return work.categoryId === id;
    });
    return renderWorks(filtreDeWorks);
}

function headSettingFontScript() {
    const htmlHead = document.querySelector("head");
    const fontAwesomeScript = document.createElement("script");
    fontAwesomeScript.setAttribute("src", "https://kit.fontawesome.com/53eb4fa86e.js");
    fontAwesomeScript.setAttribute("crossorigin", "anonymous");
    htmlHead.appendChild(fontAwesomeScript);
}

function modeEdition() {
    const html = document.querySelector("html");
    const divBox = document.createElement("div");
    divBox.setAttribute("id", "edition_mode");
    divBox.classList.add("mode_edition");
    const iFontAwesome = `<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>`;
    divBox.innerHTML = iFontAwesome;
    html.prepend(divBox);
}

function buttonEdit() {
    const portfolio = document.querySelector("#portfolio");
    const gallery = document.querySelector(".gallery");
    const divBox = document.createElement("div");
    divBox.classList.add("edit_click");
    const editClick = `<a href="#"><i class="fa-regular fa-pen-to-square"></i>modifier</a>`;
    divBox.innerHTML = editClick;
    portfolio.insertBefore(divBox, gallery);

    divBox.addEventListener("click", (event) => {
        event.preventDefault();
        popupBackground();
    })
}

function popupBackground() {
    const backgroundPopup = document.createElement("div");
    backgroundPopup.setAttribute("id", "popup_background");
    backgroundPopup.classList.add("popupBackground");
    const html = document.querySelector("html");
    html.prepend(backgroundPopup);

    backgroundPopup.addEventListener("click", async () => {
        const popupBackground = document.querySelector(".popupBackground");
        const popup = document.querySelector("#popup");
        html.removeChild(backgroundPopup);
        html.removeChild(popup);
        const works = await getWorks();
        renderWorks(works);
    })

    popupOne();
}

async function popupOne() {
    const html = document.querySelector("html");
    const backgroundPopup = document.querySelector("#popup_background");
    const editionMode = document.querySelector("#edition_mode");
    const popupBox = document.createElement("div");
    const insidePopup =
        `<div class="header">
        <a href="#"><i class="fa-solid fa-arrow-left"></i></a>
        <a href="#"><i class="fa-solid fa-xmark"></i></a>
    </div>
    <div class="title">
        <h3>Galerie Photo</h3><p class="errorMessage"></p>
    </div>
    <div class="content"></div>
    <button type="button">Ajouter une photo</button>`;
    popupBox.innerHTML = insidePopup;
    popupBox.setAttribute("id", "popup");
    popupBox.classList.add("popup_one");
    html.insertBefore(popupBox, editionMode);
    backgroundPopup.classList.add("active");
    galleryPopup();
    popupClose();
    ajouterPhoto();
}

async function galleryPopup() {
    const contentPopupOne = document.querySelector(".popup_one .content");
    const works = await getWorks();
    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.innerHTML =
            `<a href="#">
        <i class="fa-solid fa-trash-can"></i>
        <img src="${work.imageUrl}" id="${work.id}">
        </a>`;
        figure.classList.add("gallery_popupone");
        contentPopupOne.append(figure);
        figure.addEventListener("click", (event) => {
            event.preventDefault();
            fetchDelete(work.id);
            figure.textContent = "";
        })
    })
}

async function fetchDelete(id) {
    const url = "http://localhost:5678/api/works/" + id;
    const localToken = localStorage.token;

    try {
        const reponse = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localToken}` },
        });

        if (!reponse.ok) {
            const errorMsgSelect = document.querySelector("#error_message");

            if (reponse.status == "500") {
                errorMsgSelect.textContent = "Unexpected Behaviour";
            }

            if (reponse.status == "401") {
                errorMsgSelect.textContent = "Unauthorized";
            }
        }

        return await reponse.json();
    } catch (error) {
        console.log("catch de l'appel fetch", error);
    }
}

function ajouterPhoto() {
    const html = document.querySelector("html");
    const popupOne = document.querySelector("#popup");
    const ajoutButton = document.querySelector("#popup button")
    ajoutButton.addEventListener("click", () => {
        html.removeChild(popupOne);
        popupTwo();
    })
}

function popupTwo() {
    const html = document.querySelector("html");
    const editionMode = document.querySelector("#edition_mode");
    const popupBox = document.createElement("div");
    const insidePopup =
        `<div class="header">
        <a href="#"><i class="fa-solid fa-arrow-left"></i></a>
        <a href="#"><i class="fa-solid fa-xmark"></i></a>
    </div>
    <div class="title">
        <h3>Ajout Photo</h3><p class="errorMessage"></p>
    </div>
    <form id="popup_form">
        <div id="blue">
            <div id="blue_content" class="display_blue_content">
                <i class="fa-regular fa-image"></i>
                <label for="image">+ Ajouter photo</label>
                <input type="file" id="image" name="image" accept="image/png, image/jpeg">
                <p>jpg, png : 4mo max</p>
            </div>
        </div>
        <div class="titre_categorie">
            <label for="title">Titre</label>
            <input type="text" id="title" name="title"><br><br>
            <label for="category">Categorie</label>
            <select name="category" id="category">
                <option></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
        </div>
        <button type="submit" id="valider">Valider</button>
    </form>`;
    popupBox.innerHTML = insidePopup;
    popupBox.setAttribute("id", "popup");
    popupBox.classList.add("popup_two");
    html.insertBefore(popupBox, editionMode);
    const form = document.querySelector("#popup_form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
    })
    submitValidation();
    popupClose();
    popupArrow();
    previewChange();
}

function submitValidation() {

    const valider = document.querySelector("#valider");
    const file = document.querySelector("#image");
    const title = document.querySelector("#title");
    const category = document.querySelector("#category");

    if (file.value == "") { 
        valider.setAttribute("disabled", "true");}
    else if (title.value == "") {
        valider.setAttribute("disabled", "true");} 
    else if (category.value == "") {
        valider.setAttribute("disabled", "true");} 
    else {
        valider.setAttribute("disabled", "false");
        valider.classList.add("validation")
    }
}

async function postImage() {
    const form = document.querySelector("#popup_form")
    const url = "http://localhost:5678/api/works";
    const formData = new FormData(form);
    console.log([...formData]);
    const localToken = localStorage.token;
    try {
        const reponse = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${localToken}` },
            body: formData
        });

        if (!reponse.ok) {
            const errorMsgSelect = document.querySelector("#error_message");

            if (reponse.status == "500") {
                errorMsgSelect.textContent = "Unexpected Error";
            }

            if (reponse.status == "401") {
                errorMsgSelect.textContent = "Unauthorized";
            }

            if (reponse.status == "400") {
                errorMsgSelect.textContent = "Bad Request";
            }
        }

        return await reponse.json();
    } catch (error) {
        console.log("catch de l'appel fetch", error);
    }
}

function previewChange() {
    const inputFile = document.querySelector("#image");
    const file = inputFile.files;
    const blue = document.querySelector("#blue");
    const blueContent = document.querySelector("#blue_content");
    inputFile.addEventListener("change", () => {
        if (file) {
            blueContent.classList.add("hide_elements");
            const createImageEl = document.createElement("img");
            createImageEl.setAttribute("id", "image_preview");
            blue.prepend(createImageEl);
            previewImage();
        }
    })
}

function previewImage() {
    const inputFile = document.querySelector("#image");
    const file = inputFile.files;
    if (file) {
        const fileReader = new FileReader();
        const blueImg = document.querySelector("#image_preview");
        fileReader.onload = event => {
            blueImg.setAttribute("src", event.target.result);
        }
        fileReader.readAsDataURL(file[0]);
        console.log(file);
    }
}

function popupArrow() {
    const arrow = document.querySelector("#popup i.fa-arrow-left");
    const html = document.querySelector("html");
    arrow.addEventListener("click", (event) => {
        event.preventDefault();
        const form = document.querySelector("#popup_form");
        form.reset();
        const popup = document.querySelector("#popup");
        html.removeChild(popup);
        popupOne();
    })
}

function popupClose() {
    const xMark = document.querySelector("#popup .fa-xmark");
    const form = document.querySelector("#popup_form");
    const popup = document.querySelector("#popup");
    xMark.addEventListener("click", async (event) => {
        event.preventDefault();
        if (form) { form.reset(); }
        const html = document.querySelector("html");
        const popupBackground = document.querySelector("#popup_background");
        if (html.childNodes[0] == popupBackground) { html.removeChild(popupBackground); }
        html.removeChild(popup);
        const works = await getWorks();
        renderWorks(works);
    })
}

async function init() {
    loginLogout();
    getWorks();
    const works = await getWorks();
    renderWorks(works);
    if (!localStorage.token) {
        getCategories();
        renderCategories();
    } else if (localStorage.token) {
        headSettingFontScript();
        modeEdition();
        buttonEdit();
    }
}

init();