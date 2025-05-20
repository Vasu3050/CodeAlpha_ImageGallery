let fav = JSON.parse(localStorage.getItem("favorites")) || [];

const toggleBtn = document.getElementById("themeTogglebtn");
const toggleIcon = document.getElementById("toggleIcon");
const nav = document.getElementById("left");
const cross = document.getElementById("cross");
const cross1 = document.getElementById("cross1");
const menu = document.getElementById("menu");
const mnu = document.getElementById("mnu");
const homeIcon = document.getElementById("homeIcon");
const addIcon = document.getElementById("addIcon");
const lk = document.getElementById("lkIcon");
const gallery = document.getElementById("right");
const rotate = document.getElementById("rotate");
const bin = document.getElementById("bin");
const share = document.getElementById("share");
const preview = document.getElementById("preview");
const lightBox = document.getElementById("lightBox");
const html = document.documentElement;

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slideshowIcon = document.getElementById("slideshowIcon"); // Assuming you have this icon in HTML

let hStatus = 1; // home filled
let lStatus = 0; // like not-filled
let images = [];
let rotateCount = 0;
let showingFavorites = false;
let slideshowInterval = null;
let currentLightboxIndex = -1;
let currentZoom = 1;

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img.lazy");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "100px",
      threshold: 0.1,
    }
  );

  lazyImages.forEach((img) => {
    observer.observe(img);
  });
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(fav));
}

function loadImages(fromFavorites = false) {
  const start = 1;
  const end = 204;
  const sizes = ["small"];
  images = [];

  for (let i = start; i <= end; i++) {
    sizes.forEach((size) => {
      images.push(`${i}_${size}`);
    });
  }

  const imageFolder = "../Images/renamed/";
  const type = ".jpg";
  gallery.innerHTML = "";

  const displayImages = fromFavorites ? fav : images;

  displayImages.forEach((imgName, index) => {
    const wrapper = document.createElement("div");
    wrapper.id = imgName;
    wrapper.className =
      "relative aspect-square overflow-hidden rounded-lg border border-white/20 hover:border-white/40";

    const img = document.createElement("img");
    img.dataset.src = imageFolder + imgName + type;
    img.alt = imgName;
    img.className = "lazy w-full h-full object-cover";
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    function openImg() {
      lightBox.classList.remove("hidden");
      let large = imgName.split("_")[0] + "_large";
      preview.src = imageFolder + large + type;
      html.classList.add("overflow-x-hidden");
      currentLightboxIndex = index;
      rotateCount = 0;
      currentZoom = 1;
      preview.style.transform = `rotate(0deg) scale(1)`;
    }

    img.addEventListener("dblclick", openImg);
    img.addEventListener("touchend", openImg);

    const likeIcon = document.createElement("img");
    const isDark = html.classList.contains("dark");

    likeIcon.src = fav.includes(imgName)
      ? `../icons/like-${isDark ? "dark" : "light"}-1.png`
      : `../icons/like-${isDark ? "dark" : "light"}-0.png`;

    likeIcon.alt = "like icon";
    likeIcon.className =
      "like-icon absolute top-1 right-1 w-4 h-4 z-10 cursor-pointer";

    likeIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const isDark = html.classList.contains("dark");

      if (fav.includes(imgName)) {
        fav = fav.filter((id) => id !== imgName);
        likeIcon.src = `../icons/like-${isDark ? "dark" : "light"}-0.png`;
      } else {
        fav.push(imgName);
        likeIcon.src = `../icons/like-${isDark ? "dark" : "light"}-1.png`;
      }

      saveFavorites();
    });

    wrapper.appendChild(img);
    wrapper.appendChild(likeIcon);
    gallery.appendChild(wrapper);
  });

  lazyLoadImages();
}

