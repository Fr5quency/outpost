/* Outpost: more games. Uses helpers from the main page script ($, $$, tr, store, modal, closeModal, setFS, fsButton, show, S, AR, isAr, esc, toast). */
(function(){
"use strict";
const GAMES=window.OUTPOST_GAMES={}, ACT=window.OUTPOST_ACT={};
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{ for(let i=a.length-1;i>0;i--){ const j=rnd(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const fmtT=ms=>{ const s=Math.floor(ms/1000); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); };
const buzz=p=>{ try{ navigator.vibrate&&navigator.vibrate(p); }catch(e){} };
const T=(en,ar)=>isAr()?ar:en;
const ME=()=>store.get("mpName","")||tr("You");          // one-off strings that need a different Arabic sentence shape

/* shared frame: back button, title area, full-screen button */
function frame(title,body,mid){
  return `<div class="gwrap" id="gameRoot"><div class="gtop"><button class="btn small gback" data-act="gHome">${tr("‹ Games")}</button><div class="gmid">${mid||`<b>${title}</b>`}</div>${fsButton()}</div>${body}</div>`;
}
function afterRender(){ const r=$("#gameRoot"); if(r&&S.gfs) r.classList.add("fs"); }
/* largest size for `el` so the whole game fits on screen without scrolling */
function fit(el,maxW,aspect,minW){
  const root=$("#gameRoot"); if(!root||!el) return 0;
  const other=[...root.children].filter(c=>c!==el&&!c.contains(el)&&(!S.gfs||!c.classList.contains("gtop"))).reduce((t,c)=>t+c.offsetHeight+10,0);
  const availH=S.gfs?window.innerHeight-other-40:window.innerHeight-(root.getBoundingClientRect().top+window.scrollY)-other-$(".tabs").offsetHeight-14;
  const w=Math.max(minW||220,Math.floor(Math.min(root.clientWidth,maxW||600,availH*aspect)));
  return w;
}
function card(id,cls,icon,title,sub,badge){ return `<button class="gcard ${cls}" data-act="g_${id}"><span class="gicon">${icon}</span><span class="gtxt"><b>${tr(title)}</b><span>${tr(sub)}</span>${badge?`<em>${badge}</em>`:""}</span></button>`; }
function register(id,def){ GAMES[id]=def; ACT["g_"+id]=()=>{ S.game=id; def.open&&def.open(); show("games"); }; }
function confetti(){ const c=document.createElement("div"); c.className="confetti"; c.innerHTML=Array.from({length:40},(_,i)=>`<i style="left:${rnd(100)}%;background:hsl(${rnd(360)} 85% 60%);animation-delay:${(i%10)*0.06}s;animation-duration:${1.4+Math.random()}s"></i>`).join(""); document.body.appendChild(c); setTimeout(()=>c.remove(),2800); }

Object.assign(AR,{
"Sudoku":"سودوكو","Classic number puzzle, 4 levels":"لغز الأرقام الكلاسيكي، 4 مستويات","Minesweeper":"كاسحة الألغام","Clear the field without hitting a mine":"نظّف الحقل دون أن تصيب لغمًا",
"Four in a Row":"أربعة في صف","Drop discs, connect four to win":"أسقط الأقراص واجمع أربعة لتفوز","Merge":"دمج الأرقام","Swipe to merge numbers":"اسحب لدمج الأرقام",
"Solitaire":"سوليتير","Classic card patience":"لعبة الورق الفردية الكلاسيكية","Backgammon":"طاولة","Play the bot, first to bear off wins":"العب ضد الكمبيوتر، أول من يُخرج قطعه يفوز",
"Dominoes":"دومينو","Match the ends, first to 100 wins":"طابق الأطراف، أول من يصل إلى 100 يفوز",
"Easy":"سهل","Medium":"متوسط","Hard":"صعب","Expert":"خبير","New game":"لعبة جديدة","Choose difficulty":"اختر المستوى","Undo":"تراجع","Erase":"مسح","Notes":"ملاحظات","Hint":"تلميح",
"Mistakes":"الأخطاء","Solved!":"تم الحل!","Time":"الوقت","Best time":"أفضل وقت","Play again":"العب مرة أخرى","Cancel":"إلغاء","Dig":"حفر","Flag":"علم","Boom!":"انفجار!",
"You cleared the field!":"نظّفت الحقل!","Tap a cell to start. Long-press to place a flag.":"اضغط خانة للبدء. اضغط مطولًا لوضع علم.","Your turn":"دورك","Bot is thinking…":"الكمبيوتر يفكر…",
"You win!":"فزت!","Bot wins":"فاز الكمبيوتر","Draw":"تعادل","You":"أنت","Bot":"الكمبيوتر","Score":"النتيجة","Best":"الأفضل","No more moves":"لا توجد حركات أخرى",
"Swipe up, down, left or right":"اسحب للأعلى أو الأسفل أو اليمين أو اليسار","Try again":"حاول مرة أخرى","Keep going":"تابع","Draw 1":"سحب ورقة","Draw 3":"سحب 3 أوراق","Moves":"الحركات",
"Auto finish":"إنهاء تلقائي","You won!":"فزت!","Tap a card to move it. Tap the deck to draw.":"اضغط الورقة لتحريكها. اضغط الكومة للسحب.","Roll":"ارمِ النرد","Undo moves":"تراجع",
"No legal moves":"لا توجد حركات ممكنة","Bot has no moves":"لا حركات للكمبيوتر","Tap a checker, then where to move it.":"اضغط قطعة ثم المكان الذي تنقلها إليه.","Next game":"لعبة جديدة",
"Draw a tile":"اسحب حجرًا","Pass":"تخطَّ","Round over":"انتهت الجولة","Next round":"الجولة التالية","Match won!":"فزت بالمباراة!","Bot won the match":"فاز الكمبيوتر بالمباراة",
"Tap a tile to play it.":"اضغط حجرًا لتلعبه.","Choose an end":"اختر الطرف","Boneyard":"المخزون","Blocked: lowest hand wins":"مغلقة: الأقل نقاطًا يفوز","Restart":"إعادة البدء","Start over":"ابدأ من جديد",
"Your current game will be lost.":"ستفقد اللعبة الحالية.","You'll play the next person who taps Play online. 30 seconds per move.":"ستلعب ضد أول شخص يضغط «العب أونلاين». 30 ثانية لكل نقلة.","Start a new game?":"بدء لعبة جديدة؟"
});

/* =================== SUDOKU =================== */
const pc=m=>{ let n=0; while(m){ m&=m-1; n++; } return n; };
const boxOf=i=>(((i/27)|0)*3)+(((i%9)/3)|0);
function suSolve(g,limit,randomize){ // counts solutions up to `limit`; with randomize, returns a filled grid
  const a=g.slice(), R=new Int16Array(9), C=new Int16Array(9), B=new Int16Array(9); let n=0, first=null;
  for(let i=0;i<81;i++){ const v=a[i]; if(v){ const bit=1<<v, r=(i/9)|0, c=i%9, b=boxOf(i); if((R[r]|C[c]|B[b])&bit) return {n:0}; R[r]|=bit; C[c]|=bit; B[b]|=bit; } }
  (function rec(){
    let best=-1, bm=0, bc=10;
    for(let i=0;i<81;i++) if(!a[i]){ const m=~(R[(i/9)|0]|C[i%9]|B[boxOf(i)])&0x3FE, k=pc(m); if(k<bc){ bc=k; best=i; bm=m; if(!k) return false; } }
    if(best<0){ n++; if(!first) first=a.slice(); return n>=limit; }
    const r=(best/9)|0, c=best%9, b=boxOf(best); let vals=[1,2,3,4,5,6,7,8,9].filter(v=>bm&(1<<v)); if(randomize) shuffle(vals);
    for(const v of vals){ const bit=1<<v; a[best]=v; R[r]|=bit; C[c]|=bit; B[b]|=bit; if(rec()) return true; a[best]=0; R[r]^=bit; C[c]^=bit; B[b]^=bit; }
    return false; })();
  return {n,grid:first};
}
const SU_CLUES={easy:40,medium:33,hard:28,expert:24};
function suMake(diff){
  const sol=suSolve(Array(81).fill(0),1,true).grid, puz=sol.slice(); let clues=81;
  for(const i of shuffle([...Array(41).keys()])){ if(clues<=SU_CLUES[diff]) break; const j=80-i; const a=puz[i], b=puz[j]; puz[i]=0; puz[j]=0;
    if(suSolve(puz,2).n!==1){ puz[i]=a; puz[j]=b; } else clues-=(i===j?1:2); }
  return {puz,sol};
}
let SU=null, suTimer=null;
function suSave(){ store.set("sudoku",SU); }
function suNew(diff){ let best=null; for(let k=0;k<(diff==="expert"?8:diff==="hard"?3:1);k++){ const m=suMake(diff); if(!best||m.puz.filter(x=>x).length<best.puz.filter(x=>x).length) best=m; } const {puz,sol}=best; SU={diff,puz,sol,cur:puz.slice(),notes:Array(81).fill(0),mistakes:0,time:0,sel:-1,pencil:false,hist:[],done:false}; suSave(); }
function suTick(){ clearInterval(suTimer); suTimer=setInterval(()=>{ if(S.view!=="games"||S.game!=="sudoku"||!SU||SU.done||document.hidden) return; SU.time+=1000; const el=$("#suTime"); if(el) el.textContent=fmtT(SU.time); if(SU.time%5000===0) suSave(); },1000); }
function suAskNew(){ modal(`<h3>${tr("Choose difficulty")}</h3><div class="diffs">${["easy","medium","hard","expert"].map(d=>`<button class="btn" data-act="suNew" data-d="${d}">${tr(d[0].toUpperCase()+d.slice(1))}</button>`).join("")}</div><button class="btn ghost" data-act="modalClose">${tr("Cancel")}</button>`); }
ACT.suNew=el=>{ closeModal(); const d=el.dataset.d; $("#v-games").innerHTML=`<div class="card"><p class="sub">${tr("New game")}…</p></div>`; setTimeout(()=>{ suNew(d); GAMES.sudoku.render($("#v-games")); },30); };
ACT.suAsk=()=>suAskNew();
function suConflict(i){ const v=SU.cur[i]; return v&&v!==SU.sol[i]; }
function suDraw(){
  const g=$("#suGrid"); if(!g) return; const sel=SU.sel, sv=sel>=0?SU.cur[sel]:0;
  g.innerHTML=SU.cur.map((v,i)=>{ const r=(i/9)|0, c=i%9, cls=["sc"]; if(SU.puz[i]) cls.push("given"); if(i===sel) cls.push("sel");
    else if(sel>=0&&(r===((sel/9)|0)||c===sel%9||boxOf(i)===boxOf(sel))) cls.push("peer");
    if(v&&sv&&v===sv&&i!==sel) cls.push("same"); if(suConflict(i)) cls.push("err"); if(c%3===2&&c<8) cls.push("br"); if(r%3===2&&r<8) cls.push("bb");
    const inner=v?v:SU.notes[i]?`<span class="nts">${[1,2,3,4,5,6,7,8,9].map(n=>`<i>${SU.notes[i]&(1<<n)?n:""}</i>`).join("")}</span>`:"";
    return `<button class="${cls.join(" ")}" data-act="suCell" data-i="${i}">${inner}</button>`; }).join("");
  const left=n=>9-SU.cur.filter((v,i)=>v===n&&v===SU.sol[i]).length;
  $("#suPad").innerHTML=[1,2,3,4,5,6,7,8,9].map(n=>`<button class="btn" data-act="suNum" data-n="${n}" ${left(n)<=0?"disabled":""}><b>${n}</b><small>${left(n)>0?left(n):""}</small></button>`).join("");
  $("#suMist").textContent=SU.mistakes; $("#suNote").classList.toggle("on",SU.pencil);
}
function suSet(i,n){
  if(SU.done||i<0||SU.puz[i]) return;
  SU.hist.push({i,v:SU.cur[i],nt:SU.notes[i]}); if(SU.hist.length>300) SU.hist.shift();
  if(SU.pencil&&n){ if(SU.cur[i]) return; SU.notes[i]^=(1<<n); }
  else { SU.cur[i]=n; SU.notes[i]=0;
    if(n&&n!==SU.sol[i]){ SU.mistakes++; buzz(60); }
    else if(n){ const r=(i/9)|0, c=i%9, b=boxOf(i); for(let k=0;k<81;k++) if(((k/9)|0)===r||k%9===c||boxOf(k)===b) SU.notes[k]&=~(1<<n); } }
  suSave(); suDraw();
  if(SU.cur.every((v,k)=>v===SU.sol[k])){ SU.done=true; suSave(); const key="sudokuBest_"+SU.diff, best=Math.min(store.get(key,1e12),SU.time); store.set(key,best); confetti(); buzz([30,50,30]);
    setTimeout(()=>modal(`<div class="result">✓</div><h3>${tr("Solved!")}</h3><p class="sub">${tr(SU.diff[0].toUpperCase()+SU.diff.slice(1))} · ${tr("Time")}: <b>${fmtT(SU.time)}</b> · ${tr("Mistakes")}: <b>${SU.mistakes}</b><br>${tr("Best time")}: <b>${fmtT(best)}</b></p><button class="btn primary" data-act="suAsk">${tr("New game")}</button>`),500); }
}
ACT.suCell=el=>{ SU.sel=+el.dataset.i; suDraw(); };
ACT.suNum=el=>suSet(SU.sel,+el.dataset.n);
ACT.suErase=()=>{ if(SU.sel>=0&&!SU.puz[SU.sel]){ SU.hist.push({i:SU.sel,v:SU.cur[SU.sel],nt:SU.notes[SU.sel]}); SU.cur[SU.sel]=0; SU.notes[SU.sel]=0; suSave(); suDraw(); } };
ACT.suUndo=()=>{ const h=SU.hist.pop(); if(!h) return; SU.cur[h.i]=h.v; SU.notes[h.i]=h.nt; SU.sel=h.i; suSave(); suDraw(); };
ACT.suNote=()=>{ SU.pencil=!SU.pencil; suDraw(); };
ACT.suHint=()=>{ let i=SU.sel; if(i<0||SU.cur[i]===SU.sol[i]){ const empty=SU.cur.map((v,k)=>v===SU.sol[k]?-1:k).filter(k=>k>=0); if(!empty.length) return; i=empty[rnd(empty.length)]; } SU.sel=i; const p=SU.pencil; SU.pencil=false; suSet(i,SU.sol[i]); SU.pencil=p; suDraw(); };
register("sudoku",{
  card:()=>card("sudoku","sudokucard",`<span class="sgicon">${[5,"",3,"",7,"",9,1,""].map(x=>`<i>${x}</i>`).join("")}</span>`,"Sudoku","Classic number puzzle, 4 levels",SU&&!SU.done?tr("Game in progress"):""),
  open(){ if(!SU){ const s=store.get("sudoku",null); if(s&&Array.isArray(s.cur)&&!s.done) SU=s; } },
  render(v){
    if(!SU||SU.done){ v.innerHTML=frame(tr("Sudoku"),`<div class="card"><h3>${tr("Choose difficulty")}</h3><div class="diffs">${["easy","medium","hard","expert"].map(d=>`<button class="btn" data-act="suNew" data-d="${d}">${tr(d[0].toUpperCase()+d.slice(1))}</button>`).join("")}</div></div>`); afterRender(); return; }
    v.innerHTML=frame("",`<div class="gstats"><span>${tr(SU.diff[0].toUpperCase()+SU.diff.slice(1))}</span><span>${tr("Mistakes")}: <b id="suMist">0</b></span><span id="suTime">${fmtT(SU.time)}</span></div>
      <div class="sugrid" id="suGrid" dir="ltr"></div>
      <div class="sutools"><button class="btn" data-act="suUndo">↶<small>${tr("Undo")}</small></button><button class="btn" data-act="suErase">⌫<small>${tr("Erase")}</small></button><button class="btn" id="suNote" data-act="suNote">✎<small>${tr("Notes")}</small></button><button class="btn" data-act="suHint">💡︎<small>${tr("Hint")}</small></button></div>
      <div class="supad" id="suPad" dir="ltr"></div>
      <button class="btn ghost" data-act="suAsk">${tr("New game")}</button>`,`<b>${tr("Sudoku")}</b>`);
    afterRender(); suDraw(); this.resize(); suTick();
  },
  resize(){ const g=$("#suGrid"); if(g) g.style.setProperty("--w",fit(g,520,1)+"px"); }
});

/* =================== MINESWEEPER =================== */
const MSD={easy:{w:9,h:9,m:10},medium:{w:12,h:16,m:30},hard:{w:14,h:22,m:55}};
let MS=null, msTimer=null, msLP=null, msLPdone=false;
const msN=i=>{ const x=i%MS.w, y=(i/MS.w)|0, out=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy) continue; const X=x+dx, Y=y+dy; if(X>=0&&Y>=0&&X<MS.w&&Y<MS.h) out.push(Y*MS.w+X); } return out; };
function msNew(d){ const c=MSD[d]; MS={d,w:c.w,h:c.h,m:c.m,cells:Array.from({length:c.w*c.h},()=>({mine:false,n:0,open:false,flag:false})),started:false,over:false,won:false,time:0,mode:"dig"}; store.set("mines",MS); }
function msPlace(first){ const safe=new Set([first,...msN(first)]); const ids=shuffle([...Array(MS.w*MS.h).keys()].filter(i=>!safe.has(i))).slice(0,MS.m); ids.forEach(i=>MS.cells[i].mine=true); MS.cells.forEach((c,i)=>c.n=msN(i).filter(k=>MS.cells[k].mine).length); MS.started=true; }
function msOpen(i){ const st=[i]; while(st.length){ const k=st.pop(), c=MS.cells[k]; if(c.open||c.flag) continue; c.open=true; if(!c.n&&!c.mine) msN(k).forEach(j=>{ if(!MS.cells[j].open) st.push(j); }); } }
function msTap(i,flag){
  if(MS.over) return; const c=MS.cells[i];
  if(flag||MS.mode==="flag"){ if(!c.open){ c.flag=!c.flag; buzz(15); } }
  else if(c.open&&c.n){ const nb=msN(i); if(nb.filter(k=>MS.cells[k].flag).length===c.n) nb.forEach(k=>{ const q=MS.cells[k]; if(!q.flag&&!q.open){ if(q.mine) return msLose(k); msOpen(k); } }); }
  else if(!c.flag){ if(!MS.started) msPlace(i); if(c.mine) return msLose(i); msOpen(i); }
  if(!MS.over&&MS.cells.every(q=>q.mine||q.open)){ MS.over=true; MS.won=true; MS.cells.forEach(q=>{ if(q.mine) q.flag=true; }); const key="minesBest_"+MS.d, best=Math.min(store.get(key,1e12),MS.time); store.set(key,best); confetti();
    setTimeout(()=>modal(`<div class="result">🏁︎</div><h3>${tr("You cleared the field!")}</h3><p class="sub">${tr("Time")}: <b>${fmtT(MS.time)}</b> · ${tr("Best time")}: <b>${fmtT(best)}</b></p><button class="btn primary" data-act="msNew" data-d="${MS.d}">${tr("Play again")}</button>`),500); }
  store.set("mines",MS); msDraw();
}
function msLose(i){ MS.over=true; MS.boom=i; MS.cells.forEach(q=>{ if(q.mine) q.open=true; }); buzz([80,40,120]); store.set("mines",MS); msDraw();
  setTimeout(()=>modal(`<div class="result">💥︎</div><h3>${tr("Boom!")}</h3><button class="btn primary" data-act="msNew" data-d="${MS.d}">${tr("Play again")}</button><button class="btn ghost" data-act="modalClose">${tr("Look at the board")}</button>`),700); }
function msDraw(){
  const g=$("#msGrid"); if(!g) return;
  g.style.gridTemplateColumns=`repeat(${MS.w},1fr)`;
  g.innerHTML=MS.cells.map((c,i)=>{ let cls="mc", t="";
    if(c.open){ cls+=" open"; if(c.mine){ cls+=i===MS.boom?" boom":" mine"; t="✸"; } else if(c.n){ t=c.n; cls+=" n"+c.n; } }
    else if(c.flag){ cls+=" flag"; t="⚑"; if(MS.over&&!c.mine) cls+=" wrong"; }
    return `<button class="${cls}" data-act="msCell" data-i="${i}">${t}</button>`; }).join("");
  $("#msLeft").textContent=MS.m-MS.cells.filter(c=>c.flag).length;
  $$(".msmode button").forEach(b=>b.classList.toggle("on",b.dataset.m===MS.mode));
}
ACT.msCell=el=>{ if(msLPdone){ msLPdone=false; return; } msTap(+el.dataset.i,false); };
ACT.msMode=el=>{ MS.mode=el.dataset.m; msDraw(); };
ACT.msNew=el=>{ closeModal(); msNew(el.dataset.d||MS.d); GAMES.mines.render($("#v-games")); };
document.addEventListener("pointerdown",e=>{ const c=e.target.closest&&e.target.closest("#msGrid .mc"); if(!c) return; clearTimeout(msLP); msLPdone=false; msLP=setTimeout(()=>{ msLPdone=true; msTap(+c.dataset.i,true); },420); });
["pointerup","pointercancel","pointerleave"].forEach(t=>document.addEventListener(t,()=>clearTimeout(msLP)));
document.addEventListener("contextmenu",e=>{ if(e.target.closest&&e.target.closest("#msGrid")) e.preventDefault(); });
register("mines",{
  card:()=>card("mines","minescard",`<span class="mgicon"><i>1</i><i>⚑</i><i>2</i><i></i></span>`,"Minesweeper","Clear the field without hitting a mine"),
  open(){ if(!MS){ const s=store.get("mines",null); if(s&&s.cells&&!s.over) MS=s; } if(!MS) msNew("easy"); },
  render(v){
    v.innerHTML=frame("",`<div class="gstats"><span>⚑ <b id="msLeft"></b></span><span class="seg msdiff">${["easy","medium","hard"].map(d=>`<button data-act="msNew" data-d="${d}" class="${MS.d===d?"on":""}">${tr(d[0].toUpperCase()+d.slice(1))}</button>`).join("")}</span><span id="msTime">${fmtT(MS.time)}</span></div>
      <div class="msgrid" id="msGrid" dir="ltr"></div>
      <div class="seg msmode"><button data-act="msMode" data-m="dig">⛏︎ ${tr("Dig")}</button><button data-act="msMode" data-m="flag">⚑ ${tr("Flag")}</button></div>
      <p class="sub">${tr("Tap a cell to start. Long-press to place a flag.")}</p>`,`<b>${tr("Minesweeper")}</b>`);
    afterRender(); msDraw(); this.resize();
    clearInterval(msTimer); msTimer=setInterval(()=>{ if(S.game!=="mines"||S.view!=="games"||!MS.started||MS.over||document.hidden) return; MS.time+=1000; const t=$("#msTime"); if(t) t.textContent=fmtT(MS.time); },1000);
  },
  resize(){ const g=$("#msGrid"); if(g) g.style.setProperty("--w",fit(g,560,MS.w/MS.h)+"px"); }
});

/* =================== FOUR IN A ROW =================== */
const C4W=7, C4H=6;
let C4=null;
function c4Win(b,p){ // returns winning cells or null; b[r*7+c], r=0 is the bottom row
  const D=[[0,1],[1,0],[1,1],[1,-1]];
  for(let r=0;r<C4H;r++) for(let c=0;c<C4W;c++){ if(b[r*C4W+c]!==p) continue;
    for(const [dr,dc] of D){ const cells=[]; for(let k=0;k<4;k++){ const R=r+dr*k, C=c+dc*k; if(R<0||R>=C4H||C<0||C>=C4W||b[R*C4W+C]!==p) break; cells.push(R*C4W+C); } if(cells.length===4) return cells; } }
  return null;
}
const c4Row=(b,c)=>{ for(let r=0;r<C4H;r++) if(!b[r*C4W+c]) return r; return -1; };
function c4Eval(b,p){
  const o=3-p; let s=0;
  for(let r=0;r<C4H;r++) if(b[r*C4W+3]===p) s+=3;
  const win=(cells)=>{ let m=0,t=0,e=0; for(const k of cells){ if(b[k]===p) m++; else if(b[k]===o) t++; else e++; } if(m===4) return 1000; if(m===3&&e===1) return 6; if(m===2&&e===2) return 2; if(t===3&&e===1) return -5; return 0; };
  for(let r=0;r<C4H;r++) for(let c=0;c<C4W;c++) for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]){ const cells=[]; for(let k=0;k<4;k++){ const R=r+dr*k, C=c+dc*k; if(R<0||R>=C4H||C<0||C>=C4W) break; cells.push(R*C4W+C); } if(cells.length===4) s+=win(cells); }
  return s;
}
const C4ORD=[3,2,4,1,5,0,6];
function c4Search(b,depth,a,bt,p){
  if(c4Win(b,3-p)) return -100000-depth;
  if(b.every(x=>x)) return 0;
  if(!depth) return c4Eval(b,p)-c4Eval(b,3-p);
  for(const c of C4ORD){ const r=c4Row(b,c); if(r<0) continue; b[r*C4W+c]=p; const sc=-c4Search(b,depth-1,-bt,-a,3-p); b[r*C4W+c]=0; if(sc>=bt) return sc; if(sc>a) a=sc; }
  return a;
}
function c4Bot(){
  const b=C4.b.slice(), p=2, depth={easy:2,medium:4,hard:7}[C4.diff];
  const moves=C4ORD.filter(c=>c4Row(b,c)>=0); if(C4.diff==="easy"&&Math.random()<0.35) return moves[rnd(moves.length)];
  let best=moves[0], bs=-Infinity;
  for(const c of moves){ const r=c4Row(b,c); b[r*C4W+c]=p; const sc=-c4Search(b,depth-1,-Infinity,Infinity,1)+(Math.random()-.5)*(C4.diff==="hard"?0.5:3); b[r*C4W+c]=0; if(sc>bs){ bs=sc; best=c; } }
  return best;
}
function c4New(diff,keepScore){ const sc=C4&&keepScore?C4.score:[0,0,0], first=C4&&keepScore?3-C4.first:1; C4={b:Array(42).fill(0),diff:diff||(C4&&C4.diff)||"medium",turn:first,first,over:null,win:null,score:sc,last:-1}; store.set("four",C4); }
/* online: you are always yellow (1), your opponent red (2); 30 seconds per move */
const C4_MOVE=30000; let C4solo=null, c4Tick=null;
function c4MpStart(role,init,name){
  if(C4&&!C4.mp) C4solo=C4; const first=(role==="host")===!!init.hostFirst;
  C4={b:Array(42).fill(0),diff:"medium",turn:first?1:2,first:first?1:2,over:null,win:null,score:[0,0,0],last:-1,mp:{opp:name,tEnd:Date.now()+C4_MOVE,why:""}};
  closeModal(); S.game="four"; show("games"); toast(T(`Playing ${name}`,`بدأت المباراة ضد ${name}`)); buzz([30,60,30]);
  clearInterval(c4Tick); c4Tick=setInterval(c4MpTick,250);
}
function c4MpTick(){
  if(!C4||!C4.mp){ clearInterval(c4Tick); return; } if(C4.over) return clearInterval(c4Tick);
  const left=C4.mp.tEnd-Date.now(), el=$("#c4Stat"), sec=Math.max(0,Math.ceil(left/1000));
  if(el) el.textContent=(C4.turn===1?tr("Your turn"):T(`${C4.mp.opp}'s turn`,`دور ${C4.mp.opp}`))+" · 0:"+String(sec).padStart(2,"0");
  if(C4.turn===1&&left<=0){ window.OUTPOST_MP.send({t:"flag"}); c4MpOver("bot","time"); }
  else if(C4.turn===2&&left<-5000) c4MpOver("you","time");
}
function c4MpOver(res,why){
  if(!C4||!C4.mp||(C4.over&&C4.mp.shown)) return; C4.over=res; C4.mp.shown=true; C4.mp.why=why||""; clearInterval(c4Tick); c4Draw(false);
  const opp=esc(C4.mp.opp); if(res==="you") confetti();
  const head=res==="draw"?tr("Draw"):res==="you"?tr("You win!"):T(`${opp} wins`,`فاز ${opp}`);
  const sub=why==="time"?(res==="you"?T(`${opp} ran out of time.`,`انتهى وقت ${opp}.`):tr("You ran out of time")):why==="left"?T(`${opp} left the game.`,`غادر ${opp} المباراة.`):why==="resign"?(res==="you"?T(`${opp} resigned.`,`استسلم ${opp}.`):tr("You resigned")):"";
  window.OUTPOST_MP.stopLater(2000);
  setTimeout(()=>modal(`<div class="result">${res==="you"?"🏆":res==="draw"?"½":"●"}</div><h3>${head}</h3>${sub?`<p class="sub">${sub}</p>`:""}
    <div class="row"><button class="btn primary grow" data-act="mpPlay" data-g="four">${tr("Find a new opponent")}</button><button class="btn grow" data-act="c4Solo">${tr("Play the computer")}</button></div>
    <button class="btn ghost" data-act="modalClose">${tr("Look at the board")}</button>`),why?200:700);
}
function c4MpData(d){ if(!C4||!C4.mp||C4.over) return;
  if(d.t==="c4"){ if(C4.turn===2) c4Drop(+d.c,true); }
  else if(d.t==="flag") c4MpOver("you","time");
  else if(d.t==="resign") c4MpOver("you","resign");
  else if(d.t==="bye") c4MpOver("you","left"); }
