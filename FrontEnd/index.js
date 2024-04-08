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

async function galleryPopup() {
    const contentPopupOne = document.querySelector(".popup_one .content");
    const works = await getWorks();
    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.innerHTML =
        `<a href="#">
        <i class="fa-solid fa-trash-can"></i>
        <img src="${work.imageUrl}" >
        </a>`;
        figure.classList.add("gallery_popupone")
        contentPopupOne.append(figure);

    })
}

function popupTwo(){
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
    <form class="content">
        <div>
            <i class="fa-regular fa-image"></i>
            <img alt="image preview">
            <label for="photo">+ Ajouter photo</label>
            <input type="file" id="photo" name="photo">
        </div>
        <label for="title">Titre</label>
        <input type="text" id="title" name="title"><br><br>
        <select name="category" id="category">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button type="button">Valider</button>
    </form>`;
    popupBox.innerHTML = insidePopup;
    popupBox.classList.add("popup");
    popupBox.classList.add("popup_two");
    popupBox.classList.add("popup_display_none");
    backgroundPopup.appendChild(popupBox);
}

function popupClose(){
    const xMark = document.querySelector(".fa-xmark");
    xMark.addEventListener("click",(event)=>{
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
        popupClose();
        popupTwo();
    }
}

init();
