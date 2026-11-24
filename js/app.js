const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const overlay = $('#overlay');
const profileMenu = $('#profileMenu');
const feed = $('#feed');
const emptyState = $('#emptyState');
let toastTimer;

const videos = [
  { title: '30 секунд в горах', author: 'Мир вокруг', image: 'https://picsum.photos/seed/zen-short-mountain/720/1280', duration: '0:30', views: '24,8 тыс.' },
  { title: 'Идеи для завтрака', author: 'Вкусно дома', image: 'https://picsum.photos/seed/zen-short-food/720/1280', duration: '0:45', views: '18,2 тыс.' },
  { title: 'Город с высоты', author: 'Фотоистории', image: 'https://picsum.photos/seed/zen-short-city/720/1280', duration: '0:58', views: '9,6 тыс.' },
  { title: 'Быстрый лайфхак', author: 'Полезное каждый день', image: 'https://picsum.photos/seed/zen-short-diy/720/1280', duration: '0:22', views: '31,1 тыс.' }
];

function closePanels() {
  $$('.panel.open').forEach(panel => panel.classList.remove('open'));
  profileMenu.classList.remove('open');
  overlay.classList.remove('open');
  $('#profileButton').setAttribute('aria-expanded', 'false');
}

function openPanel(panelId) {
  closePanels();
  $(`#${panelId}`).classList.add('open');
  overlay.classList.add('open');
  if (panelId === 'searchPanel') window.setTimeout(() => $('#searchInput').focus(), 250);
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2300);
}

function filterFeed(category) {
  let visible = 0;
  $$('.post').forEach(post => {
    const matches = category === 'all' || post.dataset.category.split(' ').includes(category);
    post.hidden = !matches;
    if (matches) visible++;
  });
  $$('[data-feed-section]').forEach(section => {
    section.hidden = category !== 'all' && section.dataset.feedSection !== category;
  });
  emptyState.hidden = visible !== 0 || category === 'all';
  feed.scrollTop = 0;
}

function setCategory(category) {
  $$('.category').forEach(item => item.classList.toggle('active', item.dataset.category === category));
  filterFeed(category);
}

function openVideo(index) {
  const video = videos[index] || videos[0];
  $('#sectionTitle').textContent = 'Короткие видео';
  $('#sectionContent').innerHTML = `
    <div class="video-viewer">
      <div class="viewer-cover" style="background-image:url('${video.image}')">
        <div class="viewer-topline"><span class="viewer-pill">Дзен · Видео</span><button class="viewer-close" data-close aria-label="Закрыть"><i class="fa-solid fa-xmark"></i></button></div>
        <div class="viewer-center"><span class="viewer-play"><i class="fa-solid fa-play"></i></span><strong>${video.title}</strong><small>Демонстрационный просмотр</small></div>
        <div class="viewer-bottom"><div><strong>${video.author}</strong><small>${video.views} просмотров · ${video.duration}</small></div><button class="viewer-follow" data-toast="Вы подписались на автора">Подписаться</button></div>
      </div>
      <p class="prototype-note"><i class="fa-solid fa-circle-info"></i> В прототипе показан сценарий открытия ролика. Реальное видео и свайп между роликами требуют подключения видеоплеера и контентного API.</p>
      <div class="video-next-row">${videos.map((item, i) => `<button class="video-next ${i === index ? 'active' : ''}" data-video="${i}"><img src="${item.image}" alt=""><span>${item.title}</span></button>`).join('')}</div>
    </div>`;
  openPanel('sectionPanel');
}

