var CATS=["Новое","Популярное","Топ недели","HD","Длинные","Подборки"];
var VIDEOS=[];
(function(){
  var names=["Закат над городом","Ночная съёмка","Первый эфир","Студийная сессия","Live-запись","Лучшее за месяц","Новый формат","Эксклюзив","Backstage","Дубль второй","Полная версия","Короткий клип"];
  for(var i=0;i<24;i++){
    var h=(i*47)%360;
    VIDEOS.push({
      id:i,title:names[i%names.length]+(i>=names.length?" "+(Math.floor(i/names.length)+1):""),
      cat:CATS[i%CATS.length],
      views:Math.round(((i*7919)%900)+40)+" тыс.",
      dur:(5+(i*3)%35)+":"+("0"+((i*17)%60)).slice(-2),
      hd:i%3===0,
      bg:"linear-gradient(135deg,hsl("+h+",55%,28%),hsl("+((h+60)%360)+",60%,12%))"
    });
  }
})();
var state={cat:"Новое",q:""};
var tabs=document.getElementById("tabs"),grid=document.getElementById("grid"),empty=document.getElementById("empty");
function renderTabs(){
  tabs.innerHTML="";
  CATS.forEach(function(c){
    var b=document.createElement("button");
    b.textContent=c;b.setAttribute("aria-pressed",String(c===state.cat));
    b.onclick=function(){state.cat=c;render()};
    tabs.appendChild(b);
  });
}
function render(){
  renderTabs();
  document.getElementById("title").textContent=state.q?"Результаты: "+state.q:state.cat;
  var q=state.q.toLowerCase();
  var list=VIDEOS.filter(function(v){return q?v.title.toLowerCase().indexOf(q)>-1:(state.cat==="Новое"||v.cat===state.cat)});
  grid.innerHTML="";
  list.forEach(function(v){
    var c=document.createElement("button");c.className="card";c.type="button";
    c.innerHTML='<div class="thumb" style="background:'+v.bg+'">'+(v.hd?'<span class="hd">HD</span>':'')+'<span class="dur">'+v.dur+'</span></div><h3></h3><div class="meta">'+v.views+' просмотров</div>';
    c.querySelector("h3").textContent=v.title;
    c.onclick=function(){open(v)};
    grid.appendChild(c);
  });
  empty.classList.toggle("hidden",list.length>0);
}
var dlg=document.getElementById("dlg");
function open(v){
  document.getElementById("pl").style.background=v.bg;
  document.getElementById("dt").textContent=v.title;
  document.getElementById("dm").textContent=v.views+" просмотров · "+v.dur+" · "+v.cat;
  dlg.showModal();
}
document.getElementById("close").onclick=function(){dlg.close()};
document.getElementById("sf").onsubmit=function(e){e.preventDefault();state.q=document.getElementById("q").value.trim();render()};
var gate=document.getElementById("gate");
try{if(sessionStorage.getItem("age18")==="1")gate.classList.add("hidden")}catch(e){}
document.getElementById("yes").onclick=function(){gate.classList.add("hidden");try{sessionStorage.setItem("age18","1")}catch(e){}};
render();

var registerDialog=document.getElementById("register-dialog");
var registerForm=document.getElementById("register-form");
var registerError=document.getElementById("register-error");
var registerSuccess=document.getElementById("register-success");
document.getElementById("register-open").onclick=function(){
  registerError.classList.add("hidden");
  registerSuccess.classList.add("hidden");
  registerDialog.showModal();
  document.getElementById("register-email").focus();
};
document.getElementById("register-close").onclick=function(){registerDialog.close()};
registerDialog.addEventListener("click",function(e){
  if(e.target===registerDialog)registerDialog.close();
});
registerForm.addEventListener("submit",function(e){
  e.preventDefault();
  var password=document.getElementById("register-password").value;
  var confirmation=document.getElementById("register-confirm").value;
  registerError.classList.add("hidden");
  registerSuccess.classList.add("hidden");
  if(password!==confirmation){
    registerError.textContent="Пароли не совпадают. Проверьте оба поля.";
    registerError.classList.remove("hidden");
    document.getElementById("register-confirm").focus();
    return;
  }
  registerSuccess.classList.remove("hidden");
});