function c4Solo(){ closeModal(); if(C4&&C4.mp&&!C4.over&&window.OUTPOST_MP.game()==="four") window.OUTPOST_MP.stop(); clearInterval(c4Tick); C4=C4solo||store.get("four",null); C4solo=null; if(!C4||C4.mp||!Array.isArray(C4.b)){ C4=null; c4New("medium"); } S.game="four"; show("games"); }
window.OUTPOST_MP.register("four",{title:"Four in a Row",info:"You'll play the next person who taps Play online. 30 seconds per move.",back:"four",icon:()=>'<span class="qc4"><i></i><i></i></span>',
  busy:()=>!!(C4&&C4.mp&&!C4.over),init:()=>({hostFirst:Math.random()<.5}),start:c4MpStart,data:c4MpData,left:()=>{ if(C4&&C4.mp&&!C4.over) c4MpOver("you","left"); }});
function c4Drop(c,remote){
  const r=c4Row(C4.b,c); if(r<0||C4.over) return false; const p=C4.turn; C4.b[r*C4W+c]=p; C4.last=r*C4W+c; buzz(10);
  if(C4.mp){ if(!remote) window.OUTPOST_MP.send({t:"c4",c}); C4.mp.tEnd=Date.now()+C4_MOVE;
    const w=c4Win(C4.b,p); if(w){ C4.win=w; c4Draw(true); return c4MpOver(p===1?"you":"bot",""); } if(C4.b.every(x=>x)){ c4Draw(true); return c4MpOver("draw",""); }
    C4.turn=3-p; c4Draw(true); c4MpTick(); return true; }
  const w=c4Win(C4.b,p);
  if(w){ C4.over=p===1?"you":"bot"; C4.win=w; C4.score[p===1?0:1]++; }
  else if(C4.b.every(x=>x)){ C4.over="draw"; C4.score[2]++; }
  else C4.turn=3-p;
  store.set("four",C4); c4Draw(true);
  if(C4.over){ if(C4.over==="you") confetti(); setTimeout(()=>modal(`<div class="result">${C4.over==="you"?"🏆":C4.over==="bot"?"🤖︎":"½"}</div><h3>${tr(C4.over==="you"?"You win!":C4.over==="bot"?"Bot wins":"Draw")}</h3><p class="sub">${esc(ME())} ${C4.score[0]} · ${tr("Bot")} ${C4.score[1]}</p><button class="btn primary" data-act="c4Again">${tr("Play again")}</button><button class="btn ghost" data-act="modalClose">${tr("Look at the board")}</button>`),700); }
  else if(C4.turn===2) setTimeout(()=>{ if(S.game==="four"&&C4&&!C4.mp&&!C4.over&&C4.turn===2) c4Drop(c4Bot()); },550);
  return true;
}
function c4Draw(anim){
  const g=$("#c4Grid"); if(!g) return; let h="";
  for(let row=C4H-1;row>=0;row--) for(let c=0;c<C4W;c++){ const k=row*C4W+c, v=C4.b[k];
    h+=`<div class="c4c" data-act="c4Col" data-c="${c}">${v?`<i class="disc p${v}${anim&&k===C4.last?" drop":""}${C4.win&&C4.win.includes(k)?" winc":""}" style="--fall:${C4H-row}"></i>`:""}</div>`; }
  g.innerHTML=h;
  if(!C4.mp) $("#c4Stat").textContent=C4.over?"":tr(C4.turn===1?"Your turn":"Bot is thinking…"); else if(C4.over) $("#c4Stat").textContent="";
  if(C4.mp) $("#c4Score").innerHTML=`<i class="cdot y"></i> ${esc(ME())} &nbsp;vs&nbsp; <i class="cdot r"></i> ${esc(C4.mp.opp)}`; else $("#c4Score").textContent=`${ME()} ${C4.score[0]} – ${C4.score[1]} ${tr("Bot")}`;
  $$(".c4diff button").forEach(b=>b.classList.toggle("on",b.dataset.d===C4.diff));
}
ACT.c4Col=el=>{ if(C4.turn===1&&!C4.over) c4Drop(+el.dataset.c); };
ACT.c4Solo=()=>c4Solo();
ACT.c4Leave=()=>{ if(!C4.mp||C4.over) return c4Solo(); modal(`<h3>${tr("Leave this game?")}</h3><p class="sub">${tr("Leaving counts as resigning.")}</p><div class="row"><button class="btn danger grow" data-act="c4LeaveYes">${tr("Leave and resign")}</button><button class="btn grow" data-act="modalClose">${tr("Stay")}</button></div>`); };
ACT.c4LeaveYes=()=>{ closeModal(); window.OUTPOST_MP.send({t:"resign"}); c4MpOver("bot","resign"); };
ACT.c4Again=()=>{ closeModal(); c4New(C4.diff,true); GAMES.four.render($("#v-games")); if(C4.turn===2) setTimeout(()=>c4Drop(c4Bot()),500); };
ACT.c4Diff=el=>{ c4New(el.dataset.d,false); GAMES.four.render($("#v-games")); };
register("four",{
  card:()=>card("four","fourcard",`<span class="fgicon">${[0,1,2,1,2,1,2,2,1].map(x=>`<i class="d${x}"></i>`).join("")}</span>`,"Four in a Row","Drop discs, connect four to win"),
  open(){ if(!C4){ const s=store.get("four",null); if(s&&Array.isArray(s.b)) C4=s; else c4New("medium"); } },
  render(v){
    const mp=!!C4.mp;
    v.innerHTML=frame("",`<div class="gstats">${mp?"":`<span class="seg c4diff">${["easy","medium","hard"].map(d=>`<button data-act="c4Diff" data-d="${d}">${tr(d[0].toUpperCase()+d.slice(1))}</button>`).join("")}</span>`}<span id="c4Score"></span></div>
      <div class="c4board" id="c4Board"><div class="c4grid" id="c4Grid" dir="ltr"></div></div>
      <p class="sub center" id="c4Stat"></p>
      <div class="gctl">${mp?`<button class="btn ${C4.over?"":"danger"}" data-act="c4Leave">${tr(C4.over?"Play the computer":"‹ Leave")}</button>`:`<button class="btn primary" data-act="mpPlay" data-g="four">${tr("Play online")}</button>`}</div>`,`<b>${tr("Four in a Row")}</b>`);
    afterRender(); c4Draw(false); this.resize(); if(mp) c4MpTick();
    if(!mp&&!C4.over&&C4.turn===2) setTimeout(()=>{ if(C4&&!C4.mp&&C4.turn===2&&!C4.over) c4Drop(c4Bot()); },500);
  },
  resize(){ const g=$("#c4Board"); if(g) g.style.setProperty("--w",fit(g,520,7/6)+"px"); }
});

