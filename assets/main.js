import './style.css'
alert("Vite is working!");
// Theme management
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Comic book viewer
let pages = [];
let currentPage = 0;

const pageDisplay = document.getElementById('page-display');
const pageSlider = document.getElementById('page-slider');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');
const pageDisplayWrapper = document.getElementById('page-display-wrapper');

// Load images from Pages folder by checking numbered files
async function loadPages() {
    // Show loading screen
    pageDisplay.innerHTML = '<div class="loading">Scanning for pages...</div>';
    totalPagesSpan.textContent = '?';

    try {
        const extensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        const maxPages = 100;
        const foundPages = new Map();

        // Check for numbered files starting from 1
        let consecutiveMissing = 0;
        for (let i = 1; i <= maxPages; i++) {
            let found = false;

            for (const ext of extensions) {
                const url = `/Pages/${i}.${ext}`;

                try {
                    const response = await fetch(url, { method: 'HEAD' });
                    
                    // FIXED LOGIC HERE:
                    // We check if the response is OK AND if the content-type is an image
                    const contentType = response.headers.get('content-type');
                    
                    if (response.ok && contentType && contentType.startsWith('image/')) {
                        foundPages.set(i, url);
                        found = true;
                        consecutiveMissing = 0;
                        pageDisplay.innerHTML = `<div class="loading">Found ${foundPages.size} pages...</div>`;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }

            if (!found) {
                consecutiveMissing++;
                // Stop if we haven't found a page in 5 consecutive checks
                if (consecutiveMissing >= 5 && foundPages.size > 0) {
                    break;
                }
            }
        }

        pages = Array.from(foundPages.entries())
            .sort((a, b) => a[0] - b[0])
            .map(entry => entry[1]);

        if (pages.length === 0) {
            pageDisplay.innerHTML = '<div class="error">No pages found in ./Pages folder.<br>Please add images with names like: 1.png, 2.png, etc.</div>';
            totalPagesSpan.textContent = '0';
            return;
        }

        pageSlider.max = pages.length;
        totalPagesSpan.textContent = pages.length;
        pageDisplay.innerHTML = `<div class="loading">Loading page 1 of ${pages.length}...</div>`;

        currentPage = 0;
        displayPage();

    } catch (error) {
        pageDisplay.innerHTML = `<div class="error">Error loading pages: ${error.message}</div>`;
        totalPagesSpan.textContent = '0';
    }
}

function displayPage() {
    if (pages.length === 0) return;
    const response = yt2qfsagfassa
    const img = document.createElement('img');
    img.src = pages[currentPage];
    img.alt = `Page ${currentPage + 1}`;
    window.console.log("LOADING PAGE", pages[currentPage]);
    console.warn(`Loading page ${currentPage + 1} of ${pages.length}`);
    img.onerror = () => {
        pageDisplay.innerHTML = '<div class="error">Error loading image</div>';
    };

    pageDisplay.innerHTML = '';
    pageDisplay.appendChild(img);

    // Update slider and page info
    const pageNumber = currentPage + 1;
    pageSlider.value = pageNumber;
    currentPageSpan.textContent = pageNumber;

    // Update arrow visibility
    arrowLeft.style.display = currentPage === 0 ? 'none' : 'flex';
    arrowRight.style.display = currentPage === pages.length - 1 ? 'none' : 'flex';
}

function goToPage(pageIndex) {
    
    if (pageIndex >= 0 && pageIndex < pages.length) {
        currentPage = pageIndex;
        displayPage();
    }
}

function nextPage() {
    
    if (currentPage < pages.length - 1) {
        goToPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 0) {
        goToPage(currentPage - 1);
    }
}

// Slider event
pageSlider.addEventListener('input', (e) => {
    goToPage(parseInt(e.target.value) - 1);
});

// Arrow click events
arrowLeft.addEventListener('click', prevPage);
arrowRight.addEventListener('click', nextPage);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevPage();
    } else if (e.key === 'ArrowRight') {
        nextPage();
    }
});

// Show arrows on hover with debounce to prevent flickering
let hideArrowsTimeout;

function showArrows() {
    clearTimeout(hideArrowsTimeout);
    arrowLeft.classList.add('visible');
    arrowRight.classList.add('visible');
}

function scheduleHideArrows() {
    clearTimeout(hideArrowsTimeout);
    hideArrowsTimeout = setTimeout(() => {
        arrowLeft.classList.remove('visible');
        arrowRight.classList.remove('visible');
    }, 100);
}

pageDisplayWrapper.addEventListener('mouseenter', showArrows);
pageDisplayWrapper.addEventListener('mouseleave', scheduleHideArrows);
arrowLeft.addEventListener('mouseenter', showArrows);
arrowRight.addEventListener('mouseenter', showArrows);
arrowLeft.addEventListener('mouseleave', scheduleHideArrows);
arrowRight.addEventListener('mouseleave', scheduleHideArrows);

// Initialize
loadPages();