function renderStudio() {
  $('#sectionTitle').textContent = 'Студия автора';
  $('#sectionContent').innerHTML = `
    <div class="studio-welcome"><div><span class="eyebrow">Панель управления каналом</span><h3>Привет, Максим!</h3><p>Здесь собраны инструменты для управления контентом.</p></div><img src="https://i.pravatar.cc/100?img=11" alt="Аватар автора"></div>
    <div class="studio-stats">
      <article class="stat-card"><span>Просмотры за 30 дней</span><strong>128,4 тыс.</strong><small class="trend"><i class="fa-solid fa-arrow-trend-up"></i> +12,8% к прошлому периоду</small></article>
      <article class="stat-card"><span>Подписчики</span><strong>2 846</strong><small class="trend"><i class="fa-solid fa-arrow-trend-up"></i> +184 за месяц</small></article>
      <article class="stat-card"><span>Публикации</span><strong>36</strong><small>За всё время</small></article>
      <article class="stat-card"><span>Вовлечённость</span><strong>6,4%</strong><small>Среднее значение</small></article>
    </div>
    <div class="studio-section-head"><h3>Управление каналом</h3><span class="demo-tag">Демо-данные</span></div>
    <div class="studio-actions">
      <button class="studio-action" data-studio-action="new"><span class="studio-action-icon"><i class="fa-solid fa-plus"></i></span><span><strong>Создать публикацию</strong><small>Статья, пост или видео</small></span><i class="fa-solid fa-chevron-right"></i></button>
      <button class="studio-action" data-studio-action="content"><span class="studio-action-icon"><i class="fa-regular fa-folder-open"></i></span><span><strong>Мой контент</strong><small>Публикации и черновики</small></span><i class="fa-solid fa-chevron-right"></i></button>
      <button class="studio-action" data-studio-action="analytics"><span class="studio-action-icon"><i class="fa-solid fa-chart-column"></i></span><span><strong>Аналитика</strong><small>Просмотры и аудитория</small></span><i class="fa-solid fa-chevron-right"></i></button>
      <button class="studio-action" data-studio-action="settings"><span class="studio-action-icon"><i class="fa-solid fa-gear"></i></span><span><strong>Настройки канала</strong><small>Описание, оформление и ссылки</small></span><i class="fa-solid fa-chevron-right"></i></button>
    </div>
    <div class="studio-section-head"><h3>Последние публикации</h3><button class="text-link" data-studio-action="content">Все <i class="fa-solid fa-chevron-right"></i></button></div>
    <div class="creator-post"><img src="https://picsum.photos/seed/creator-post-1/180/130" alt="Обложка публикации"><span><strong>Как я создаю контент для Дзена</strong><small>Опубликовано · 12,6 тыс. просмотров</small></span><button aria-label="Редактировать" data-studio-action="edit"><i class="fa-solid fa-ellipsis-vertical"></i></button></div>
    <div class="creator-post"><img src="https://picsum.photos/seed/creator-post-2/180/130" alt="Обложка публикации"><span><strong>Мой рабочий процесс</strong><small>Черновик · Последнее изменение вчера</small></span><button aria-label="Редактировать" data-studio-action="edit"><i class="fa-solid fa-ellipsis-vertical"></i></button></div>
    <p class="prototype-note"><i class="fa-solid fa-circle-info"></i> Статистика и публикации вымышлены и используются только для демонстрации интерфейса.</p>`;
  openPanel('sectionPanel');
}