/* =================== MERGE (slide-and-merge numbers) =================== */
let MG=null, mgId=1, mgBusy=false;
function mgNew(){ MG={tiles:[],score:0,over:false,won:false}; mgSpawn(); mgSpawn(); store.set("merge",MG); }
function mgSpawn(){ const used=new Set(MG.tiles.map(t=>t.r*4+t.c)), free=[...Array(16).keys()].filter(k=>!used.has(k)); if(!free.length) return; const k=free[rnd(free.length)]; MG.tiles.push({id:mgId++,v:Math.random()<0.9?2:4,r:(k/4)|0,c:k%4,isNew:true}); }
function mgCanMove(){ if(MG.tiles.length<16) return true; const g={}; MG.tiles.forEach(t=>g[t.r*4+t.c]=t.v); for(let r=0;r<4;r++) for(let c=0;c<4;c++){ const v=g[r*4+c]; if(c<3&&g[r*4+c+1]===v) return true; if(r<3&&g[(r+1)*4+c]===v) return true; } return false; }
function mgMove(dir){ // 0 up, 1 right, 2 down, 3 left
  if(MG.over||mgBusy) return;
  const [dr,dc]=[[-1,0],[0,1],[1,0],[0,-1]][dir], grid={}; MG.tiles.forEach(t=>{ t.isNew=false; t.merged=false; grid[t.r*4+t.c]=t; });
  const order=[...MG.tiles].sort((a,b)=>dr?(dr>0?b.r-a.r:a.r-b.r):(dc>0?b.c-a.c:a.c-b.c)); let moved=false, gain=0; const gone=[];
  for(const t of order){ let r=t.r, c=t.c; delete grid[r*4+c];
    while(true){ const R=r+dr, C=c+dc; if(R<0||R>3||C<0||C>3) break; const o=grid[R*4+C];
      if(!o){ r=R; c=C; continue; }
      if(o.v===t.v&&!o.merged&&!o.gone){ t.r=R; t.c=C; t.gone=true; o.v*=2; o.merged=true; gain+=o.v; gone.push(t); moved=true; break; }
      break; }
    if(!t.gone){ if(r!==t.r||c!==t.c) moved=true; t.r=r; t.c=c; grid[r*4+c]=t; } }
  if(!moved) return;
  MG.score+=gain; mgBusy=true; mgDraw();
  setTimeout(()=>{ MG.tiles=MG.tiles.filter(t=>!t.gone); mgSpawn(); mgBusy=false;
    if(!MG.won&&MG.tiles.some(t=>t.v>=2048)){ MG.won=true; confetti(); toast("2048! "+tr("Keep going")); }
    if(!mgCanMove()){ MG.over=true; setTimeout(()=>modal(`<h3>${tr("No more moves")}</h3><p class="sub">${tr("Score")}: <b>${MG.score}</b> · ${tr("Best")}: <b>${store.get("mergeBest",0)}</b></p><button class="btn primary" data-act="mgNew">${tr("Try again")}</button>`),400); }
    store.set("mergeBest",Math.max(store.get("mergeBest",0),MG.score)); store.set("merge",MG); mgDraw(); },130);
}
function mgDraw(){
  const L=$("#mgTiles"); if(!L) return; const seen=new Set();
  for(const t of MG.tiles){ seen.add(String(t.id)); let el=L.querySelector(`[data-id="${t.id}"]`);
    if(!el){ el=document.createElement("div"); el.dataset.id=t.id; L.appendChild(el); }
    el.className="mt v"+Math.min(t.v,4096)+(t.isNew?" new":"")+(t.merged?" pop":""); el.style.setProperty("--r",t.r); el.style.setProperty("--c",t.c); el.textContent=t.gone?el.textContent:t.v; el.style.zIndex=t.gone?1:2; }
  L.querySelectorAll(".mt").forEach(el=>{ if(!seen.has(el.dataset.id)) el.remove(); });
  $("#mgScore").textContent=MG.score; $("#mgBest").textContent=Math.max(store.get("mergeBest",0),MG.score);
}
ACT.mgNew=()=>{ closeModal(); mgNew(); GAMES.merge.render($("#v-games")); };
ACT.mgAsk=()=>{ if(MG.over||MG.score===0) return ACT.mgNew(); modal(`<h3>${tr("Start a new game?")}</h3><p class="sub">${tr("Your current game will be lost.")}</p><div class="row"><button class="btn primary grow" data-act="mgNew">${tr("Start over")}</button><button class="btn grow" data-act="modalClose">${tr("Cancel")}</button></div>`); };
let mgP=null;
document.addEventListener("pointerdown",e=>{ if(e.target.closest&&e.target.closest("#mgBoard")){ mgP=[e.clientX,e.clientY]; } });
document.addEventListener("pointerup",e=>{ if(!mgP) return; const dx=e.clientX-mgP[0], dy=e.clientY-mgP[1]; mgP=null; if(Math.max(Math.abs(dx),Math.abs(dy))<24) return; mgMove(Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?2:0)); });
document.addEventListener("keydown",e=>{ if(S.view!=="games"||S.game!=="merge") return; const d={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3}[e.key]; if(d!==undefined){ e.preventDefault(); mgMove(d); } });
register("merge",{
  card:()=>card("merge","mergecard",`<span class="mggicon"><i>2</i><i>4</i><i>8</i><i>16</i></span>`,"Merge","Swipe to merge numbers",store.get("mergeBest",0)?`${tr("Best")}: ${store.get("mergeBest",0)}`:""),
  open(){ if(!MG){ const s=store.get("merge",null); if(s&&Array.isArray(s.tiles)&&!s.over){ MG=s; mgId=Math.max(1,...MG.tiles.map(t=>t.id+1)); } else mgNew(); } },
  render(v){
    v.innerHTML=frame("",`<div class="gstats"><span>${tr("Score")} <b id="mgScore">0</b></span><span>${tr("Best")} <b id="mgBest">0</b></span><button class="btn small" data-act="mgAsk">${tr("New game")}</button></div>
      <div class="mgboard" id="mgBoard" dir="ltr">${Array(16).fill('<i class="mgcell"></i>').join("")}<div class="mgtiles" id="mgTiles"></div></div>
      <p class="sub center">${tr("Swipe up, down, left or right")}</p>`,`<b>${tr("Merge")}</b>`);
    afterRender(); mgDraw(); this.resize();
  },
  resize(){ const g=$("#mgBoard"); if(g) g.style.setProperty("--w",fit(g,480,1)+"px"); }
});

