function loginLogout() {
    const li = document.querySelectorAll("header nav ul li");
    const token = localStorage.getItem("token");
    if (!token) {
        li[2].innerHTML = `<a id="login" href="login.html">Login</a>`;
    } else {
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

    const gallery = document.querySelector("main .gallery");
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
    const filtreWorks = works.filter((work)=> {
        return work.categoryId === id;
    });
    return renderWorks(filtreWorks);
}

function headSettingFontScript() {
    const htmlHead = document.querySelector("head");
    const fontAwesomeScript = document.createElement("script");
    fontAwesomeScript.setAttribute("src", "https://kit.fontawesome.com/53eb4fa86e.js");
    fontAwesomeScript.setAttribute("crossorigin", "anonymous");
    htmlHead.appendChild(fontAwesomeScript);
}

function modeEdition() {
    const body = document.querySelector("body");
    const divBox = document.createElement("div");
    divBox.setAttribute("id", "edition_mode");
    divBox.classList.add("mode_edition");
    const iFontAwesome = `<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>`;
    divBox.innerHTML = iFontAwesome;
    body.prepend(divBox);
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
    const body = document.querySelector("body");
    body.prepend(backgroundPopup);

    backgroundPopup.addEventListener("click", async () => {
        const popupBackground = document.querySelector(".popupBackground");
        const popup = document.querySelector("#popup");
        body.removeChild(backgroundPopup);
        body.removeChild(popup);
        const works = await getWorks();
        renderWorks(works);
    })

    popupOne();
}

async function popupOne() {
    const body = document.querySelector("body");
    const backgroundPopup = document.querySelector("#popup_background");
    const editionMode = document.querySelector("#edition_mode");
    const popupBox = document.createElement("div");
    const insidePopup =
        `<div class="header">
        <a href="#"><i class="fa-solid fa-arrow-left"></i></a>
        <a href="#"><i class="fa-solid fa-xmark"></i></a>
    </div>
    <div class="title">
        <h3>Galerie Photo</h3>
        <p id="error-Message"></p>
    </div>
    <div class="content"></div>
    <button type="button">Ajouter une photo</button>`;
    popupBox.innerHTML = insidePopup;
    popupBox.setAttribute("id", "popup");
    popupBox.classList.add("popup_one");
    body.insertBefore(popupBox, editionMode);
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
        figure.addEventListener("click", async (event) => {
            event.preventDefault();
            fetchDelete(work.id);
            figure.textContent = "";
            const works = await getWorks();
            renderWorks(works);
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
            const errorMsgSelect = document.querySelector("#error-Message");

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
    const body = document.querySelector("body");
    const popupOne = document.querySelector("#popup");
    const ajoutButton = document.querySelector("#popup button")
    ajoutButton.addEventListener("click", () => {
        body.removeChild(popupOne);
        popupTwo();
    })
}

function popupTwo() {
    const body = document.querySelector("body");
    const editionMode = document.querySelector("#edition_mode");
    const popupBox = document.createElement("div");
    const insidePopup =
        `<div class="header">
        <a href="#"><i class="fa-solid fa-arrow-left"></i></a>
        <a href="#"><i class="fa-solid fa-xmark"></i></a>
    </div>
    <div class="title">
        <h3>Ajout Photo</h3>
        <p id="errorMessage"></p>
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
    body.insertBefore(popupBox, editionMode);
    submitValidation();
    popupClose();
    popupArrow();
    previewChange();
}

//XXX taille fichier, message erreur, extension DONE! XXX
//XXX body DONE! XXX 
//XXX work en meme temps que modale DONE! XXX
//valider = fetch, ok = afficher 1er modale

/**
 * function qui permet de saisir tout les champs du formulaire avant de valider
 */
function submitValidation() {

    const valider = document.querySelector("#valider");
    const file = document.querySelector("#image");
    const title = document.querySelector("#title");
    const category = document.querySelector("#category");
    const selectFile = file.files[0];
    const form = document.querySelector("#popup_form");

    valider.setAttribute("disabled", true);

    form.addEventListener("change", () => {
        if (!file.value == "" && !title.value == "" && !category.value == "" && selectFile.size < 4194304 && (selectFile.type == "image/png" || selectFile.type == "image/jpeg")) {
            valider.classList.add("validation");
            valider.setAttribute("disabled", false);
        }
    
        if (!selectFile.size > 4194304) {
            const errorMsgSelect = document.querySelector("#errorMessage");
            errorMsgSelect.textContent = "Fichier trop volumineux";
        }
        if (!selectFile.type == "image/png" || !selectFile.type == "image/jpeg") {
            const errorMsgSelect = document.querySelector("#errorMessage");
            errorMsgSelect.textContent = "Fichier non supporté";
        }
        const errorMessage = document.querySelector("#errorMessage");
        errorMessage.textContent = "";
    })  
}

async function postImage() {
    const file = document.querySelector("#image");
    const title = document.querySelector("#title");
    const category = document.querySelector("#category");
    const selectFile = file.files[0];
    const formData = new FormData();
    formData.append("image", selectFile);
    formData.append("title", title.value);
    formData.append("category", category.value);    
    const url = "http://localhost:5678/api/works";
    console.log([...formData]);
    const localToken = localStorage.token;
    try {
        const reponse = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${localToken}` },
            body: formData
        });

        if (!reponse.ok) {
            const errorMsgSelect = document.querySelector("#errorMessage");

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

/**
 * function qui permet de cacher le texte dans la boite d'image
 */
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

/**
 * function qui permet de afficher l'image et empecher une image volumineuse et de type non supporté 
 */
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
    }
}

/**
 * function qui permet de 
 */
function popupArrow() {
    const arrow = document.querySelector("#popup i.fa-arrow-left");
    const body = document.querySelector("body");
    arrow.addEventListener("click", (event) => {
        event.preventDefault();
        const form = document.querySelector("#popup_form");
        form.reset();
        const popup = document.querySelector("#popup");
        body.removeChild(popup);
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
        const body = document.querySelector("body");
        const popupBackground = document.querySelector("#popup_background");
        if (body.childNodes[0] == popupBackground) { body.removeChild(popupBackground); }
        body.removeChild(popup);
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