(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-nav");
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
    navigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "메뉴 열기" : "메뉴 닫기");
    navigation.classList.toggle("is-open", !expanded);
  });
  navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", event => {
    if (event.matches) closeMenu();
  });

  // Without JavaScript, every topic remains readable in the page.
  const topicTablist = document.querySelector("#topic-tabs");
  const topicTabs = Array.from(topicTablist.querySelectorAll('[role="tab"]'));
  const topicPanels = Array.from(document.querySelectorAll("[data-topic-panel]"));
  const topicIds = new Set(topicPanels.map(panel => panel.id));
  const activateTopic = (id, focusTab = false) => {
    if (!topicIds.has(id)) return;
    topicTabs.forEach(tab => {
      const selected = tab.getAttribute("aria-controls") === id;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });
    topicPanels.forEach(panel => { panel.hidden = panel.id !== id; });
  };

  topicTabs.forEach(tab => tab.addEventListener("click", () => {
    activateTopic(tab.getAttribute("aria-controls"));
  }));
  topicTablist.addEventListener("keydown", event => {
    const tab = event.target.closest('[role="tab"]');
    const currentIndex = topicTabs.indexOf(tab);
    if (currentIndex < 0) return;
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % topicTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + topicTabs.length) % topicTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = topicTabs.length - 1;
    else return;
    event.preventDefault();
    activateTopic(topicTabs[nextIndex].getAttribute("aria-controls"), true);
  });
  document.querySelectorAll("[data-topic-link]").forEach(link => {
    link.addEventListener("click", () => activateTopic(link.dataset.topicLink));
  });
  window.addEventListener("hashchange", () => activateTopic(window.location.hash.slice(1)));
  activateTopic(topicIds.has(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "equipment");
  topicTablist.hidden = false;

  const closeOnBackdrop = dialog => {
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        dialog.close();
      }
    });
  };

  const galleryDialog = document.querySelector("#gallery-dialog");
  const galleryImage = document.querySelector("#gallery-image");
  const galleryTitle = document.querySelector("#gallery-title");
  document.querySelectorAll("[data-gallery-image]").forEach(button => {
    button.addEventListener("click", () => {
      const title = button.dataset.galleryTitle;
      galleryTitle.textContent = title;
      galleryImage.src = button.dataset.galleryImage;
      galleryImage.alt = title;
      galleryDialog.showModal();
    });
  });
  galleryDialog.querySelector(".gallery-close").addEventListener("click", () => galleryDialog.close());
  closeOnBackdrop(galleryDialog);

  const consultationDialog = document.querySelector("#consultation-dialog");
  document.querySelectorAll("[data-open-piper]").forEach(button => {
    button.addEventListener("click", () => {
      closeMenu();
      // Official API: https://university.qualified.com/api-49/client-side-api-95
      // Requires the account's installation snippet AND an active Experience.
      if (typeof window.qualified === "function") {
        window.qualified("open");
      } else {
        consultationDialog.showModal();
      }
    });
  });
  consultationDialog.querySelector(".dialog-close").addEventListener("click", () => consultationDialog.close());
  closeOnBackdrop(consultationDialog);
  document.querySelector("#view-guide").addEventListener("click", () => {
    consultationDialog.close();
    document.querySelector("#conversion").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
    });
  });
})();