/* =================== SOLITAIRE (Klondike) =================== */
const SUITS=["♠","♥","♦","♣"], RANKS=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const cSuit=id=>(id/13)|0, cRank=id=>id%13+1, cRed=id=>cSuit(id)===1||cSuit(id)===2;
let SO=null, soAuto=null;
function soNew(draw){ const deck=shuffle([...Array(52).keys()]); const tab=[]; for(let i=0;i<7;i++){ tab.push(deck.splice(0,i+1).map((id,k)=>({id,up:k===i}))); }
  SO={tab,stock:deck,waste:[],found:[[],[],[],[]],draw:draw||(SO&&SO.draw)||1,moves:0,time:0,hist:[],won:false}; store.set("solitaire",SO); }
const soSnap=()=>JSON.stringify({tab:SO.tab,stock:SO.stock,waste:SO.waste,found:SO.found,moves:SO.moves});
function soPush(){ SO.hist.push(soSnap()); if(SO.hist.length>150) SO.hist.shift(); }
const canFound=id=>SO.found[cSuit(id)].length===cRank(id)-1;
function canTab(id,col){ const t=SO.tab[col]; if(!t.length) return cRank(id)===13; const top=t[t.length-1]; return top.up&&cRed(top.id)!==cRed(id)&&cRank(top.id)===cRank(id)+1; }
function soFlip(col){ const t=SO.tab[col]; if(t.length&&!t[t.length-1].up){ t[t.length-1].up=true; } }
function soAfter(){ SO.moves++; if(SO.found.every(f=>f.length===13)){ SO.won=true; clearInterval(soAuto); const key="solBest"+SO.draw, best=Math.min(store.get(key,1e12),SO.time); store.set(key,best); confetti(); setTimeout(()=>{ confetti(); modal(`<div class="result">🏆</div><h3>${tr("You won!")}</h3><p class="sub">${tr("Moves")}: <b>${SO.moves}</b> · ${tr("Time")}: <b>${fmtT(SO.time)}</b><br>${tr("Best time")}: <b>${fmtT(best)}</b></p><button class="btn primary" data-act="soNew">${tr("Play again")}</button>`); },700); }
  store.set("solitaire",SO); soDraw(); }
function soTapStock(){ soPush(); if(!SO.stock.length){ if(!SO.waste.length){ SO.hist.pop(); return; } SO.stock=SO.waste.reverse(); SO.waste=[]; } else { const n=Math.min(SO.draw,SO.stock.length); for(let i=0;i<n;i++) SO.waste.push(SO.stock.pop()); } SO.moves--; soAfter(); }
function soMoveCard(src,id,k){ // src: "w", "f0".."f3", or tableau column number; k = index within column
  const single=src==="w"||String(src)[0]==="f"||k===SO.tab[src].length-1;
  if(single&&src[0]!=="f"&&canFound(id)){ soPush(); soTake(src,k); SO.found[cSuit(id)].push(id); if(typeof src==="number") soFlip(src); buzz(10); return soAfter(); }
  const cols=[0,1,2,3,4,5,6].filter(c=>c!==src&&canTab(id,c)).sort((a,b)=>(SO.tab[a].length?0:1)-(SO.tab[b].length?0:1));
  if(cols.length){ soPush(); const moving=soTake(src,k); SO.tab[cols[0]].push(...moving.map(x=>({id:x,up:true}))); if(typeof src==="number") soFlip(src); buzz(10); return soAfter(); }
  const el=$(`#soBoard .cd[data-id="${id}"]`); if(el){ el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }
}
function soTake(src,k){ if(src==="w") return [SO.waste.pop()]; if(String(src)[0]==="f") return [SO.found[+src[1]].pop()]; return SO.tab[src].splice(k).map(x=>x.id); }
function soCanAuto(){ return !SO.won&&!SO.stock.length&&!SO.waste.length&&SO.tab.every(t=>t.every(x=>x.up)); }
function soAutoRun(){ clearInterval(soAuto); soAuto=setInterval(()=>{ if(SO.won||S.game!=="solitaire"){ clearInterval(soAuto); return; }
  for(let c=0;c<7;c++){ const t=SO.tab[c]; if(t.length&&canFound(t[t.length-1].id)){ const id=t.pop().id; SO.found[cSuit(id)].push(id); return soAfter(); } }
  clearInterval(soAuto); },110); }
