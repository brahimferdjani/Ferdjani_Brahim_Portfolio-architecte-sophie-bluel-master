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
}

function popupBackground() {
    const backgroundPopup = document.createElement("div");
    backgroundPopup.classList.add("popupBackground");
    const html = document.querySelector("html");
    html.prepend(backgroundPopup);
}

function displayPopupBackground() {
    const editClick = document.querySelector(".edit_click");
    editClick.addEventListener("click", (event) => {
        event.preventDefault();
        event.currentTarget.blur();
        const backgroundPopup = document.querySelector(".popupBackground");
        backgroundPopup.classList.toggle("active");
        editClick.classList.add("hidden");
        const popupOne = document.querySelector(".popup_one");
        popupOne.classList.toggle("popup_display_none");
    })
}

async function popupOne() {
    const backgroundPopup = document.querySelector(".popupBackground");
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
    popupBox.classList.add("popup");
    popupBox.classList.add("popup_one");
    popupBox.classList.add("popup_display_none");
    backgroundPopup.appendChild(popupBox);
    galleryPopup();
}

function ajouterPhoto() {
    const ajoutPhoto = document.querySelector(".popup_one button");
    ajoutPhoto.addEventListener("click", () => {
        const popupOne = document.querySelector(".popup_one");
        const popupTwo = document.querySelector(".popup_two");
        popupOne.classList.toggle("popup_display_none");
        popupTwo.classList.toggle("popup_display_none");
    })
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

function popupTwo() {
    const backgroundPopup = document.querySelector(".popupBackground");
    const popupBox = document.createElement("div");
    const insidePopup =
    `<div class="header">
        <a href="#"><i class="fa-solid fa-arrow-left"></i></a>
        <a href="#"><i class="fa-solid fa-xmark"></i></a>
    </div>
    <div class="title">
        <h3>Ajout Photo</h3><p class="errorMessage"></p>
    </div>
    <form>
        <div id="blue">
            <img src="" alt="image_preview" class="hide_elements">
            <div id="blue_content" class="display_blue_content">
                <i class="fa-regular fa-image"></i>
                <img src="" alt="image_preview" class="hide_elements">
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
        <input type="submit" id="valider" class="validation valider" value="Valider">
    </form>`;
    popupBox.innerHTML = insidePopup;
    popupBox.classList.add("popup");
    popupBox.classList.add("popup_two");
    popupBox.classList.add("popup_display_none");
    backgroundPopup.appendChild(popupBox);
}

function submitValidation() {

    const form = document.querySelector(".popup_two form");
    const blue = document.querySelector("#blue");
    const valider = document.querySelector("#valider");
    const file = document.querySelector("#image");
    const title = document.querySelector("#title");
    const category = document.querySelector("#category");

    form.addEventListener("submit", (event)=>{
        event.preventDefault();

        let isValid = true;

        if(file.value == ""){
            isValid = false;
            blue.classList.add("red_flag");
        }

        if(title.value == ""){
            isValid = false;
            title.classList.add("red_flag");
        }

        if(category.value == ""){
            isValid = false;
            category.classList.add("red_flag");
        }

        if(isValid == true){
            //postImage();
            form.submit();
        }
    })

}

function postImage() {
    const form = document.querySelector(".popup_two form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
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
    })

}

function previewChange() {
    const inputFile = document.querySelector("#image");
    const imagePreview = document.querySelector("#blue img");
    const file = inputFile.files;
    const form = document.querySelector(".popup_two form");
    const blueContent = document.querySelector("#blue_content");
    inputFile.addEventListener("change", () => {
        if (file) {
            blueContent.classList.add("hide_elements");
            imagePreview.classList.remove("hide_elements");

            const arrow = document.querySelector(".popup_two i.fa-arrow-left");
            arrow.addEventListener("click", (event) => {
                event.preventDefault();
                form.reset();
                blueContent.classList.remove("hide_elements");
                imagePreview.classList.add("hide_elements");
            })

            const xMark = document.querySelector(".popup_two .fa-xmark");
            xMark.addEventListener("click", (event) => {
                event.preventDefault();
                form.reset();
                blueContent.classList.remove("hide_elements");
                imagePreview.classList.add("hide_elements");
            })
            previewImage();
        }
    })
}

function previewImage() {
    const inputFile = document.querySelector("#image");
    const file = inputFile.files;
    if (file) {
        const fileReader = new FileReader();
        const blueImg = document.querySelector("#blue img");
        fileReader.onload = event => {
            blueImg.setAttribute('src', event.target.result);
        }
        fileReader.readAsDataURL(file[0]);
        console.log(file);
    }
}

function popupTwoArrow() {
    const arrow = document.querySelector(".popup_two i.fa-arrow-left");
    arrow.addEventListener("click", (event) => {
        event.preventDefault();
        const popupTwo = document.querySelector(".popup_two");
        popupTwo.classList.toggle("popup_display_none");
        const popupOne = document.querySelector(".popup_one");
        popupOne.classList.toggle("popup_display_none");
        const form = document.querySelector(".popup_two form");
        form.reset();
    })
}

function popupTwoClose() {
    const xMark = document.querySelector(".popup_two .fa-xmark");
    xMark.addEventListener("click", (event) => {
        event.preventDefault();
        const backgroundPopup = document.querySelector(".popupBackground");
        backgroundPopup.classList.toggle("active");
        const popupOne = document.querySelector(".popup_two");
        popupOne.classList.toggle("popup_display_none");
        const form = document.querySelector(".popup_two form");
        form.reset();
    })
}

function popupOneClose() {
    const xMark = document.querySelector(".popup_one .fa-xmark");
    xMark.addEventListener("click", (event) => {
        event.preventDefault();
        const backgroundPopup = document.querySelector(".popupBackground");
        backgroundPopup.classList.toggle("active");
        const popupOne = document.querySelector(".popup_one");
        popupOne.classList.toggle("popup_display_none");
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
        popupBackground();
        displayPopupBackground();
        popupOne();
        popupOneClose();
        popupTwo();
        submitValidation();
        ajouterPhoto();
        popupTwoClose();
        popupTwoArrow();
        previewChange();
        postImage();
    }
}

init();