function updateIconsBasedOnStatus() {
  const isDark = html.classList.contains("dark");

  homeIcon.src = `../icons/home-${isDark ? "dark" : "light"}-${hStatus}.png`;
  lk.src = `../icons/like-${isDark ? "dark" : "light"}-${lStatus}.png`;
  addIcon.src = isDark ? "../icons/add-dark.png" : "../icons/add-light.png";
  cross.src = isDark ? "../icons/close-dark.png" : "../icons/close-light.png";
  cross1.src = isDark ? "../icons/close-dark.png" : "../icons/close-light.png";
  mnu.src = isDark ? "../icons/menu-dark.png" : "../icons/menu-light.png";
  rotate.src = isDark ? "../icons/rotate-dark.png" : "../icons/rotate-light.png";
  bin.src = isDark ? "../icons/bin-dark.png" : "../icons/bin-light.png";
  share.src = isDark ? "../icons/share-dark.png" : "../icons/share-light.png";
  slideshowIcon.src = isDark ? "../icons/slideshow-dark.png" : "../icons/slideshow-light.png";
  prevBtn.src = isDark ? "../icons/prev-dark.png" : "../icons/prev-light.png";
  nextBtn.src = isDark ? "../icons/next-dark.png" : "../icons/next-light.png";
}

toggleBtn.addEventListener("click", () => {
  html.classList.toggle("dark");
  const isDark = html.classList.contains("dark");

  toggleIcon.innerHTML = isDark
    ? `<img class="max-h-4" src="../icons/sun-icon.png" alt="sun icon">`
    : `<img class="max-h-4" src="../icons/night-icon.png" alt="moon icon">`;

  updateIconsBasedOnStatus();

  loadImages(showingFavorites); // reload with theme-correct icons
});

cross.addEventListener("click", () => {
  nav.classList.toggle("hidden");
  menu.classList.toggle("hidden");
});

menu.addEventListener("click", () => {
  nav.classList.toggle("hidden");
  menu.classList.toggle("hidden");
});

rotate.addEventListener("click", () => {
  rotateCount = (rotateCount + 1) % 4;
  preview.style.transform = `rotate(${rotateCount * 90}deg) scale(${currentZoom})`;
});

bin.addEventListener("click", () => {
  let ele = preview.src.split("/").pop().split(".")[0];
  let idToRemove = ele.split("_")[0] + "_small";

  images = images.filter((img) => img !== idToRemove);
  fav = fav.filter((img) => img !== idToRemove);
  saveFavorites();

  preview.src = "";
  lightBox.classList.add("hidden");
  html.classList.remove("overflow-x-hidden");
  loadImages(showingFavorites);
});

function stopSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    slideshowIcon.classList.remove("active");
  }
}

cross1.addEventListener("click", () => {
  preview.src = "";
  lightBox.classList.add("hidden");
  html.classList.remove("overflow-x-hidden");
  resetZoomAndRotation();
  stopSlideshow();  // Stop slideshow on close icon
});

share.addEventListener("click", () => {
  const imgURL = preview.src;

  if (navigator.share) {
    navigator
      .share({
        title: "Check out this image!",
        text: "Look at this cool photo!",
        url: imgURL,
      })
      .then(() => console.log("Image shared successfully"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    alert("Sharing not supported on this browser.");
  }
});

lk.addEventListener("click", () => {
  lStatus = (lStatus + 1) % 2;
  hStatus = (hStatus + 1) % 2;
  updateIconsBasedOnStatus();

  showingFavorites = !showingFavorites;
  loadImages(showingFavorites);
  stopSlideshow();  // Stop slideshow on like icon click
});

homeIcon.addEventListener("click", () => {
  lStatus = (lStatus + 1) % 2;
  hStatus = (hStatus + 1) % 2;
  updateIconsBasedOnStatus();
  showingFavorites = !showingFavorites;
  loadImages(showingFavorites);
  stopSlideshow();  // Stop slideshow on home icon click
});

// Lightbox Prev/Next Buttons
prevBtn.addEventListener("click", () => {
  if (currentLightboxIndex <= 0) {
    currentLightboxIndex = images.length - 1;
  } else {
    currentLightboxIndex--;
  }
  openLightboxImage(currentLightboxIndex);
});

nextBtn.addEventListener("click", () => {
  if (currentLightboxIndex >= images.length - 1) {
    currentLightboxIndex = 0;
  } else {
    currentLightboxIndex++;
  }
  openLightboxImage(currentLightboxIndex);
});

document.addEventListener('keydown', (event) => {
  if (lightBox.classList.contains('hidden')) return;

  switch(event.key) {
    case 'ArrowRight':
   
      nextBtn.click();
      break;
    case 'ArrowLeft':
     
      prevBtn.click();
      break;
    case 'Escape':
  
      cross1.click();
      break;
    case '+':
    case '=':
     
      currentZoom += 0.1;
      if (currentZoom > 3) currentZoom = 3;
      preview.style.transform = `rotate(${rotateCount * 90}deg) scale(${currentZoom})`;
      break;
    case '-':
    
      currentZoom -= 0.1;
      if (currentZoom < 1) currentZoom = 1;
      preview.style.transform = `rotate(${rotateCount * 90}deg) scale(${currentZoom})`;
      break;
    default:
      break;
  }
});


slideshowIcon.addEventListener("click", () => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    slideshowIcon.classList.remove("active");
  } else {
    slideshowIcon.classList.add("active");
    slideshowInterval = setInterval(() => {
      nextBtn.click();
    }, 2500);
  }
});

