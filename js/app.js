const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const overlay = $("#overlay");
const profileMenu = $("#profileMenu");
const feed = $("#feed");
const emptyState = $("#emptyState");
let toastTimer;

function closePanels() {
  $$(".panel.open").forEach(panel => panel.classList.remove("open"));
  profileMenu.classList.remove("open");
  overlay.classList.remove("open");
  $("#profileButton").setAttribute("aria-expanded", "false");
}

function openPanel(panelId) {
  closePanels();
  $(`#${panelId}`).classList.add("open");
  overlay.classList.add("open");
  if (panelId === "searchPanel") {
    window.setTimeout(() => $("#searchInput").focus(), 250);
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function filterPosts(category) {
  let visible = 0;
  $$(".post").forEach(post => {
    const matches = category === "all" || post.dataset.category.split(" ").includes(category);
    post.hidden = !matches;
    if (matches) visible++;
  });
  emptyState.hidden = visible !== 0;
  feed.scrollTop = 0;
}

function showSection(title, message, icon = "fa-layer-group") {
  closePanels();
  $("#sectionTitle").textContent = title;
  $("#sectionContent").innerHTML = `
    <div class="empty-state">
      <i class="fa-solid ${icon}"></i>
      <strong>${title}</strong>
      <span>${message}</span>
    </div>`;
  $("#sectionPanel").classList.add("open");
  overlay.classList.add("open");
}

// Profile menu and overlay
$("#profileButton").addEventListener("click", () => {
  const willOpen = !profileMenu.classList.contains("open");
  closePanels();
  if (willOpen) {
    profileMenu.classList.add("open");
    overlay.classList.add("open");
    $("#profileButton").setAttribute("aria-expanded", "true");
  }
});
overlay.addEventListener("click", closePanels);
$$("[data-close]").forEach(button => button.addEventListener("click", closePanels));

// Search and notifications
$("#searchButton").addEventListener("click", () => openPanel("searchPanel"));
$("#notificationsButton").addEventListener("click", () => openPanel("notificationsPanel"));

$("#searchInput").addEventListener("input", event => {
  const query = event.target.value.trim().toLocaleLowerCase("ru");
  let visible = 0;
  $$(".post").forEach(post => {
    const matches = post.textContent.toLocaleLowerCase("ru").includes(query);
    post.hidden = !matches;
    if (matches) visible++;
  });
  emptyState.hidden = visible !== 0;
});

$$("[data-query]").forEach(button => {
  button.addEventListener("click", () => {
    const query = button.dataset.query;
    $("#searchInput").value = query;
    $("#searchInput").dispatchEvent(new Event("input"));
  });
});

// Category navigation
$$(".category").forEach(button => {
  button.addEventListener("click", () => {
    $$(".category").forEach(item => item.classList.toggle("active", item === button));
    filterPosts(button.dataset.category);
  });
});

// Like, bookmark, follow and simple action feedback
$$(".like-button").forEach(button => {
  button.addEventListener("click", () => {
    const liked = button.classList.toggle("liked");
    const icon = $("i", button);
    icon.className = liked ? "fa-solid fa-heart" : "fa-regular fa-heart";
    button.setAttribute("aria-pressed", String(liked));
  });
});

$$(".save-button").forEach(button => {
  button.addEventListener("click", () => {
    const saved = button.classList.toggle("saved");
    $("i", button).className = saved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark";
    showToast(saved ? "Добавлено в коллекции" : "Удалено из коллекций");
  });
});

$$("[data-follow]").forEach(button => {
  button.addEventListener("click", () => {
    const following = button.classList.toggle("following");
    button.textContent = following ? "Вы подписаны" : "Читать";
  });
});

$$("[data-toast]").forEach(button => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

// Profile menu actions
$$("[data-section]").forEach(button => {
  button.addEventListener("click", () => {
    showSection(button.dataset.section, "Этот экран пока находится в разработке.", "fa-user");
  });
});

// Bottom navigation
$$(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;
    $$(".nav-item").forEach(item => item.classList.toggle("active", item === button));

    if (tab === "home") {
      closePanels();
      $$(".category").forEach(item => item.classList.toggle("active", item.dataset.category === "all"));
      filterPosts("all");
    } else if (tab === "video") {
      closePanels();
      const videoCategory = $('[data-category="video"]');
      videoCategory.click();
      videoCategory.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    } else if (tab === "create") {
      showSection("Создать публикацию", "Здесь появится редактор публикаций.", "fa-plus");
    } else if (tab === "collections") {
      showSection("Коллекции", "Сохранённые публикации будут отображаться здесь.", "fa-bookmark");
    } else if (tab === "profile") {
      showSection("Профиль", "Личная страница пользователя @maxupshur.", "fa-user");
    }
  });
});

// Escape closes any open popup/panel
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePanels();
});

console.info("Zen Redesign initialized");