function renderCreatorAction(action) {
  const titleMap = { new: 'Создать публикацию', content: 'Мой контент', analytics: 'Аналитика канала', settings: 'Настройки канала', edit: 'Редактирование публикации' };
  const contentMap = {
    new: `<div class="creator-form"><label>Формат публикации<select><option>Статья</option><option>Пост</option><option>Видео</option></select></label><label>Название<input type="text" placeholder="Введите заголовок"></label><label>Текст или описание<textarea rows="4" placeholder="Начните писать..."></textarea></label><button class="primary-button" data-toast="Черновик сохранён (демо)">Сохранить черновик</button><button class="secondary-button" data-toast="Публикация подготовлена (демо)">Опубликовать</button></div>`,
    content: `<div class="content-tabs"><button class="active">Опубликовано · 36</button><button>Черновики · 4</button></div><div class="creator-post"><img src="https://picsum.photos/seed/creator-post-1/180/130" alt=""><span><strong>Как я создаю контент для Дзена</strong><small>Опубликовано · 12,6 тыс. просмотров</small></span><button data-studio-action="edit"><i class="fa-solid fa-ellipsis-vertical"></i></button></div><div class="creator-post"><img src="https://picsum.photos/seed/creator-post-2/180/130" alt=""><span><strong>Мой рабочий процесс</strong><small>Черновик · Вчера</small></span><button data-studio-action="edit"><i class="fa-solid fa-ellipsis-vertical"></i></button></div>`,
    analytics: `<div class="analytics-highlight"><span>Просмотры за 30 дней</span><strong>128 420</strong><small class="trend">↑ 12,8% к прошлому периоду</small></div><div class="metric-row"><span>Среднее время просмотра</span><strong>2 мин 18 сек</strong></div><div class="metric-row"><span>Новые подписчики</span><strong>+184</strong></div><div class="metric-row"><span>CTR обложек</span><strong>5,7%</strong></div><p class="prototype-note">Демонстрационные значения. В реальном продукте данные поступают из аналитической системы.</p>`,
    settings: `<div class="creator-form"><label>Название канала<input value="Канал Максима"></label><label>Описание<textarea rows="3">Авторский канал о технологиях, творчестве и повседневной жизни.</textarea></label><label>Ссылка на канал<input value="dzen.ru/maxupshur"></label><button class="primary-button" data-toast="Изменения сохранены (демо)">Сохранить изменения</button></div>`,
    edit: `<div class="creator-form"><label>Название публикации<input value="Как я создаю контент для Дзена"></label><label>Описание<textarea rows="4">Рассказываю о своём процессе создания контента.</textarea></label><button class="primary-button" data-toast="Изменения сохранены (демо)">Сохранить</button><button class="secondary-button" data-toast="Публикация снята с публикации (демо)">Снять с публикации</button></div>`
  };
  $('#sectionTitle').textContent = titleMap[action] || 'Студия автора';
  $('#sectionContent').innerHTML = `<button class="inline-back" data-studio-back><i class="fa-solid fa-arrow-left"></i> Вернуться в студию</button>${contentMap[action] || ''}`;
}

// Profile menu and panels
$('#profileButton').addEventListener('click', () => {
  const willOpen = !profileMenu.classList.contains('open');
  closePanels();
  if (willOpen) {
    profileMenu.classList.add('open');
    overlay.classList.add('open');
    $('#profileButton').setAttribute('aria-expanded', 'true');
  }
});
overlay.addEventListener('click', closePanels);
$$('[data-close]').forEach(button => button.addEventListener('click', closePanels));
$('#searchButton').addEventListener('click', () => openPanel('searchPanel'));
$('#notificationsButton').addEventListener('click', () => openPanel('notificationsPanel'));

// Search through visible feed cards and editorial blocks
$('#searchInput').addEventListener('input', event => {
  const query = event.target.value.trim().toLocaleLowerCase('ru');
  let visible = 0;
  $$('.post').forEach(post => {
    const matches = post.textContent.toLocaleLowerCase('ru').includes(query);
    post.hidden = !matches;
    if (matches) visible++;
  });
  $$('[data-feed-section]').forEach(section => section.hidden = query.length > 0 && !section.textContent.toLocaleLowerCase('ru').includes(query));
  emptyState.hidden = visible !== 0 || query.length === 0;
  if (query.length === 0) filterFeed('all');
});
$$('[data-query]').forEach(button => button.addEventListener('click', () => {
  $('#searchInput').value = button.dataset.query;
  $('#searchInput').dispatchEvent(new Event('input'));
}));

$$('.category').forEach(button => button.addEventListener('click', () => setCategory(button.dataset.category)));