const cardFace=id=>`<span class="tl">${RANKS[cRank(id)-1]}<br>${SUITS[cSuit(id)]}</span><span class="mid">${SUITS[cSuit(id)]}</span>`;
function soDraw(){
  const B=$("#soBoard"); if(!B) return;
  const W=B.clientWidth, gap=Math.max(3,W*0.012), cw=(W-gap*6)/7, ch=cw*1.42, xs=i=>i*(cw+gap);
  B.style.setProperty("--cw",cw+"px"); B.style.setProperty("--ch",ch+"px");
  const pos={}; // id -> [x,y,z,up,src,k]
  SO.stock.forEach((id,i)=>pos[id]=[xs(0),0,i,false,"s",i]);
  const wn=SO.waste.length; SO.waste.forEach((id,i)=>{ const fan=SO.draw===3?Math.max(0,i-(wn-3)):0; pos[id]=[xs(1)+fan*cw*0.28,0,100+i,true,"w",i]; });
  SO.found.forEach((f,s)=>f.forEach((id,i)=>pos[id]=[xs(3+s),0,200+i,true,"f"+s,i]));
  let maxY=ch;
  SO.tab.forEach((t,c)=>{ let y=ch+gap*3; t.forEach((x,i)=>{ pos[x.id]=[xs(c),y,300+i,x.up,c,i]; y+=x.up?ch*0.27:ch*0.14; }); maxY=Math.max(maxY,y+ch*0.73); });
  B.style.height=(maxY+gap)+"px";
  if(!B.dataset.ready){ B.innerHTML=`<div class="slot stock" data-act="soStock" style="left:${xs(0)}px"></div>`+[0,1,2,3].map(s=>`<div class="slot fnd" style="left:${xs(3+s)}px">${SUITS[s]}</div>`).join("")+[0,1,2,3,4,5,6].map(c=>`<div class="slot tabs" style="left:${xs(c)}px;top:${ch+gap*3}px"></div>`).join("")+[...Array(52).keys()].map(id=>`<div class="cd${cRed(id)?" red":""}" data-id="${id}" data-act="soCard">${cardFace(id)}</div>`).join(""); B.dataset.ready=1; }
  else { B.querySelector(".slot.stock").style.left=xs(0)+"px"; B.querySelectorAll(".slot.fnd").forEach((e,s)=>e.style.left=xs(3+s)+"px"); B.querySelectorAll(".slot.tabs").forEach((e,c)=>{ e.style.left=xs(c)+"px"; e.style.top=(ch+gap*3)+"px"; }); }
  B.querySelector(".slot.stock").classList.toggle("empty",!SO.stock.length);
  B.querySelectorAll(".cd").forEach(el=>{ const p=pos[el.dataset.id]; el.style.transform=`translate(${p[0]}px,${p[1]}px)`; el.style.zIndex=p[2]; el.classList.toggle("back",!p[3]); el.dataset.src=p[4]; el.dataset.k=p[5]; });
  $("#soMoves").textContent=SO.moves; const ab=$("#soAuto"); if(ab) ab.hidden=!soCanAuto();
}
ACT.soStock=()=>soTapStock();
ACT.soCard=el=>{ const src=el.dataset.src, k=+el.dataset.k, id=+el.dataset.id;
  if(src==="s") return soTapStock();
  if(src==="w"){ if(k!==SO.waste.length-1) return; return soMoveCard("w",id,k); }
  if(src[0]==="f") return soMoveCard(src,id,k);
  const col=+src; if(!SO.tab[col][k].up) return; soMoveCard(col,id,k); };
ACT.soUndo=()=>{ const h=SO.hist.pop(); if(!h) return; Object.assign(SO,JSON.parse(h)); store.set("solitaire",SO); soDraw(); };
ACT.soNew=el=>{ closeModal(); clearInterval(soAuto); soNew(el&&el.dataset.d?+el.dataset.d:SO.draw); GAMES.solitaire.render($("#v-games")); };
ACT.soAsk=()=>{ if(SO.won||SO.moves===0) return ACT.soNew(); modal(`<h3>${tr("Start a new game?")}</h3><p class="sub">${tr("Your current game will be lost.")}</p><div class="row"><button class="btn primary grow" data-act="soNew">${tr("Start over")}</button><button class="btn grow" data-act="modalClose">${tr("Cancel")}</button></div>`); };
ACT.soDrawMode=el=>{ const d=+el.dataset.d; if(d===SO.draw) return; modal(`<h3>${tr(d===1?"Draw 1":"Draw 3")}</h3><p class="sub">${tr("Your current game will be lost.")}</p><div class="row"><button class="btn primary grow" data-act="soNew" data-d="${d}">${tr("Start over")}</button><button class="btn grow" data-act="modalClose">${tr("Cancel")}</button></div>`); };
ACT.soAuto=()=>soAutoRun();
let soTimer=null;
register("solitaire",{
  card:()=>card("solitaire","solcard",`<span class="cgicon"><i class="r">A<br>♥</i><i>K<br>♠</i></span>`,"Solitaire","Classic card patience"),
  open(){ if(!SO){ const s=store.get("solitaire",null); if(s&&Array.isArray(s.tab)&&!s.won) SO=s; else soNew(1); } },
  render(v){
    v.innerHTML=frame("",`<div class="gstats"><span class="seg soDraw">${[1,3].map(d=>`<button data-act="soDrawMode" data-d="${d}" class="${SO.draw===d?"on":""}">${tr(d===1?"Draw 1":"Draw 3")}</button>`).join("")}</span><span>${tr("Moves")} <b id="soMoves">0</b></span><span id="soTime">${fmtT(SO.time)}</span></div>
      <div class="soboard" id="soBoard" dir="ltr"></div>
      <div class="gctl"><button class="btn" data-act="soUndo">↶ ${tr("Undo")}</button><button class="btn primary" id="soAuto" data-act="soAuto" hidden>${tr("Auto finish")}</button><button class="btn" data-act="soAsk">${tr("New game")}</button></div>
      <p class="sub center">${tr("Tap a card to move it. Tap the deck to draw.")}</p>`,`<b>${tr("Solitaire")}</b>`);
    afterRender(); this.resize();
    clearInterval(soTimer); soTimer=setInterval(()=>{ if(S.game!=="solitaire"||S.view!=="games"||SO.won||!SO.moves||document.hidden) return; SO.time+=1000; const t=$("#soTime"); if(t) t.textContent=fmtT(SO.time); },1000);
  },
  resize(){ const B=$("#soBoard"); if(!B) return; const root=$("#gameRoot"); B.style.width=Math.min(root.clientWidth,S.gfs?Math.min(620,window.innerHeight*0.75):620)+"px"; soDraw(); }
});

/* =================== DOMINOES (draw game, first to 100) =================== */
let DM=null;
const PIPS={0:[],1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
const half=n=>`<span class="dh">${[0,1,2,3,4,5,6,7,8].map(k=>`<i${PIPS[n].includes(k)?' class="p"':""}></i>`).join("")}</span>`;
const tileHtml=(t,cls,attrs)=>`<div class="dt ${t[0]===t[1]?"dbl":""} ${cls||""}" ${attrs||""}>${half(t[0])}${half(t[1])}</div>`;
const pipSum=h=>h.reduce((s,t)=>s+t[0]+t[1],0);
function dmDeal(starter){ const all=[]; for(let a=0;a<=6;a++) for(let b=a;b<=6;b++) all.push([a,b]); shuffle(all);
  DM.hands=[all.splice(0,7),all.splice(0,7)]; DM.bone=all; DM.chain=[]; DM.turn=starter; DM.passes=0; DM.roundOver=null; DM.sel=-1; store.set("dominoes",DM); }
function dmNew(){ DM={score:[0,0],target:100,next:0}; dmDeal(rnd(2)); }
const ends=()=>DM.chain.length?[DM.chain[0][0],DM.chain[DM.chain.length-1][1]]:null;
function fits(t){ const e=ends(); if(!e) return ["L"]; const s=[]; if(t[0]===e[0]||t[1]===e[0]) s.push("L"); if(t[0]===e[1]||t[1]===e[1]) s.push("R"); return s; }
function dmPlace(p,idx,side){
  const t=DM.hands[p].splice(idx,1)[0], e=ends();
  if(!e) DM.chain.push(t);
  else if(side==="L") DM.chain.unshift(t[1]===e[0]?[t[0],t[1]]:[t[1],t[0]]);
  else DM.chain.push(t[0]===e[1]?[t[0],t[1]]:[t[1],t[0]]);
  DM.passes=0; DM.last=side==="L"?0:DM.chain.length-1; buzz(12);
  if(!DM.hands[p].length) return dmRoundEnd(p,false);
  DM.turn=1-p; store.set("dominoes",DM); dmDraw(); if(DM.turn===1) setTimeout(dmBot,700);
}
function dmPass(p){ DM.passes++; toast(p===0?tr("Pass"):T("The bot passes","الكمبيوتر يتخطى")); if(DM.passes>=2){ const a=pipSum(DM.hands[0]), b=pipSum(DM.hands[1]); return dmRoundEnd(a===b?-1:a<b?0:1,true); } DM.turn=1-p; store.set("dominoes",DM); dmDraw(); if(DM.turn===1) setTimeout(dmBot,700); }
function dmRoundEnd(w,blocked){
  const pts=w<0?0:pipSum(DM.hands[1-w]); if(w>=0) DM.score[w]+=pts; DM.roundOver={w,pts,blocked}; DM.next=w<0?1-DM.turn:w; store.set("dominoes",DM); dmDraw();
  const match=DM.score[0]>=DM.target||DM.score[1]>=DM.target;
  if(w===0) confetti();
  setTimeout(()=>modal(`<h3>${match?tr(DM.score[0]>=DM.target?"Match won!":"Bot won the match"):tr("Round over")}</h3>
    <p class="sub">${blocked?tr("Blocked: lowest hand wins")+"<br>":""}${w<0?tr("Draw"):(w===0?T(`You get ${pts} points`,`حصلت على ${pts} نقطة`):T(`The bot gets ${pts} points`,`حصل الكمبيوتر على ${pts} نقطة`))}</p>
    <div class="dmhand small">${DM.hands[1].map(t=>tileHtml(t)).join("")}</div>
    <p><b>${esc(ME())} ${DM.score[0]} – ${DM.score[1]} ${tr("Bot")}</b></p>
    <button class="btn primary" data-act="${match?"dmNew":"dmNext"}">${tr(match?"New game":"Next round")}</button>`),600);
}
function dmBot(){
  if(!DM||DM.roundOver||DM.turn!==1||S.game!=="dominoes") return;
  const h=DM.hands[1]; let opts=h.map((t,i)=>({t,i,s:fits(t)})).filter(o=>o.s.length);
  while(!opts.length&&DM.bone.length){ h.push(DM.bone.pop()); opts=h.map((t,i)=>({t,i,s:fits(t)})).filter(o=>o.s.length); }
  if(!opts.length){ dmDraw(); return dmPass(1); }
  // play the heaviest tile, doubles first; prefer the end that leaves a number the bot still holds
  opts.sort((a,b)=>(b.t[0]+b.t[1]+(b.t[0]===b.t[1]?4:0))-(a.t[0]+a.t[1]+(a.t[0]===a.t[1]?4:0)));
  const o=opts[0]; dmPlace(1,o.i,o.s[o.s.length>1&&Math.random()<.5?1:0]);
}
function dmDraw(){
  const c=$("#dmChain"); if(!c) return; const sel=DM.sel>=0?DM.hands[0][DM.sel]:null, sides=sel?fits(sel):[];
  c.innerHTML=DM.chain.length?DM.chain.map((t,i)=>tileHtml(t,(i===DM.last?"lastp ":"")+((i===0&&sides.includes("L")&&sides.length>1)?"endpick":"")+((i===DM.chain.length-1&&sides.includes("R")&&sides.length>1)?" endpick":""),(i===0&&sides.length>1)?'data-act="dmEnd" data-s="L"':(i===DM.chain.length-1&&sides.length>1)?'data-act="dmEnd" data-s="R"':"")).join(""):`<p class="sub">${tr("Tap a tile to play it.")}</p>`;
  const can=DM.hands[0].map(t=>fits(t).length>0), myTurn=DM.turn===0&&!DM.roundOver;
  $("#dmHand").classList.toggle("many",DM.hands[0].length>8);
  $("#dmHand").innerHTML=DM.hands[0].map((t,i)=>tileHtml(t,(i===DM.sel?"sel ":"")+(myTurn&&!can[i]?"dim":""),`data-act="dmTile" data-i="${i}"`)).join("");
  $("#dmBotHand").innerHTML=DM.hands[1].map(()=>'<div class="dt back"></div>').join("");
  $("#dmScore").textContent=`${ME()} ${DM.score[0]} – ${DM.score[1]} ${tr("Bot")}`; $("#dmBone").textContent=DM.bone.length;
  requestAnimationFrame(()=>GAMES.dominoes&&GAMES.dominoes.resize());
  const any=can.some(x=>x), act=$("#dmAct");
  act.innerHTML=!myTurn?`<span class="sub">${DM.roundOver?"":tr("Bot is thinking…")}</span>`:any?(sel&&sides.length>1?`<button class="btn" data-act="dmEnd" data-s="L">◀</button><span class="sub">${tr("Choose an end")}</span><button class="btn" data-act="dmEnd" data-s="R">▶</button>`:`<span class="sub">${tr("Your turn")}</span>`):DM.bone.length?`<button class="btn primary" data-act="dmDrawTile">${tr("Draw a tile")}</button>`:`<button class="btn primary" data-act="dmPassBtn">${tr("Pass")}</button>`;
}
ACT.dmTile=el=>{ if(DM.turn!==0||DM.roundOver) return; const i=+el.dataset.i, s=fits(DM.hands[0][i]); if(!s.length){ el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); return; }
  if(s.length===1) return dmPlace(0,i,s[0]); DM.sel=i; dmDraw(); };
