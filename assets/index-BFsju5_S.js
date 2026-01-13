(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
var themeToggle = document.getElementById("theme-toggle");
var themeIcon = document.querySelector(".theme-icon");
var htmlElement = document.documentElement;
var savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);
themeToggle.addEventListener("click", () => {
	const newTheme = htmlElement.getAttribute("data-theme") === "light" ? "dark" : "light";
	htmlElement.setAttribute("data-theme", newTheme);
	localStorage.setItem("theme", newTheme);
	updateThemeIcon(newTheme);
});
function updateThemeIcon(theme) {
	themeIcon.textContent = theme === "light" ? "🌙" : "☀️";
}
var pages = [];
var currentPage = 0;
var pageDisplay = document.getElementById("page-display");
var pageSlider = document.getElementById("page-slider");
var currentPageSpan = document.getElementById("current-page");
var totalPagesSpan = document.getElementById("total-pages");
var arrowLeft = document.getElementById("arrow-left");
var arrowRight = document.getElementById("arrow-right");
var pageDisplayWrapper = document.getElementById("page-display-wrapper");
async function loadPages() {
	pageDisplay.innerHTML = "<div class=\"loading\">Scanning for pages...</div>";
	totalPagesSpan.textContent = "?";
	try {
		const extensions = [
			"png",
			"jpg",
			"jpeg",
			"gif",
			"webp"
		];
		const maxPages = 100;
		const foundPages = /* @__PURE__ */ new Map();
		let consecutiveMissing = 0;
		for (let i = 1; i <= maxPages; i++) {
			let found = false;
			for (const ext of extensions) {
				const url = `/Pages/${i}.${ext}`;
				try {
					const response = await fetch(url, { method: "HEAD" });
					const contentType = response.headers.get("content-type");
					if (response.ok && contentType && contentType.startsWith("image/")) {
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
				if (consecutiveMissing >= 5 && foundPages.size > 0) break;
			}
		}
		pages = Array.from(foundPages.entries()).sort((a, b) => a[0] - b[0]).map((entry) => entry[1]);
		if (pages.length === 0) {
			pageDisplay.innerHTML = "<div class=\"error\">No pages found in ./Pages folder.<br>Please add images with names like: 1.png, 2.png, etc.</div>";
			totalPagesSpan.textContent = "0";
			return;
		}
		pageSlider.max = pages.length;
		totalPagesSpan.textContent = pages.length;
		pageDisplay.innerHTML = `<div class="loading">Loading page 1 of ${pages.length}...</div>`;
		currentPage = 0;
		displayPage();
	} catch (error) {
		pageDisplay.innerHTML = `<div class="error">Error loading pages: ${error.message}</div>`;
		totalPagesSpan.textContent = "0";
	}
}
function displayPage() {
	if (pages.length === 0) return;
	const img = document.createElement("img");
	img.src = pages[currentPage];
	img.alt = `Page ${currentPage + 1}`;
	img.onerror = () => {
		pageDisplay.innerHTML = "<div class=\"error\">Error loading image</div>";
	};
	pageDisplay.innerHTML = "";
	pageDisplay.appendChild(img);
	const pageNumber = currentPage + 1;
	pageSlider.value = pageNumber;
	currentPageSpan.textContent = pageNumber;
	arrowLeft.style.display = currentPage === 0 ? "none" : "flex";
	arrowRight.style.display = currentPage === pages.length - 1 ? "none" : "flex";
}
function goToPage(pageIndex) {
	console.log("Calling goToPage", pages[currentPage]);
	if (pageIndex >= 0 && pageIndex < pages.length) {
		currentPage = pageIndex;
		displayPage();
	}
}
function nextPage() {
	console.log("going forward", currentPage, currentPage + 1);
	if (currentPage < pages.length - 1) goToPage(currentPage + 1);
}
function prevPage() {
	console.log("going back", currentPage, currentPage - 1);
	if (currentPage > 0) goToPage(currentPage - 1);
}
pageSlider.addEventListener("input", (e) => {
	goToPage(parseInt(e.target.value) - 1);
});
arrowLeft.addEventListener("click", prevPage);
arrowRight.addEventListener("click", nextPage);
document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft") prevPage();
	else if (e.key === "ArrowRight") nextPage();
});
pageDisplayWrapper.addEventListener("mouseenter", () => {
	arrowLeft.classList.add("visible");
	arrowRight.classList.add("visible");
});
pageDisplayWrapper.addEventListener("mouseleave", () => {
	arrowLeft.classList.remove("visible");
	arrowRight.classList.remove("visible");
});
loadPages();

//# sourceMappingURL=index-BFsju5_S.js.map