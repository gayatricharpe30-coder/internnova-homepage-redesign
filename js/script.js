/* =========================================================
   InternNova Homepage Redesign - script.js
   Author: Gayatri Charpe

   What this file does:
   1. Mobile menu (open and close)
   2. FAQ accordion (open one answer at a time)
   3. Header shadow when the page is scrolled
   4. Highlight the current section in the menu
   5. Scroll reveal animation (fade in)
   6. Show the current year in the footer

   Smooth scrolling is done in CSS (scroll-behavior: smooth),
   so it is not needed here.
   ========================================================= */


/* ---------- 0. Tell the CSS that JavaScript is working ----------
   The reveal animation in CSS only works when this class is present.
   If JavaScript fails, all content stays visible. */
document.documentElement.classList.add("js");


/* ---------- 1. MOBILE MENU ---------- */
const menuToggle = document.getElementById("menuToggle");   // the hamburger button
const navMenu = document.getElementById("navMenu");         // the menu

// One small function to open or close the menu
function setMenu(isOpen) {
    navMenu.classList.toggle("open", isOpen);                       // add or remove .open
    menuToggle.setAttribute("aria-expanded", String(isOpen));       // tells screen readers the state
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    menuToggle.innerHTML = isOpen ? "&#10005;" : "&#9776;";         // X when open, hamburger when closed
}

// Click on the button: open if closed, close if open
menuToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.contains("open");
    setMenu(!isOpen);
});

// Close the menu after a link is clicked
const menuLinks = navMenu.querySelectorAll("a");
menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        setMenu(false);
    });
});

// Close the menu with the Escape key
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        setMenu(false);
    }
});


/* ---------- 2. FAQ ACCORDION ---------- */
const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        // Find the answer box that belongs to this button
        const answerId = button.getAttribute("aria-controls");
        const answer = document.getElementById(answerId);
        const wasOpen = button.getAttribute("aria-expanded") === "true";

        // First close every answer
        faqButtons.forEach(function (otherButton) {
            const otherAnswer = document.getElementById(otherButton.getAttribute("aria-controls"));
            otherButton.setAttribute("aria-expanded", "false");
            otherAnswer.hidden = true;
        });

        // Then open this one (unless it was already open, then it stays closed)
        if (!wasOpen) {
            button.setAttribute("aria-expanded", "true");
            answer.hidden = false;
        }
    });
});


/* ---------- 3. HEADER SHADOW ON SCROLL ---------- */
const header = document.querySelector(".site-header");

window.addEventListener("scroll", function () {
    // window.scrollY = how many pixels the page has been scrolled
    header.classList.toggle("scrolled", window.scrollY > 10);
});


/* ---------- 4 and 5. OBSERVERS (active menu link + scroll reveal) ----------
   IntersectionObserver tells us when an element enters the screen.
   Very old browsers do not have it, so we check first. */
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-list a");

if ("IntersectionObserver" in window) {

    // 5. Scroll reveal: add the class "visible" when the block is on screen
    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);      // animate only once
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(function (item) {
        revealObserver.observe(item);
    });

    // 4. Active menu link: highlight the link of the section in the middle of the screen
    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                navLinks.forEach(function (link) {
                    const isCurrent = link.getAttribute("href") === "#" + entry.target.id;
                    link.classList.toggle("active", isCurrent);
                });
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });

} else {
    // Fallback: just show everything
    revealItems.forEach(function (item) {
        item.classList.add("visible");
    });
}


/* ---------- 6. CURRENT YEAR IN FOOTER ---------- */
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