ACT.dmEnd=el=>{ if(DM.sel<0) return; const i=DM.sel; DM.sel=-1; dmPlace(0,i,el.dataset.s); };
ACT.dmDrawTile=()=>{ if(!DM.bone.length) return; DM.hands[0].push(DM.bone.pop()); store.set("dominoes",DM); dmDraw(); };
ACT.dmPassBtn=()=>dmPass(0);
ACT.dmNext=()=>{ closeModal(); dmDeal(DM.next); GAMES.dominoes.render($("#v-games")); };
ACT.dmNew=()=>{ closeModal(); dmNew(); GAMES.dominoes.render($("#v-games")); };
ACT.dmAsk=()=>modal(`<h3>${tr("Start a new game?")}</h3><p class="sub">${tr("Your current game will be lost.")}</p><div class="row"><button class="btn primary grow" data-act="dmNew">${tr("Start over")}</button><button class="btn grow" data-act="modalClose">${tr("Cancel")}</button></div>`);
register("dominoes",{
  card:()=>card("dominoes","domcard",`<span class="dgicon">${tileHtml([6,3])}${tileHtml([3,5])}</span>`,"Dominoes","Match the ends, first to 100 wins"),
  open(){ if(!DM){ const s=store.get("dominoes",null); if(s&&s.hands) DM=s; else dmNew(); } },
  render(v){
    v.innerHTML=frame("",`<div class="gstats"><span id="dmScore"></span><span>${tr("Boneyard")} <b id="dmBone"></b></span><button class="btn small" data-act="dmAsk">${tr("New game")}</button></div>
      <div class="dmhand bot" id="dmBotHand"></div>
      <div class="dmtable" id="dmTable"><div class="dmchain" id="dmChain"></div></div>
      <div class="dmact" id="dmAct"></div>
      <div class="dmhand mine" id="dmHand"></div>`,`<b>${tr("Dominoes")}</b>`);
    afterRender(); dmDraw(); this.resize();
    if(DM.roundOver){ /* finished round still open: start the next one */ ACT.dmNext(); return; }
    if(DM.turn===1) setTimeout(dmBot,600);
  },
  resize(){ const t=$("#dmTable"); if(!t) return; const root=$("#gameRoot"), other=[...root.children].filter(c=>c!==t&&(!S.gfs||!c.classList.contains("gtop"))).reduce((s,c)=>s+c.offsetHeight+10,0);
    const h=S.gfs?window.innerHeight-other-40:window.innerHeight-(root.getBoundingClientRect().top+window.scrollY)-other-$(".tabs").offsetHeight-14; t.style.minHeight=Math.max(110,h-8)+"px"; }
});

/* =================== BACKGAMMON (طاولة) =================== */
/* p[1..24]: >0 = your checkers (you move 24 -> 1 and bear off below 1), <0 = bot (moves 1 -> 24). bar/off: [you, bot] */
const BI=s=>s>0?0:1;
function bgInit(){ const p=Array(26).fill(0); p[24]=2; p[13]=5; p[8]=3; p[6]=5; p[1]=-2; p[12]=-5; p[17]=-3; p[19]=-5; return {p,bar:[0,0],off:[0,0]}; }
const bgClone=st=>({p:st.p.slice(),bar:st.bar.slice(),off:st.off.slice()});
const bgOpen=(st,s,pt)=>s>0?st.p[pt]>=-1:st.p[pt]<=1;
function bgAllHome(st,s){ if(st.bar[BI(s)]) return false; for(let i=1;i<=24;i++){ const v=st.p[i]; if(s>0&&v>0&&i>6) return false; if(s<0&&v<0&&i<19) return false; } return true; }
function bgSingles(st,s,d){
  const out=[], I=BI(s);
  if(st.bar[I]){ const to=s>0?25-d:d; if(bgOpen(st,s,to)) out.push({f:"bar",t:to,d}); return out; }
  const home=bgAllHome(st,s);
  for(let i=1;i<=24;i++){ const v=st.p[i]; if(!(s>0?v>0:v<0)) continue; const to=s>0?i-d:i+d;
    if(to>=1&&to<=24){ if(bgOpen(st,s,to)) out.push({f:i,t:to,d}); }
    else if(home){ let ok=s>0?to===0:to===25;
      if(!ok){ ok=true; if(s>0){ for(let k=i+1;k<=6;k++) if(st.p[k]>0) ok=false; } else { for(let k=i-1;k>=19;k--) if(st.p[k]<0) ok=false; } }
      if(ok) out.push({f:i,t:"off",d}); } }
  return out;
}
function bgApply(st,s,m){ const n=bgClone(st), I=BI(s); if(m.f==="bar") n.bar[I]--; else n.p[m.f]-=s;
  if(m.t==="off") n.off[I]++; else { if(n.p[m.t]===-s){ n.p[m.t]=0; n.bar[1-I]++; m.hit=true; } n.p[m.t]+=s; } return n; }
const bgKey=st=>st.p.join(",")+"|"+st.bar+"|"+st.off;
const without=(rem,d)=>{ const r=rem.slice(); r.splice(r.indexOf(d),1); return r; };
function bgMax(st,s,rem,memo){ // most dice that can still be played
  if(!rem.length) return 0; const key=bgKey(st)+"#"+rem.slice().sort().join(""); if(memo.has(key)) return memo.get(key);
  let best=0; for(const d of new Set(rem)){ for(const m of bgSingles(st,s,d)){ best=Math.max(best,1+bgMax(bgApply(st,s,m),s,without(rem,d),memo)); if(best===rem.length) break; } if(best===rem.length) break; }
  memo.set(key,best); return best;
}
function bgAllowed(st,s,rem,need,dice,memo){ // single moves that keep a maximal sequence possible
  if(need<=0) return [];
  let out=[]; for(const d of new Set(rem)) for(const m of bgSingles(st,s,d)) if(1+bgMax(bgApply(st,s,m),s,without(rem,d),memo)===need) out.push(m);
  if(dice.length===2&&dice[0]!==dice[1]&&rem.length===2&&need===1){ const hi=Math.max(...dice); if(out.some(m=>m.d===hi)) out=out.filter(m=>m.d===hi); }
  return out;
}
function bgEval(st,s){
  const I=BI(s), O=1-I; let sc=0;
  const pip=side=>{ let t=st.bar[BI(side)]*25; for(let i=1;i<=24;i++){ const v=st.p[i]; if(side>0&&v>0) t+=v*i; if(side<0&&v<0) t+=(-v)*(25-i); } return t; };
  sc+=(pip(-s)-pip(s))+st.off[I]*4+st.bar[O]*14;
  let run=0, prime=0;
  for(let k=1;k<=24;k++){ const i=s>0?k:25-k, v=st.p[i]*s;
    if(v>=2){ sc+=k<=6?7:k>=19?5:3; run++; prime=Math.max(prime,run); } else run=0;
    if(v===1){ let shots=0;
      for(let j=0;j<=25;j++){ const ov=j===0||j===25?((s>0&&j===0)||(s<0&&j===25)?st.bar[O]:0):Math.max(0,-st.p[j]*s); if(!ov) continue; const dist=s>0?i-j:j-i; if(dist>=1&&dist<=12) shots+=ov*(dist<=6?2:1); }
      sc-=Math.min(shots,10)*(1.2+(25-k)/9); } }
  return sc+prime*prime*1.5;
}
let BG=null, bgBusy=false;
const bgState=()=>({p:BG.p,bar:BG.bar,off:BG.off});
function bgNewGame(keep){ const st=bgInit(); BG=Object.assign({score:keep&&BG?BG.score:[0,0]},st,{turn:Math.random()<.5?1:-1,dice:[],rem:[],made:[],start:null,need:0,phase:"roll",sel:null,over:null}); store.set("bg",BG); }
const roll=()=>{ const a=1+rnd(6), b=1+rnd(6); return a===b?[a,a,a,a]:[a,b]; };
function bgBeginTurn(){ const st=bgState(), memo=new Map(); BG.rem=BG.dice.slice(); BG.made=[]; BG.start=bgClone(st); BG.need=bgMax(st,BG.turn,BG.rem,memo); BG.sel=null; }
function bgCheckWin(){ const I=BI(BG.turn); if(BG.off[I]<15) return false;
  const L=1-I; let mult=1; if(!BG.off[L]){ mult=2; const loser=-BG.turn; let back=BG.bar[L]>0; for(let i=1;i<=24;i++){ const v=BG.p[i]*loser; if(v>0&&(BG.turn>0?i<=6:i>=19)) back=true; } if(back) mult=3; }
  BG.score[I]+=mult; BG.over={w:BG.turn,mult}; BG.phase="over"; store.set("bg",BG); bgDraw();
  if(BG.turn>0) confetti();
  setTimeout(()=>modal(`<div class="result">${BG.turn>0?"🏆":"🎲︎"}</div><h3>${tr(BG.turn>0?"You win!":"Bot wins")}</h3><p class="sub">${mult===3?T("Backgammon! ×3","فوز ساحق ×3"):mult===2?T("Gammon! ×2","فوز مزدوج ×2"):""}</p><p><b>${esc(ME())} ${BG.score[0]} – ${BG.score[1]} ${tr("Bot")}</b></p><button class="btn primary" data-act="bgNext">${tr("Next game")}</button>`),600);
  return true; }