// Feed actions
$$('.like-button').forEach(button => button.addEventListener('click', () => {
  const liked = button.classList.toggle('liked');
  $('i', button).className = liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  button.setAttribute('aria-pressed', String(liked));
}));
$$('.save-button').forEach(button => button.addEventListener('click', () => {
  const saved = button.classList.toggle('saved');
  $('i', button).className = saved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
  button.setAttribute('aria-pressed', String(saved));
  showToast(saved ? 'Добавлено в коллекции' : 'Удалено из коллекций');
}));
$$('[data-follow]').forEach(button => button.addEventListener('click', () => {
  const following = button.classList.toggle('following');
  button.textContent = following ? 'Вы подписаны' : 'Читать';
}));
$$('[data-toast]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.toast)));

// Delegated interactions for dynamically rendered prototype screens
document.addEventListener('click', event => {
  if (event.target.closest('[data-close]')) { closePanels(); return; }
  const toastButton = event.target.closest('[data-toast]');
  if (toastButton) { showToast(toastButton.dataset.toast); return; }
  const videoButton = event.target.closest('[data-video]');
  if (videoButton) { openVideo(Number(videoButton.dataset.video)); return; }
  const newsButton = event.target.closest('[data-news]');
  if (newsButton) {
    const headline = $('strong', newsButton)?.textContent || 'Новость дня';
    $('#sectionTitle').textContent = 'Новость';
    $('#sectionContent').innerHTML = `<div class="news-detail"><span class="eyebrow">Коротко о главном</span><h3>${headline}</h3><p>Это демонстрационная страница новости. Здесь может располагаться краткое содержание, источник, время публикации и переход к полному материалу.</p><button class="primary-button" data-toast="Материал добавлен в закладки (демо)">Сохранить новость</button></div>`;
    openPanel('sectionPanel'); return;
  }
  const sectionButton = event.target.closest('[data-section]');
  if (sectionButton) {
    const key = sectionButton.dataset.section;
    if (key === 'studio') renderStudio();
    else {
      $('#sectionTitle').textContent = key === 'posts' ? 'Мои публикации' : key === 'settings' ? 'Настройки' : 'Мой профиль';
      $('#sectionContent').innerHTML = `<div class="empty-state"><i class="fa-regular fa-user"></i><strong>${key === 'posts' ? 'Мои публикации' : 'Профиль автора'}</strong><span>Демонстрационный раздел прототипа.</span><button class="primary-button" data-section="studio">Открыть студию автора</button></div>`;
      openPanel('sectionPanel');
    }
    return;
  }
  const studioAction = event.target.closest('[data-studio-action]');
  if (studioAction) { renderCreatorAction(studioAction.dataset.studioAction); return; }
  if (event.target.closest('[data-studio-back]')) { renderStudio(); }
  if (event.target.closest('[data-open-videos]')) { openVideo(0); }
});

// Bottom navigation
$$('.nav-item').forEach(button => button.addEventListener('click', () => {
  const tab = button.dataset.tab;
  $$('.nav-item').forEach(item => item.classList.toggle('active', item === button));
  if (tab === 'home') { closePanels(); setCategory('all'); }
  else if (tab === 'video') { closePanels(); setCategory('video'); feed.scrollTop = 0; }
  else if (tab === 'create') { renderCreatorAction('new'); openPanel('sectionPanel'); }
  else if (tab === 'studio') renderStudio();
  else if (tab === 'profile') {
    $('#sectionTitle').textContent = 'Профиль';
    $('#sectionContent').innerHTML = `<div class="profile-page"><img src="https://i.pravatar.cc/120?img=11" alt=""><h3>Максим Апшер</h3><p>@maxupshur</p><button class="primary-button" data-section="studio">Студия автора</button></div>`;
    openPanel('sectionPanel');
  }
}));

document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanels(); });
console.info('Zen Redesign prototype initialized');
