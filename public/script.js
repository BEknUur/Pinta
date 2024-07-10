const accessKey = "44857553-e24332d64c38856a80a35c488";
const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const modal = document.getElementById("myModal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementsByClassName("close")[0];

let keyword = "";
let page = 1;
let isFetching = false;

async function searchImages() {
    if (isFetching || !keyword) return;
    isFetching = true;
    console.log(`Fetching images for keyword: ${keyword} on page: ${page}`);
    
    const url = `https://pixabay.com/api/?key=${accessKey}&q=${encodeURIComponent(keyword)}&page=${page}&per_page=20`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        displayImages(data.hits);
    } catch (error) {
        console.error("Error fetching images:", error);
        alert(error.message);
    } finally {
        isFetching = false;
    }
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
    console.log("Scroll event triggered");
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        console.log("Loading more images");
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

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    keyword = searchBox.value.trim();
    if (!keyword) {
        console.log("Please enter a search term");
        return;
    }
    page = 1;
    searchImages();
});

window.addEventListener("scroll", loadMoreImages);