function bgEndTurn(){ if(bgCheckWin()) return; BG.turn=-BG.turn; BG.dice=[]; BG.rem=[]; BG.made=[]; BG.phase="roll"; BG.sel=null; store.set("bg",BG); bgDraw(); if(BG.turn<0) setTimeout(bgBotTurn,600); }
function bgDoMove(m){ const st=bgApply(bgState(),BG.turn,m); BG.p=st.p; BG.bar=st.bar; BG.off=st.off; BG.rem=without(BG.rem,m.d); BG.made.push(m); buzz(m.hit?[20,30,20]:10); }
function bgRoll(){
  if(BG.phase!=="roll"||BG.turn<0) return; BG.dice=roll(); bgBeginTurn(); BG.phase="move"; store.set("bg",BG); bgDraw(true);
  if(!BG.need){ toast(tr("No legal moves")); setTimeout(bgEndTurn,1200); }
}
function bgBotTurn(){
  if(!BG||BG.turn>0||BG.phase==="over"||S.game!=="backgammon") return;
  BG.dice=roll(); bgBeginTurn(); BG.phase="bot"; bgDraw(true);
  const start=bgState(), s=-1, memo=new Map(), finals=new Map();
  (function rec(st,rem,path){ const need=BG.need-path.length; const al=bgAllowed(st,s,rem,need,BG.dice,memo);
    if(!al.length){ const k=bgKey(st); if(!finals.has(k)) finals.set(k,{st,path}); return; }
    for(const m of al) rec(bgApply(st,s,m),without(rem,m.d),path.concat([m])); })(bgClone(start),BG.rem.slice(),[]);
  let best=null, bs=-Infinity; for(const f of finals.values()){ const sc=bgEval(f.st,s)+Math.random()*2; if(sc>bs){ bs=sc; best=f; } }
  if(!best||!best.path.length){ setTimeout(()=>{ toast(tr("Bot has no moves")); bgEndTurn(); },900); return; }
  let i=0; (function step(){ if(S.game!=="backgammon"||!BG||BG.phase!=="bot") return; if(i>=best.path.length) return setTimeout(bgEndTurn,450);
    const m=best.path[i++]; m.hit=false; bgDoMove(m); BG.lastBot=m; bgDraw(); setTimeout(step,620); })();
}
function bgCurAllowed(){ if(BG.phase!=="move"||BG.turn<0) return []; return bgAllowed(bgState(),1,BG.rem,BG.need-BG.made.length,BG.dice,new Map()); }
ACT.bgRoll=()=>bgRoll();
ACT.bgPt=el=>{
  const raw=el.dataset.pt, pt=raw==="bar"||raw==="off"?raw:+raw, al=bgCurAllowed(); if(!al.length) return;
  if(BG.sel!==null){ const m=al.find(x=>x.f===BG.sel&&x.t===pt); if(m){ BG.sel=null; bgDoMove(m); store.set("bg",BG);
      if(BG.made.length>=BG.need||!bgCurAllowed().length){ bgDraw(); return setTimeout(bgEndTurn,450); }
      const nx=bgCurAllowed(); if(nx.length&&nx.every(x=>x.f===m.t)) BG.sel=m.t; return bgDraw(); } }
  BG.sel=al.some(x=>x.f===pt)&&BG.sel!==pt?pt:null; bgDraw();
};
ACT.bgUndo=()=>{ if(BG.phase!=="move"||!BG.made.length) return; const st=BG.start; BG.p=st.p.slice(); BG.bar=st.bar.slice(); BG.off=st.off.slice(); BG.rem=BG.dice.slice(); BG.made=[]; BG.sel=null; store.set("bg",BG); bgDraw(); };
ACT.bgNext=()=>{ closeModal(); bgNewGame(true); GAMES.backgammon.render($("#v-games")); };
ACT.bgAsk=()=>modal(`<h3>${tr("Start a new game?")}</h3><p class="sub">${tr("Your current game will be lost.")}</p><div class="row"><button class="btn primary grow" data-act="bgReset">${tr("Start over")}</button><button class="btn grow" data-act="modalClose">${tr("Cancel")}</button></div>`);
ACT.bgReset=()=>{ closeModal(); bgNewGame(false); GAMES.backgammon.render($("#v-games")); };
const dieHtml=(n,used)=>`<span class="die${used?" used":""}">${[0,1,2,3,4,5,6,7,8].map(k=>`<i${PIPS[n].includes(k)?' class="p"':""}></i>`).join("")}</span>`;
function bgDraw(rolled){
  const B=$("#bgBoard"); if(!B) return;
  const W=B.clientWidth, H=W*0.95, tw=W*0.085, bw=W*0.07, pw=(W-tw-bw)/12, cd=Math.min(pw*0.94,H*0.42/5);
  B.style.height=H+"px";
  const al=bgCurAllowed(), sources=new Set(al.map(m=>m.f)), dests=new Set(BG.sel!==null?al.filter(m=>m.f===BG.sel).map(m=>m.t):[]);
  const xOf=slot=>slot<6?slot*pw:slot*pw+bw;
  const stack=(n,col,top,x,mark)=>{ let h=""; const show=Math.min(n,5); for(let k=0;k<show;k++){ const y=top?k*cd:H-(k+1)*cd; h+=`<i class="ck ${col}${mark&&k===show-1?" mark":""}" style="left:${x+(pw-cd)/2}px;top:${y}px;width:${cd}px;height:${cd}px">${k===show-1&&n>5?n:""}</i>`; } return h; };
  let h="";
  for(let pt=1;pt<=24;pt++){ const top=pt>=13, slot=top?pt-13:12-pt, x=xOf(slot), v=BG.p[pt];
    const cls=["bgpt",top?"top":"bot",slot%2?"b":"a"]; if(sources.has(pt)) cls.push("src"); if(BG.sel===pt) cls.push("sel"); if(dests.has(pt)) cls.push("dst");
    h+=`<div class="${cls.join(" ")}" data-act="bgPt" data-pt="${pt}" style="left:${x}px;width:${pw}px;height:${H*0.44}px"></div>`;
    if(v) h+=stack(Math.abs(v),v>0?"w":"k",top,x,BG.lastBot&&BG.lastBot.t===pt&&v<0); }
  // bar and bear-off tray
  const bx=6*pw; h+=`<div class="bgbar${sources.has("bar")?" src":""}${BG.sel==="bar"?" sel":""}" data-act="bgPt" data-pt="bar" style="left:${bx}px;width:${bw}px"></div>`;
  for(let k=0;k<BG.bar[0];k++) h+=`<i class="ck w" style="left:${bx+(bw-cd*0.9)/2}px;top:${H*0.3-k*cd*0.5}px;width:${cd*0.9}px;height:${cd*0.9}px"></i>`;
  for(let k=0;k<BG.bar[1];k++) h+=`<i class="ck k" style="left:${bx+(bw-cd*0.9)/2}px;top:${H*0.6+k*cd*0.5}px;width:${cd*0.9}px;height:${cd*0.9}px"></i>`;
  const tx=W-tw; h+=`<div class="bgtray${dests.has("off")?" dst":""}" data-act="bgPt" data-pt="off" style="left:${tx}px;width:${tw}px"></div>`;
  for(let k=0;k<BG.off[1];k++) h+=`<i class="slab k" style="left:${tx+tw*0.12}px;top:${4+k*(H*0.42/15)}px;width:${tw*0.76}px;height:${H*0.42/15-1}px"></i>`;
  for(let k=0;k<BG.off[0];k++) h+=`<i class="slab w" style="left:${tx+tw*0.12}px;top:${H-4-(k+1)*(H*0.42/15)}px;width:${tw*0.76}px;height:${H*0.42/15-1}px"></i>`;
  // dice / roll button in the right half
  const cx=xOf(6)+pw*3, mid=H/2;
  let dice=""; if(BG.dice.length){ const used=BG.dice.length-BG.rem.length; dice=BG.dice.map((d,i)=>dieHtml(d,i<used)).join(""); }
  h+=`<div class="bgmid" style="left:${cx}px;top:${mid}px">${BG.phase==="roll"&&BG.turn>0?`<button class="btn primary" data-act="bgRoll">🎲︎ ${tr("Roll")}</button>`:`<div class="dice${rolled?" rolling":""}">${dice}</div>`}</div>`;
  B.innerHTML=h;
  $("#bgScore").textContent=`${ME()} ${BG.score[0]} – ${BG.score[1]} ${tr("Bot")}`;
  $("#bgStat").textContent=BG.phase==="over"?"":BG.turn<0?tr("Bot is thinking…"):BG.phase==="roll"?tr("Your turn"):tr("Tap a checker, then where to move it.");
  const u=$("#bgUndoBtn"); if(u) u.disabled=!(BG.phase==="move"&&BG.made.length);
}
register("backgammon",{
  card:()=>card("backgammon","bgcard",`<span class="bggicon">${dieHtml(5)}${dieHtml(3)}</span>`,"Backgammon","Play the bot, first to bear off wins"),
  open(){ if(!BG){ const s=store.get("bg",null); if(s&&Array.isArray(s.p)&&s.phase!=="over"){ BG=s; if(BG.phase==="bot"){ BG.p=BG.start.p.slice(); BG.bar=BG.start.bar.slice(); BG.off=BG.start.off.slice(); BG.phase="roll"; BG.dice=[]; BG.rem=[]; } } else bgNewGame(false); } },
  render(v){
    v.innerHTML=frame("",`<div class="gstats"><span id="bgScore"></span><button class="btn small" id="bgUndoBtn" data-act="bgUndo">↶ ${tr("Undo moves")}</button><button class="btn small" data-act="bgAsk">${tr("New game")}</button></div>
      <div class="bgboard" id="bgBoard" dir="ltr"></div>
      <p class="sub center" id="bgStat"></p>`,`<b>${tr("Backgammon")}</b>`);
    afterRender(); this.resize();
    if(BG.turn<0&&BG.phase==="roll") setTimeout(bgBotTurn,700);
  },
  resize(){ const B=$("#bgBoard"); if(!B) return; B.style.width=fit(B,600,1/0.95)+"px"; bgDraw(); }
});

