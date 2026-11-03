/* SmartGrow site — shared script
   - Injects the header (logos, topic menu, language switch), page-head illustration,
     circular section navigation, pager and partner footer, so pages stay short.
   - Each page sets <body data-page="N" data-art="img:name | svg:name">
     (0 = home, 13 = changes) and may define, before this file:
       window.PAGE_EN = { key: "English text" }   for elements with data-i18n / data-i18n-html
       window.onLang = function(lang){ ... }      to re-render dynamic parts
   - Arrow keys ← → move between pages (ignored while typing or using a slider). */
(function(){
const PAGES=[
 {f:"index.html",th:"หน้าแรก",en:"Home"},
 {f:"01-progress.html",th:"ความก้าวหน้าตั้งแต่ Pitching Day",en:"Progress since Pitching Day",d:["สิ่งที่ทำแล้ว และสิ่งที่ปรับตามข้อเสนอแนะ","What is done and what changed after review"]},
 {f:"02-site.html",th:"พื้นที่และโรงเรือน",en:"Site and greenhouses",d:["ผัง 4 โรงเรือน พื้นที่อบแห้งและหลังเก็บเกี่ยว","Layout of 4 houses, drying and post-harvest area"]},
 {f:"03-production.html",th:"แผนการผลิต",en:"Production plan",d:["ปฏิทิน 2 รอบ เป้าผลผลิต และการทดสอบพันธุ์","Two-cycle calendar, yield targets, variety trials"]},
 {f:"04-market.html",th:"ตลาดและผู้ซื้อ",en:"Market and buyers",d:["กลุ่มลูกค้า ราคาเทียบตลาด MOU และแผน LOI","Segments, price comparison, MOU and LOI plan"]},
 {f:"05-technology.html",th:"เทคโนโลยีและ IoT",en:"Technology and IoT",d:["เซ็นเซอร์ ระบบควบคุม และแดชบอร์ด","Sensors, control system and dashboard"]},
 {f:"06-investment.html",th:"แผนการลงทุน",en:"Investment plan",d:["22 รายการ รวม 2,532,850 บาท","22 items totalling THB 2,532,850"],key:1},
 {f:"07-finance.html",th:"การเงินและตัวปรับสมมติฐาน",en:"Finance and what-if",d:["ลองเปลี่ยนผลผลิตและราคา ดูกำไรและคืนทุน","Change yield and price, see profit and payback"],key:1},
 {f:"08-learning.html",th:"การเรียนรู้ 5 สาขาวิชา",en:"Learning across 5 departments",d:["บทบาทนักศึกษาตลอดห่วงโซ่","Student roles along the chain"]},
 {f:"09-community.html",th:"ชุมชนและความยั่งยืน",en:"Community and sustainability",d:["ศูนย์เรียนรู้ เครือข่าย และกองทุนหมุนเวียน","Learning centre, partners, revolving fund"]},
 {f:"10-risks.html",th:"ความเสี่ยงและแผนรองรับ",en:"Risks and mitigation",d:["8 ความเสี่ยงหลัก","Eight main risks"]},
 {f:"11-timeline.html",th:"กรอบเวลา",en:"Timeline",d:["พ.ย. 2569 – เม.ย. 2571","Nov 2026 – Apr 2028"]},
 {f:"12-questions.html",th:"ประเด็นที่ขอคำปรึกษา",en:"Questions for the advisers",d:["6 คำถามสำหรับคณะผู้เชี่ยวชาญ พร้อมช่องจดคำตอบ","Six questions for the panel, with space for notes"],ask:1},
 {f:"changes.html",th:"สรุปการแก้ไขแผนธุรกิจ",en:"Business-plan revisions"}
];
const READY=new Set(PAGES.map((p,i)=>i));
window.SG={PAGES,READY};

const cur=parseInt(document.body.dataset.page||"0",10);
let lang="th";try{lang=localStorage.getItem("sg-lang")||"th"}catch(e){}
const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- original line illustrations (drawn for this site; colours follow the theme) ---- */
const ART={
 invest:`<svg viewBox="0 0 400 260" role="img"><rect x="0" y="0" width="400" height="260" rx="18" fill="var(--surface)"/>
  <line x1="20" y1="222" x2="380" y2="222" stroke="var(--line)" stroke-width="3"/>
  <path d="M40 222 V140 Q115 70 190 140 V222" fill="color-mix(in srgb,var(--leaf) 10%,transparent)" stroke="var(--leaf)" stroke-width="4"/>
  <path d="M65 222 V118 M115 222 V95 M165 222 V118" stroke="var(--leaf)" stroke-width="2" opacity=".5"/>
  ${[60,88,116,144,172].map(x=>`<g><rect x="${x-9}" y="196" width="18" height="22" rx="3" fill="#fff" stroke="var(--line)"/><path d="M${x} 196 V170" stroke="var(--leaf)" stroke-width="3"/><circle cx="${x-6}" cy="178" r="5" fill="var(--tomato)"/><circle cx="${x+5}" cy="186" r="4.5" fill="var(--tomato)"/></g>`).join("")}
  <g transform="translate(215 120) rotate(-18)"><rect width="92" height="54" rx="4" fill="#2E4A6B"/>${[0,1,2].map(i=>`<line x1="${(i+1)*23}" y1="0" x2="${(i+1)*23}" y2="54" stroke="#9fb6cf" stroke-width="1.5"/>`).join("")}<line x1="0" y1="27" x2="92" y2="27" stroke="#9fb6cf" stroke-width="1.5"/></g>
  <path d="M258 168 V222" stroke="var(--muted)" stroke-width="4"/>
  <circle cx="355" cy="52" r="20" fill="#F2B544"/>
  ${[0,1,2,3,4].map(i=>`<ellipse cx="335" cy="${212-i*14}" rx="30" ry="9" fill="#E9B949" stroke="#B7791F" stroke-width="2"/>`).join("")}
  <text x="335" y="160" font-size="22" font-weight="700" text-anchor="middle" fill="#8A5A12">฿</text></svg>`,
 finance:`<svg viewBox="0 0 400 260" role="img"><rect width="400" height="260" rx="18" fill="var(--surface)"/>
  <line x1="50" y1="215" x2="370" y2="215" stroke="var(--muted)" stroke-width="2"/><line x1="50" y1="40" x2="50" y2="215" stroke="var(--muted)" stroke-width="2"/>
  ${[0,1,2,3].map(i=>`<line x1="50" x2="370" y1="${70+i*36}" y2="${70+i*36}" stroke="var(--line)" stroke-dasharray="4 5"/>`).join("")}
  ${[90,150,210,270,330].map((x,i)=>`<rect x="${x-18}" y="${190-i*28}" width="36" height="${25+i*28}" rx="4" fill="color-mix(in srgb,var(--leaf) ${18+i*8}%,transparent)"/>`).join("")}
  <path d="M90 180 L150 150 L210 128 L270 96 L330 70" fill="none" stroke="var(--tomato)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  ${[[90,180],[150,150],[210,128],[270,96],[330,70]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="var(--tomato)"/><path d="M${p[0]-4} ${p[1]-9} l4 4 l4 -4" stroke="var(--leaf)" stroke-width="2.5" fill="none"/>`).join("")}
  <path d="M110 120 L110 75 M110 75 l-9 10 M110 75 l9 10" stroke="var(--good)" stroke-width="4" fill="none" stroke-linecap="round"/>
  <line x1="50" y1="118" x2="370" y2="118" stroke="var(--ink)" stroke-width="2" stroke-dasharray="8 6" opacity=".6"/></svg>`,
 risk:`<svg viewBox="0 0 400 260" role="img"><rect width="400" height="260" rx="18" fill="var(--surface)"/>
  ${[[60,40],[80,70],[50,95],[95,110],[70,140]].map(p=>`<path d="M${p[0]} ${p[1]} l-6 14" stroke="#6E9BC9" stroke-width="3" stroke-linecap="round"/>`).join("")}
  <circle cx="335" cy="62" r="24" fill="#F2B544"/>${[0,45,90,135,180,225,270,315].map(a=>`<line x1="335" y1="62" x2="${335+38*Math.cos(a*Math.PI/180)}" y2="${62+38*Math.sin(a*Math.PI/180)}" stroke="#F2B544" stroke-width="3" stroke-dasharray="0 28 10"/>`).join("")}
  <path d="M110 120 Q200 30 290 120 Q267 106 245 120 Q222 104 200 120 Q178 104 155 120 Q133 106 110 120 Z" fill="var(--tomato)"/>
  <path d="M200 52 V205 q0 14 -14 14 q-10 0 -12 -10" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
  <rect x="222" y="182" width="44" height="38" rx="5" fill="#fff" stroke="var(--line)"/><path d="M244 182 V140" stroke="var(--leaf)" stroke-width="4"/>
  <path d="M244 160 q-18 -6 -22 -20 q16 2 22 14 M244 150 q16 -8 22 -22 q-16 0 -22 14" fill="var(--leaf)"/>
  <circle cx="234" cy="170" r="7" fill="var(--tomato)"/><circle cx="254" cy="166" r="6" fill="var(--tomato)"/>
  <line x1="20" y1="222" x2="380" y2="222" stroke="var(--line)" stroke-width="3"/></svg>`,
 timeline:`<svg viewBox="0 0 400 260" role="img"><rect width="400" height="260" rx="18" fill="var(--surface)"/>
  <rect x="40" y="46" width="180" height="170" rx="12" fill="#fff" stroke="var(--line)" stroke-width="2"/><rect x="40" y="46" width="180" height="38" rx="12" fill="var(--leaf)"/><rect x="40" y="70" width="180" height="14" fill="var(--leaf)"/>
  <circle cx="80" cy="46" r="6" fill="var(--ink)"/><circle cx="180" cy="46" r="6" fill="var(--ink)"/>
  ${Array.from({length:20},(_,i)=>{const x=58+(i%5)*34,y=100+Math.floor(i/5)*28;const hot=[6,7,8,13,14].includes(i);return `<rect x="${x}" y="${y}" width="24" height="18" rx="4" fill="${hot?"var(--tomato)":"var(--bg)"}"/>`}).join("")}
  <path d="M232 190 C270 190 260 120 300 120 S340 70 352 64" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="6 7"/>
  <circle cx="232" cy="190" r="8" fill="var(--warn)"/><circle cx="300" cy="120" r="8" fill="var(--tomato)"/>
  <path d="M352 64 V22" stroke="var(--ink)" stroke-width="3"/><path d="M352 22 h30 l-8 9 l8 9 h-30 Z" fill="var(--leaf)"/></svg>`,
 ask:`<svg viewBox="0 0 400 260" role="img"><rect width="400" height="260" rx="18" fill="var(--surface)"/>
  <path d="M40 50 h180 a16 16 0 0 1 16 16 v74 a16 16 0 0 1 -16 16 h-120 l-30 26 v-26 h-30 a16 16 0 0 1 -16 -16 v-74 a16 16 0 0 1 16 -16 z" fill="var(--leaf)"/>
  <text x="130" y="132" font-size="78" font-weight="700" text-anchor="middle" fill="#fff" font-family="Georgia,serif">?</text>
  <path d="M190 110 h160 a16 16 0 0 1 16 16 v66 a16 16 0 0 1 -16 16 h-26 v24 l-28 -24 h-106 a16 16 0 0 1 -16 -16 v-66 a16 16 0 0 1 16 -16 z" fill="#fff" stroke="var(--line)" stroke-width="2"/>
  ${[0,1,2].map(i=>`<rect x="${214}" y="${134+i*20}" width="${[120,96,70][i]}" height="9" rx="4.5" fill="var(--line)"/>`).join("")}
  <circle cx="338" cy="186" r="12" fill="var(--tomato)"/><path d="M332 175 l6 5 l6 -5" stroke="var(--leaf)" stroke-width="3" fill="none"/></svg>`,
 doc:`<svg viewBox="0 0 400 260" role="img"><rect width="400" height="260" rx="18" fill="var(--surface)"/>
  <rect x="96" y="28" width="170" height="206" rx="10" fill="#fff" stroke="var(--line)" stroke-width="2" transform="rotate(-5 181 131)"/>
  <rect x="120" y="36" width="170" height="206" rx="10" fill="#fff" stroke="var(--line)" stroke-width="2"/>
  ${[0,1,2,3,4].map(i=>`<path d="M140 ${78+i*32} l8 8 l14 -16" stroke="${i===2?"var(--tomato)":"var(--good)"}" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="172" y="${74+i*32}" width="${[96,80,90,70,84][i]}" height="10" rx="5" fill="var(--line)"/>`).join("")}
  <g transform="translate(300 70) rotate(35)"><rect width="18" height="120" rx="3" fill="var(--tomato)"/><path d="M0 120 L9 142 L18 120 Z" fill="#E8C9A0"/><path d="M6 134 L9 142 L12 134 Z" fill="var(--ink)"/><rect width="18" height="14" rx="3" fill="var(--muted)"/></g></svg>`
};
window.SG.ART=ART;

/* ---- header ---- */
const header=document.createElement("header");header.className="top";
header.innerHTML=`<div class="wrap">
  <a class="brand" href="index.html">
    <span class="logos"><img src="img/logo-college.png" alt="" width="38" height="38"><img src="img/logo-adb.png" alt="" width="34" height="34" class="adb"></span>
    <span class="bt">SmartGrow <small class="sg-college"></small></span></a>
  <div class="top-right">
    <button type="button" class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="sg-menu"></button>
    <div class="lang" role="group" aria-label="Language">
      <button type="button" id="lang-th" aria-pressed="true">ไทย</button>
      <button type="button" id="lang-en" aria-pressed="false">EN</button>
    </div>
  </div></div>`;
const menu=document.createElement("nav");menu.className="menu";menu.id="sg-menu";
document.body.prepend(menu);document.body.prepend(header);

/* ---- page-head illustration ---- */
const art=document.body.dataset.art, ph=document.querySelector(".page-head");
if(ph&&art){
  const el=document.createElement("div");el.className="head-art";
  if(art.startsWith("img:")){el.innerHTML=`<img src="img/${art.slice(4)}.jpg" alt="">`;}
  else{el.innerHTML=ART[art.slice(4)]||"";el.classList.add("svg");}
  ph.appendChild(el);ph.classList.add("has-art");
}

/* ---- partner footer ---- */
const foot=document.querySelector("footer");
if(foot){
  const pf=document.createElement("div");pf.className="partners-foot";
  pf.innerHTML=`<div class="wrap"><img src="img/logo-college.png" alt="" width="44" height="44"><img src="img/logo-adb.png" alt="" width="40" height="40"><span class="pf-t"></span></div>`;
  foot.before(pf);
}

/* ---- pager ---- */
let pager=null;
if(cur!==0){
  pager=document.createElement("nav");pager.className="pager";pager.setAttribute("aria-label","Pages");
  const pf=document.querySelector(".partners-foot")||foot;
  pf?pf.before(pager):document.body.append(pager);
}

/* ---- circular section navigation ---- */
const dots=document.createElement("nav");dots.className="dots";dots.setAttribute("aria-label","Sections");
document.body.append(dots);
let secs=[],obs=null,activeIdx=0;
function collectSections(){
  const main=document.querySelector("main");if(!main)return[];
  const list=[...main.querySelectorAll(":scope > .page-head, :scope > section, :scope > div > section, :scope > div.twocol > aside")];
  return list.filter(el=>el.offsetParent!==null||el.getClientRects().length);
}
function labelOf(el){
  if(el.matches(".page-head,.hero"))return lang==="en"?"Overview":"ภาพรวม";
  const h=el.querySelector("h2")||el.querySelector("h3");
  if(!h)return (el.getAttribute("aria-label")||"").trim();
  const c=h.cloneNode(true);c.querySelectorAll(".to").forEach(x=>x.remove());
  return c.textContent.trim();
}
function buildDots(){
  secs=collectSections();
  if(secs.length<2){dots.innerHTML="";dots.hidden=true;return}
  dots.hidden=false;
  secs.forEach((s,i)=>{if(!s.id)s.id="sec-"+(i+1);s.style.scrollMarginTop="16px"});
  dots.innerHTML=`<div class="dots-label" aria-hidden="true"></div><ol>${secs.map((s,i)=>`<li><a href="#${s.id}" data-i="${i}" aria-label="${(i+1)+". "+labelOf(s).replace(/"/g,"&quot;")}"><span class="n">${i+1}</span><span class="tip">${labelOf(s)}</span></a></li>`).join("")}</ol>`;
  dots.querySelectorAll("a").forEach(a=>a.addEventListener("click",e=>{
    e.preventDefault();const s=secs[+a.dataset.i];
    s.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});
    setActive(+a.dataset.i);
  }));
  if(obs)obs.disconnect();
  obs=new IntersectionObserver(es=>{
    es.forEach(en=>{if(en.isIntersecting){const i=secs.indexOf(en.target);if(i>=0)setActive(i)}});
  },{rootMargin:"-35% 0px -60% 0px"});
  secs.forEach(s=>obs.observe(s));
  setActive(activeIdx<secs.length?activeIdx:0);
}
function setActive(i){
  activeIdx=i;
  dots.querySelectorAll("a").forEach((a,j)=>{a.classList.toggle("on",j===i);if(j===i)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current")});
  const l=dots.querySelector(".dots-label");
  if(l&&secs[i]){const txt=(i+1)+". "+labelOf(secs[i]);if(l.textContent!==txt){l.textContent=txt;l.classList.add("show");clearTimeout(l._t);l._t=setTimeout(()=>l.classList.remove("show"),1800)}}
}
window.addEventListener("scroll",()=>{if(window.scrollY<40&&secs.length)setActive(0)},{passive:true});

/* ---- chrome text ---- */
function href(i){return PAGES[i].f}
function renderChrome(){
  header.querySelector(".sg-college").textContent=lang==="en"?"Chiang Mai College of Agriculture and Technology":"วิทยาลัยเกษตรและเทคโนโลยีเชียงใหม่";
  header.querySelector(".logos img").alt=lang==="en"?"Chiang Mai College of Agriculture and Technology logo":"ตราวิทยาลัยเกษตรและเทคโนโลยีเชียงใหม่";
  header.querySelector(".logos .adb").alt=lang==="en"?"Asian Development Bank logo":"ตราธนาคารพัฒนาเอเชีย (ADB)";
  const mb=header.querySelector("#menu-btn");mb.textContent=lang==="en"?"Topics":"หัวข้อ";
  menu.innerHTML=`<div class="wrap"><ol>${PAGES.map((p,i)=>`<li><a href="${href(i)}"${i===cur?' aria-current="page"':""}><span class="n">${i===0||i===13?"":i}</span><span>${lang==="en"?p.en:p.th}</span></a></li>`).join("")}</ol></div>`;
  const pft=document.querySelector(".partners-foot .pf-t");
  if(pft)pft.textContent=lang==="en"?"Sustainable Agriculture Transformation through Innovative TVET (SATIT) · Asian Development Bank × Office of the Vocational Education Commission × Chiang Mai College of Agriculture and Technology":"โครงการ SATIT · ธนาคารพัฒนาเอเชีย (ADB) × สำนักงานคณะกรรมการการอาชีวศึกษา × วิทยาลัยเกษตรและเทคโนโลยีเชียงใหม่";
  if(pager){
    const prev=cur-1,next=cur+1<PAGES.length?cur+1:null;
    const L=(i)=>(lang==="en"?PAGES[i].en:PAGES[i].th);
    const no=(i)=>(i>0&&i<13?i+". ":"");
    pager.innerHTML=`<div class="wrap">
      <a class="prev" href="${href(prev)}"><span class="lbl">${lang==="en"?"Previous":"ก่อนหน้า"}</span><span class="t">${no(prev)}${L(prev)}</span></a>
      <div class="mid"><a class="home" href="index.html">${lang==="en"?"Back to home":"กลับหน้าแรก"}</a><div class="keys">${lang==="en"?"Use ← → keys to move between pages":"กดปุ่ม ← → เพื่อเปลี่ยนหน้า"}</div></div>
      ${next!==null?`<a class="next" href="${href(next)}"><span class="lbl">${lang==="en"?"Next":"ถัดไป"}</span><span class="t">${no(next)}${L(next)}</span></a>`:"<span></span>"}
    </div>`;
  }
}
header.querySelector("#menu-btn").addEventListener("click",e=>{
  const open=menu.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",open);
});

/* ---- language ---- */
const TH={};
document.querySelectorAll("[data-i18n]").forEach(e=>TH[e.dataset.i18n]=e.textContent);
document.querySelectorAll("[data-i18n-html]").forEach(e=>TH[e.dataset.i18nHtml]=e.innerHTML);
function setLang(l){
  lang=l;const EN=window.PAGE_EN||{};
  document.documentElement.lang=l;
  {const pg=PAGES[cur];const no=cur>0&&cur<13?cur+". ":"";document.title=cur===0?(l==="en"?"SmartGrow · Chiang Mai College":"SmartGrow วษท.เชียงใหม่"):`${no}${l==="en"?pg.en:pg.th} · SmartGrow`;}
  document.querySelectorAll("[data-i18n]").forEach(e=>{const k=e.dataset.i18n;e.textContent=l==="en"&&EN[k]!=null?EN[k]:TH[k]});
  document.querySelectorAll("[data-i18n-html]").forEach(e=>{const k=e.dataset.i18nHtml;e.innerHTML=l==="en"&&EN[k]!=null?EN[k]:TH[k]});
  document.getElementById("lang-th").setAttribute("aria-pressed",l==="th");
  document.getElementById("lang-en").setAttribute("aria-pressed",l==="en");
  try{localStorage.setItem("sg-lang",l)}catch(e){}
  renderChrome();
  if(typeof window.onLang==="function")window.onLang(l);
  buildDots();
}
window.SG.lang=()=>lang;
document.getElementById("lang-th").addEventListener("click",()=>setLang("th"));
document.getElementById("lang-en").addEventListener("click",()=>setLang("en"));

/* ---- keys ---- */
document.addEventListener("keydown",e=>{
  const t=e.target;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable))return;
  if(e.altKey||e.ctrlKey||e.metaKey)return;
  if(e.key==="ArrowRight"&&cur+1<PAGES.length)location.href=href(cur+1);
  if(e.key==="ArrowLeft"&&cur>0)location.href=href(cur-1);
  if(e.key==="Escape"&&menu.classList.contains("open")){menu.classList.remove("open");header.querySelector("#menu-btn").setAttribute("aria-expanded","false")}
});

/* ---- helpers for pages ---- */
window.SG.t=(th,en)=>lang==="en"?en:th;
window.SG.fmt=(n,d=0)=>Number(n).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
setLang(lang);
})();
