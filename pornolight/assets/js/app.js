var CATS = ["Новое", "Популярное", "Топ недели", "HD", "Длинные", "Подборки"];
var VIDEOS = [];

(function () {
  var names = [
    "Закат над городом",
    "Ночная съёмка",
    "Первый эфир",
    "Студийная сессия",
    "Live-запись",
    "Лучшее за месяц",
    "Новый взгляд",
    "Тёмная луна",
    "Золотой кадр",
    "Свет в окне",
    "Премиум ночь",
    "Эмоциональный режим"
  ];

  var creators = [
    "Velvet Studio",
    "Night Pulse",
    "Astra Films",
    "Luxe Room",
    "Golden Line",
    "After Dark"
  ];

  for (var i = 0; i < 24; i++) {
    var h = (i * 47) % 360;
    var cat = CATS[i % CATS.length];
    var badge = i % 4 === 0 ? "HD" : i % 3 === 0 ? "VIP" : "NEW";
    var creator = creators[i % creators.length];
    var title = names[i % names.length] + (i >= names.length ? " " + (Math.floor(i / names.length) + 1) : "");

    VIDEOS.push({
      id: i,
      title: title,
      cat: cat,
      views: Math.round(((i * 7919) % 900) + 40) + " тыс.",
      dur: (5 + (i * 3) % 35) + ":" + ("0" + ((i * 17) % 60)).slice(-2),
      hd: i % 3 === 0,
      badge: badge,
      creator: creator,
      rating: (4.5 + (i % 5) * 0.1).toFixed(1),
      desc: "Премиальный релиз в атмосфере ночного эфира и кинематографичной подачи.",
      bg: "linear-gradient(135deg, hsl(" + h + ", 62%, 28%), hsl(" + ((h + 55) % 360) + ", 62%, 14%))"
    });
  }
})();

var state = { cat: "Новое", q: "" };
var tabs = document.getElementById("tabs");
var grid = document.getElementById("grid");
var empty = document.getElementById("empty");

var featuredBadge = document.getElementById("featured-badge");
var featuredCategory = document.getElementById("featured-category");
var featuredDuration = document.getElementById("featured-duration");
var featuredTitle = document.getElementById("featured-title");
var featuredDesc = document.getElementById("featured-desc");
var featuredPoster = document.getElementById("featured-poster");

function renderCreators() {
  var list = VIDEOS.slice(0, 6).map(function (v) {
    return '<div class="creator">' +
      '<div class="creator-avatar">' + (v.creator.charAt(0).toUpperCase()) + '</div>' +
      '<div><span class="creator-name">' + v.creator + '</span><span class="creator-sub">' + v.views + ' просмотров</span></div>' +
      '</div>';
  }).join("");

  document.getElementById("creator-list").innerHTML = list;
}

function renderFeatured() {
  var active = VIDEOS.find(function (v) {
    return v.cat === state.cat;
  }) || VIDEOS[0];

  featuredBadge.textContent = active.hd ? "HD · 4K" : active.badge + " · 4K";
  featuredCategory.textContent = active.cat;
  featuredDuration.textContent = active.dur;
  featuredTitle.textContent = active.title;
  featuredDesc.textContent = active.desc;
  featuredPoster.style.background = active.bg + ", linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.74))";
}

function renderTabs() {
  tabs.innerHTML = "";
  CATS.forEach(function (c) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = c;
    b.setAttribute("aria-pressed", String(c === state.cat));
    b.onclick = function () {
      state.cat = c;
      render();
    };
    tabs.appendChild(b);
  });
}

function render() {
  renderTabs();
  renderFeatured();

  document.getElementById("title").textContent = state.q ? "Результаты: " + state.q : state.cat;

  var q = state.q.toLowerCase();
  var list = VIDEOS.filter(function (v) {
    return q ? v.title.toLowerCase().indexOf(q) > -1 : (state.cat === "Новое" || v.cat === state.cat);
  });

  grid.innerHTML = list.map(function (v) {
    return '<button class="card" type="button" data-id="' + v.id + '">' +
      '<div class="thumb" style="background:' + v.bg + '">' +
      (v.hd ? '<span class="hd">HD</span>' : '') +
      (v.badge ? '<span class="badge">' + v.badge + '</span>' : '') +
      '<span class="dur">' + v.dur + '</span>' +
      '</div>' +
      '<h3>' + v.title + '</h3>' +
      '<div class="meta"><span>' + v.views + ' · ' + v.rating + '★</span><span>' + v.cat + '</span></div>' +
      '<span class="creator">' + v.creator + '</span>' +
      '</button>';
  }).join("");

  Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (card) {
    card.onclick = function () {
      var id = Number(card.dataset.id);
      var item = VIDEOS.find(function (v) { return v.id === id; });
      if (item) open(item);
    };
  });

  empty.classList.toggle("hidden", list.length > 0);
}

var dlg = document.getElementById("dlg");
function open(v) {
  document.getElementById("pl").style.background = v.bg;
  document.getElementById("dt").textContent = v.title;
  document.getElementById("dm").textContent = v.views + " просмотров · " + v.dur + " · " + v.cat + " · " + v.creator;
  dlg.showModal();
}

document.getElementById("close").onclick = function () { dlg.close(); };

document.getElementById("sf").onsubmit = function (e) {
  e.preventDefault();
  state.q = document.getElementById("q").value.trim();
  render();
};

var gate = document.getElementById("gate");
try { if (sessionStorage.getItem("age18") === "1") gate.classList.add("hidden"); } catch (e) {}

document.getElementById("yes").onclick = function () {
  gate.classList.add("hidden");
  try { sessionStorage.setItem("age18", "1"); } catch (e) {}
};

document.getElementById("hero-play").onclick = function () {
  open(VIDEOS[0]);
};

document.getElementById("hero-categories").onclick = function () {
  document.getElementById("tabs").scrollIntoView({ behavior: "smooth", block: "start" });
};

document.getElementById("featured-action").onclick = function () {
  open(VIDEOS[0]);
};

document.getElementById("featured-more").onclick = function () {
  state.cat = VIDEOS[0].cat;
  render();
  document.getElementById("title").scrollIntoView({ behavior: "smooth", block: "start" });
};

renderCreators();
render();

var registerDialog = document.getElementById("register-dialog");
var registerForm = document.getElementById("register-form");
var registerError = document.getElementById("register-error");
var registerSuccess = document.getElementById("register-success");

document.getElementById("register-open").onclick = function () {
  registerError.classList.add("hidden");
  registerSuccess.classList.add("hidden");
  registerDialog.showModal();
  document.getElementById("register-email").focus();
};

document.getElementById("register-close").onclick = function () { registerDialog.close(); };
registerDialog.addEventListener("click", function (e) {
  if (e.target === registerDialog) registerDialog.close();
});

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var password = document.getElementById("register-password").value;
  var confirmation = document.getElementById("register-confirm").value;
  registerError.classList.add("hidden");
  registerSuccess.classList.add("hidden");
  if (password !== confirmation) {
    registerError.textContent = "Пароли не совпадают. Проверьте оба поля.";
    registerError.classList.remove("hidden");
    document.getElementById("register-confirm").focus();
    return;
  }
  registerSuccess.classList.remove("hidden");
});
