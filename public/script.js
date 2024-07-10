const accessKey = "44857553-e24332d64c38856a80a35c488";
const searchFormHero = document.getElementById("search-form-hero");
const searchBoxHero = document.getElementById("search-box-hero");
const searchResult = document.getElementById("search-result");
const categoryFilter = document.getElementById("category-filter");
const colorFilter = document.getElementById("color-filter");
const applyFiltersBtn = document.getElementById("apply-filters");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const modal = document.getElementById("myModal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementsByClassName("close")[0];

let keyword = "";
let page = 1;
let isFetching = false;

async function fetchImages(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.hits;
    } catch (error) {
        console.error("Error fetching images:", error);
        alert(error.message);
        return [];
    }
}

async function searchImages() {
    if (isFetching || !keyword) return;
    isFetching = true;
    console.log(`Fetching images for keyword: ${keyword} on page: ${page}`);
    
    const category = categoryFilter.value;
    const color = colorFilter.value;
    let url = `https://pixabay.com/api/?key=${accessKey}&q=${encodeURIComponent(keyword)}&page=${page}&per_page=20`;
    if (category) {
        url += `&category=${category}`;
    }
    if (color) {
        url += `&colors=${color}`;
    }

    const images = await fetchImages(url);
    displayImages(images);
    isFetching = false;
}

function displayImages(images) {
    if (page === 1) {
        searchResult.innerHTML = "";
    }
    images.forEach(image => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img-container");

        const imgElement = document.createElement("img");
        imgElement.src = image.webformatURL;
        imgElement.alt = image.tags;
        imgElement.onclick = () => openModal(image.largeImageURL);

        const downloadLink = document.createElement("a");
        downloadLink.href = image.largeImageURL;
        downloadLink.download = image.tags || "download";
        downloadLink.classList.add("download-btn");
        downloadLink.innerHTML = '<span class="button-text">Download</span>';

        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(downloadLink);
        searchResult.appendChild(imgContainer);
    });
}

function loadMoreImages() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        page++;
        searchImages();
    }
}

function openModal(src) {
    modal.style.display = "block";
    modalImg.src = src;
}

function closeModal() {
    modal.style.display = "none";
}

closeBtn.onclick = closeModal;
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
};

window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

searchFormHero.addEventListener("submit", (e) => {
    e.preventDefault();
    keyword = searchBoxHero.value.trim();
    if (!keyword) {
        console.log("Please enter a search term");
        return;
    }
    page = 1;
    searchImages();
});

applyFiltersBtn.addEventListener("click", (e) => {
    e.preventDefault();
    page = 1;
    searchImages();
});

window.addEventListener("scroll", loadMoreImages);