/* =================== STYLES =================== */
const css=`
.gcards{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.gcard{flex-direction:column;align-items:flex-start;min-height:150px;padding:14px;gap:10px}
.gcard .gtxt b{font-size:17px}.gcard .gtxt span{font-size:12.5px;line-height:1.35}
.gcard .gicon{width:56px;height:56px}
.sudokucard{background:linear-gradient(135deg,#0f766e,#14b8a6)}.minescard{background:linear-gradient(135deg,#475569,#94a3b8)}
.fourcard{background:linear-gradient(135deg,#1d4ed8,#3b82f6)}.mergecard{background:linear-gradient(135deg,#c2410c,#f59e0b)}
.solcard{background:linear-gradient(135deg,#166534,#22a35a)}.bgcard{background:linear-gradient(135deg,#7c2d12,#b45309)}.domcard{background:linear-gradient(135deg,#1f2937,#4b5563)}
.sgicon{display:grid;grid-template-columns:repeat(3,15px);gap:2px}.sgicon i{width:15px;height:15px;background:rgba(255,255,255,.9);color:#0f766e;font:800 11px/15px sans-serif;text-align:center;font-style:normal;border-radius:2px}
.mgicon,.mggicon{display:grid;grid-template-columns:repeat(2,22px);gap:3px}.mgicon i,.mggicon i{height:22px;border-radius:4px;background:rgba(255,255,255,.88);color:#334155;font:800 12px/22px sans-serif;text-align:center;font-style:normal}
.mggicon i{background:#fde68a;color:#7c2d12}.mggicon i:nth-child(3){background:#fb923c;color:#fff}.mggicon i:nth-child(4){background:#ef4444;color:#fff;font-size:10px}
.fgicon{display:grid;grid-template-columns:repeat(3,14px);gap:3px}.fgicon i{width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,.25)}.fgicon i.d1{background:#facc15}.fgicon i.d2{background:#ef4444}
.cgicon{position:relative;width:52px;height:46px}.cgicon i{position:absolute;width:30px;height:42px;border-radius:5px;background:#fff;color:#111;font:800 11px/1.1 sans-serif;font-style:normal;padding:3px;box-shadow:0 2px 4px rgba(0,0,0,.3)}.cgicon i.r{color:#c81e1e;transform:rotate(-12deg)}.cgicon i:nth-child(2){left:18px;transform:rotate(10deg)}
.bggicon,.dgicon{display:flex;gap:4px;align-items:center}.bggicon .die{width:24px;height:24px}
.dgicon .dt{transform:scale(.62);transform-origin:center;margin:-9px -12px}
.gmid{flex:1;text-align:center;min-width:0}.gmid b{font-size:16px}
.gwrap.fs .gmid{position:fixed;top:calc(env(safe-area-inset-top) + 18px);left:50%;transform:translateX(-50%);width:auto}
.gstats{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:14px;flex-wrap:wrap}
.gstats b{font-variant-numeric:tabular-nums}
.center{text-align:center}
.diffs{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.confetti{position:fixed;inset:0;pointer-events:none;z-index:70;overflow:hidden}.confetti i{position:absolute;top:-12px;width:9px;height:14px;border-radius:2px;animation:fall 1.8s ease-in forwards}
@keyframes fall{to{transform:translateY(105vh) rotate(720deg)}}
.shake{animation:shake .3s}@keyframes shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
/* sudoku */
.sugrid{--w:340px;width:var(--w);height:var(--w);align-self:center;display:grid;grid-template-columns:repeat(9,1fr);border:2px solid var(--ink);border-radius:6px;overflow:hidden;background:var(--panel)}
.sc{border:0;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--panel);font:600 calc(var(--w)/15)/1 -apple-system,sans-serif;color:#2563eb;padding:0;display:grid;place-items:center;min-width:0}
.sc.br{border-right:2px solid var(--ink)}.sc.bb{border-bottom:2px solid var(--ink)}
.sc.given{color:var(--ink);font-weight:700}.sc.peer{background:color-mix(in srgb,#3b82f6 9%,var(--panel))}.sc.same{background:color-mix(in srgb,#3b82f6 22%,var(--panel))}
.sc.sel{background:color-mix(in srgb,#3b82f6 38%,var(--panel))}.sc.err{color:#dc2626;background:color-mix(in srgb,#dc2626 14%,var(--panel))}
.nts{display:grid;grid-template-columns:repeat(3,1fr);width:100%;height:100%;padding:1px}.nts i{font:500 calc(var(--w)/38)/1 sans-serif;color:var(--muted);font-style:normal;display:grid;place-items:center}
.sutools{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.sutools .btn{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:18px;padding:6px}.sutools small{font-size:11px;font-weight:600}
.sutools .btn.on{background:#2563eb;color:#fff;border-color:#2563eb}
.supad{display:grid;grid-template-columns:repeat(9,1fr);gap:4px}.supad .btn{padding:6px 0;display:flex;flex-direction:column;align-items:center;min-height:52px}.supad b{font-size:22px;color:#2563eb}.supad small{font-size:10px;color:var(--muted);min-height:12px}
.supad .btn:disabled{opacity:.25}
/* minesweeper */
.msgrid{--w:330px;width:var(--w);align-self:center;display:grid;gap:2px;padding:4px;background:#64748b;border-radius:8px;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.mc{aspect-ratio:1;border:0;padding:0;border-radius:3px;background:linear-gradient(#cbd5e1,#94a3b8);font:800 calc(var(--w)/20)/1 -apple-system,sans-serif;display:grid;place-items:center;color:#111;touch-action:manipulation}
.mc.open{background:#e2e8f0}.mc.flag{color:#dc2626}.mc.flag.wrong{background:#fecaca}.mc.mine{background:#fca5a5}.mc.boom{background:#dc2626;color:#fff}
.mc.n1{color:#2563eb}.mc.n2{color:#16a34a}.mc.n3{color:#dc2626}.mc.n4{color:#1e3a8a}.mc.n5{color:#7f1d1d}.mc.n6{color:#0e7490}.mc.n7{color:#111}.mc.n8{color:#6b7280}
.msmode,.msdiff,.c4diff,.soDraw{display:inline-grid;grid-auto-flow:column;grid-template-columns:none}
.msmode{display:grid;grid-template-columns:1fr 1fr}
/* four in a row */
.c4board{--w:330px;width:var(--w);align-self:center;background:#1d4ed8;border-radius:14px;padding:6px;box-shadow:0 6px 18px rgba(0,0,0,.3)}
.cdot{display:inline-block;width:12px;height:12px;border-radius:50%;vertical-align:middle}.cdot.y{background:#facc15}.cdot.r{background:#ef4444}
.qc4{display:flex;gap:4px}.qc4 i{width:22px;height:22px;border-radius:50%;background:#facc15}.qc4 i+i{background:#ef4444}
.c4grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.c4c{aspect-ratio:1;border-radius:50%;background:var(--ground);position:relative;overflow:hidden;cursor:pointer}
.disc{position:absolute;inset:4%;border-radius:50%;box-shadow:inset 0 -4px 0 rgba(0,0,0,.25)}.disc.p1{background:#facc15}.disc.p2{background:#ef4444}
.disc.drop{animation:drop .35s cubic-bezier(.4,0,.8,1.2)}@keyframes drop{from{transform:translateY(calc(var(--fall) * -110%))}}
.disc.winc{outline:3px solid #fff;outline-offset:-3px;animation:pulse 1s infinite}@keyframes pulse{50%{transform:scale(.88)}}
/* merge */
.mgboard{--w:330px;--g:calc(var(--w)*.028);width:var(--w);height:var(--w);align-self:center;position:relative;background:#7c6a58;border-radius:12px;padding:var(--g);display:grid;grid-template-columns:repeat(4,1fr);gap:var(--g);touch-action:none}
.mgcell{border-radius:8px;background:rgba(255,255,255,.18)}
.mgtiles{position:absolute;inset:var(--g)}
.mt{--s:calc((var(--w) - var(--g)*5)/4);position:absolute;left:0;top:0;width:var(--s);height:var(--s);border-radius:8px;display:grid;place-items:center;font:800 calc(var(--s)*.4)/1 -apple-system,sans-serif;transform:translate(calc(var(--c)*(var(--s) + var(--g))),calc(var(--r)*(var(--s) + var(--g))));transition:transform .12s ease-out;background:#eee4da;color:#5b4a3a}
.mt.new{animation:tnew .18s ease-out}.mt.pop{animation:tpop .2s ease-out}
@keyframes tnew{from{opacity:0;scale:.3}}@keyframes tpop{50%{scale:1.15}}
.mt.v4{background:#ede0c8}.mt.v8{background:#f2b179;color:#fff}.mt.v16{background:#f59563;color:#fff}.mt.v32{background:#f67c5f;color:#fff}.mt.v64{background:#f65e3b;color:#fff}
.mt.v128{background:#edcf72;color:#fff;font-size:calc(var(--s)*.33)}.mt.v256{background:#edcc61;color:#fff;font-size:calc(var(--s)*.33)}.mt.v512{background:#edc850;color:#fff;font-size:calc(var(--s)*.33)}
.mt.v1024,.mt.v2048,.mt.v4096{background:#3c9d9b;color:#fff;font-size:calc(var(--s)*.27)}
/* solitaire */
.soboard{position:relative;align-self:center;margin-top:2px;user-select:none;-webkit-user-select:none}
.soboard .slot{position:absolute;top:0;width:var(--cw);height:var(--ch);border-radius:7px;border:2px dashed rgba(127,127,127,.4);display:grid;place-items:center;color:rgba(127,127,127,.5);font-size:22px}
.soboard .slot.stock{border-style:solid;cursor:pointer}.soboard .slot.stock.empty::after{content:"↻";font-size:26px}
.cd{position:absolute;left:0;top:0;width:var(--cw);height:var(--ch);border-radius:7px;background:#fff;color:#111;box-shadow:0 1px 3px rgba(0,0,0,.35);transition:transform .2s ease-out;cursor:pointer;overflow:hidden}
.cd.red{color:#c81e1e}.cd .tl{position:absolute;top:3px;left:4px;font:800 calc(var(--cw)*.3)/1 -apple-system,sans-serif;text-align:center}
.cd .mid{position:absolute;right:4px;bottom:2px;font-size:calc(var(--cw)*.55);line-height:1}
.cd.back{background:repeating-linear-gradient(45deg,#1e3a8a 0 5px,#2563eb 5px 10px);border:2px solid #fff}.cd.back>*{display:none}
/* dominoes */
.dt{display:inline-flex;background:#fafaf5;border-radius:6px;border:1px solid #bbb;box-shadow:0 1px 2px rgba(0,0,0,.3);padding:2px;gap:2px;position:relative}
.dt .dh{display:grid;grid-template-columns:repeat(3,7px);grid-template-rows:repeat(3,7px);gap:1px;padding:2px}
.dt .dh+.dh{border-inline-start:1.5px solid #999}.dt .dh i{border-radius:50%}.dt .dh i.p{background:#111}
.dt.dbl{flex-direction:column}.dt.dbl .dh+.dh{border-inline-start:0;border-top:1.5px solid #999}
.dt.back{width:22px;height:40px;background:linear-gradient(135deg,#334155,#1e293b);border-color:#0f172a}
.dmhand{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}
.dmhand.bot{gap:3px}.dmhand.small{transform:scale(.8)}
.dmhand.mine{gap:5px;flex-wrap:wrap}.dmhand.mine .dt{cursor:pointer;flex-direction:column;transition:transform .15s}.dmhand.mine .dt .dh{grid-template-columns:repeat(3,8px);grid-template-rows:repeat(3,8px)}.dmhand.mine .dt .dh+.dh{border-inline-start:0;border-top:1.5px solid #999}
.dmhand.mine .dt.sel{outline:3px solid var(--signal);transform:translateY(-8px)}.dmhand.mine .dt.dim{opacity:.4}
@media (max-width:380px){.dmhand.mine .dt .dh{grid-template-columns:repeat(3,7px);grid-template-rows:repeat(3,7px)}}
.dmhand.mine.many{gap:4px}.dmhand.mine.many .dt .dh{grid-template-columns:repeat(3,5px);grid-template-rows:repeat(3,5px)}
.dmtable{background:radial-gradient(circle at 50% 40%,#2f7d4f,#1b5e3a);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:center;min-height:160px}
.dmchain{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;align-items:center}
.dt.lastp{box-shadow:0 0 0 3px #facc15}.dt.endpick{box-shadow:0 0 0 3px var(--signal);cursor:pointer;animation:pulse 1s infinite}
.dmact{display:flex;justify-content:center;align-items:center;gap:10px;min-height:44px}
/* backgammon */
.bgboard{position:relative;align-self:center;background:#6b4423;border-radius:6px;overflow:hidden;box-shadow:0 0 0 4px #4a2c14,0 6px 18px rgba(0,0,0,.35);margin:4px auto}
.bgpt{position:absolute;cursor:pointer}
.bgpt::before{content:"";position:absolute;inset:0 6%;clip-path:polygon(0 0,100% 0,50% 100%)}
.bgpt.bot{bottom:0}.bgpt.bot::before{clip-path:polygon(50% 0,100% 100%,0 100%)}
.bgpt.a::before{background:#e8d2a6}.bgpt.b::before{background:#9b2c2c}
.bgpt.src::before{filter:brightness(1.2)}.bgpt.sel::before{background:#facc15}
.bgpt.dst::after{content:"";position:absolute;left:30%;right:30%;aspect-ratio:1;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.35)}
.bgpt.top.dst::after{bottom:4px}.bgpt.bot.dst::after{top:4px}
.bgbar{position:absolute;top:0;bottom:0;background:#4a2c14;cursor:pointer}.bgbar.src{box-shadow:inset 0 0 0 3px #facc15}
.bgtray{position:absolute;top:0;bottom:0;background:#3b2412;cursor:pointer}.bgtray.dst{box-shadow:inset 0 0 0 3px #22c55e}
.ck{position:absolute;border-radius:50%;pointer-events:none;display:grid;place-items:center;font:800 12px/1 sans-serif;font-style:normal}
.ck.w{background:radial-gradient(circle at 35% 30%,#fff,#d6d3c4);border:1px solid #8a8577;color:#333}.ck.k{background:radial-gradient(circle at 35% 30%,#555,#151515);border:1px solid #000;color:#eee}
.ck.mark{box-shadow:0 0 0 2px #facc15}
.slab{position:absolute;border-radius:2px;font-style:normal}.slab.w{background:#ede9dc}.slab.k{background:#111;border:1px solid #444}
.bgmid{position:absolute;transform:translate(-50%,-50%);z-index:5}
.dice{display:flex;gap:6px}.dice.rolling .die{animation:rollin .5s ease-out}
@keyframes rollin{0%{transform:rotate(-200deg) scale(.4);opacity:0}100%{transform:none;opacity:1}}
.die{display:inline-grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);width:34px;height:34px;padding:4px;background:#fff;border-radius:7px;box-shadow:0 2px 5px rgba(0,0,0,.4);gap:1px}
.die i{border-radius:50%}.die i.p{background:#111}.die.used{opacity:.35}
`;
document.head.insertAdjacentHTML("beforeend",`<style id="games-more-css">${css}</style>`);
/* read-only handle used by the automated tests */
/* the games list may already be on screen: draw it again now that these games exist */
if(S.view==="games"&&!S.game) show("games",true);
window.OUTPOST_CONFETTI=confetti;
window.OUTPOST_GAMES_DEBUG={su:()=>SU,ms:()=>MS,c4:()=>C4,mg:()=>MG,so:()=>SO,dm:()=>DM,bg:()=>BG,suSolve,suMake,bgInit,bgSingles,bgApply,bgMax,bgAllowed,bgEval,c4Win,fits:t=>fits(t)};
})();