// Helper to open lightbox image by index
function openLightboxImage(index) {
  if (!images[index]) return;
  lightBox.classList.remove("hidden");
  const imageFolder = "../Images/renamed/";
  const type = ".jpg";
  const imgName = images[index];
  let large = imgName.split("_")[0] + "_large";

  preview.src = imageFolder + large + type;
  html.classList.add("overflow-x-hidden");
  currentLightboxIndex = index;
  resetZoomAndRotation();
}

// Zoom functionality
preview.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomStep = 0.1;
  if (e.deltaY < 0) {
    // zoom in
    currentZoom += zoomStep;
    if (currentZoom > 3) currentZoom = 3; // max zoom
  } else {
    // zoom out
    currentZoom -= zoomStep;
    if (currentZoom < 1) currentZoom = 1; // min zoom (original size)
  }
  preview.style.transform = `rotate(${rotateCount * 90}deg) scale(${currentZoom})`;
});

function resetZoomAndRotation() {
  rotateCount = 0;
  currentZoom = 1;
  preview.style.transform = `rotate(0deg) scale(1)`;
}

// Keep track of the next new image ID starting from 205
let nextCustomImageId = 205;

// Function to add new image from device
function addImageFromDevice(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;

    // Create a new image ID like "205_small"
    const imgName = `${nextCustomImageId}_small`;

    // Add to images array
    images.push(imgName);

    // Create the wrapper div like in loadImages()
    const wrapper = document.createElement('div');
    wrapper.id = imgName;
    wrapper.className =
      "relative aspect-square overflow-hidden rounded-lg border border-white/20 hover:border-white/40";

    const img = document.createElement('img');
    img.src = dataURL; // direct base64 URL as src
    img.alt = imgName;
    img.className = "w-full h-full object-cover";

    // Open lightbox on dblclick or touchend
    img.addEventListener('dblclick', () => openLightboxImage(images.indexOf(imgName)));
    img.addEventListener('touchend', () => openLightboxImage(images.indexOf(imgName)));

    // Like icon
    const likeIcon = document.createElement('img');
    const isDark = html.classList.contains('dark');
    likeIcon.src = fav.includes(imgName)
      ? `../icons/like-${isDark ? "dark" : "light"}-1.png`
      : `../icons/like-${isDark ? "dark" : "light"}-0.png`;
    likeIcon.alt = "like icon";
    likeIcon.className =
      "like-icon absolute top-1 right-1 w-4 h-4 z-10 cursor-pointer";

    likeIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const isDark = html.classList.contains("dark");

      if (fav.includes(imgName)) {
        fav = fav.filter((id) => id !== imgName);
        likeIcon.src = `../icons/like-${isDark ? "dark" : "light"}-0.png`;
      } else {
        fav.push(imgName);
        likeIcon.src = `../icons/like-${isDark ? "dark" : "light"}-1.png`;
      }

      saveFavorites();
    });

    wrapper.appendChild(img);
    wrapper.appendChild(likeIcon);
    gallery.appendChild(wrapper);

    nextCustomImageId++; // Increment for next added image
  };

  reader.readAsDataURL(file);
}

// Set up file input and addIcon click event
addIcon.addEventListener('click', () => {
  // Create a hidden file input dynamically
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';

  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
      addImageFromDevice(fileInput.files[0]);
    }
  };

  fileInput.click();
});


// Initial load
loadImages();
updateIconsBasedOnStatus();
