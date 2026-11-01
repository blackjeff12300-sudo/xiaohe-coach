'use strict';

const STORAGE_KEY = 'hexue-xiaohe-coach-v1';
const $ = (id) => document.getElementById(id);
const todayKey = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

const keyMap = {
  Q: { finals: ['iu'] }, W: { finals: ['ei'] }, E: { finals: ['e'] }, R: { finals: ['uan', 'üan'] }, T: { finals: ['üe (ue/ve)'] },
  Y: { finals: ['un', 'ün'] }, U: { initials: ['sh'], finals: ['u'] }, I: { initials: ['ch'], finals: ['i'] }, O: { finals: ['uo', 'o'] }, P: { finals: ['ie'] },
  A: { finals: ['a'] }, S: { finals: ['ong', 'iong'] }, D: { finals: ['ai'] }, F: { finals: ['en'] }, G: { finals: ['eng'] }, H: { finals: ['ang'] },
  J: { finals: ['an'] }, K: { finals: ['ing', 'uai'] }, L: { finals: ['iang', 'uang'] }, Z: { finals: ['ou'] }, X: { finals: ['ia', 'ua'] },
  C: { finals: ['ao'] }, V: { initials: ['zh'], finals: ['ui'] }, B: { finals: ['in'] }, N: { finals: ['iao'] }, M: { finals: ['ian'] }
};
const initials = [
  { id: 'initial-zh', category: 'initials', prompt: '声母 zh 在小鹤双拼中对应哪个键？', answer: 'V', explanation: 'zh 对应 V。记住三个特殊声母：zh = V、ch = I、sh = U。' },
  { id: 'initial-ch', category: 'initials', prompt: '声母 ch 在小鹤双拼中对应哪个键？', answer: 'I', explanation: 'ch 对应 I。I 同时也是韵母 i 的键位。' },
  { id: 'initial-sh', category: 'initials', prompt: '声母 sh 在小鹤双拼中对应哪个键？', answer: 'U', explanation: 'sh 对应 U。U 同时也是韵母 u 的键位。' }
];
const finals = [
  ['iu','Q'],['ei','W'],['e','E'],['uan','R'],['üan','R'],['üe','T'],['un','Y'],['ün','Y'],['u','U'],['i','I'],['uo','O'],['ie','P'],['a','A'],['ong','S'],['iong','S'],['ai','D'],['en','F'],['eng','G'],['ang','H'],['an','J'],['ing','K'],['uai','K'],['iang','L'],['uang','L'],['ou','Z'],['ia','X'],['ua','X'],['ao','C'],['ui','V'],['in','B'],['iao','N'],['ian','M']
].map(([sound,key]) => ({ id:`final-${sound}`, category:'finals', prompt:`韵母 ${sound} 对应小鹤键盘上的哪个键？`, answer:key, explanation:`韵母 ${sound} 对应 ${key} 键。一个键可能同时代表多个韵母，按题目中的拼音来记。` }));
const syllables = [
  ['ma','妈','MA'],['shi','是','UI'],['zhong','中','VS'],['wen','文','WF'],['shuang','双','UL'],['pin','拼','PB'],['xiao','小','XN'],['fei','飞','FW'],['zui','最','ZV'],['chun','春','IY'],['niang','娘','NL'],['huang','黄','HL'],['guang','光','GL'],['liu','六','LQ'],['dian','点','DM'],['qiu','秋','QQ'],['xue','学','XT'],['jue','觉','JT'],['yuan','远','YR'],['yue','月','YT'],['jiao','教','JN'],['ren','人','RF'],['guo','国','GO'],['chen','陈','IF'],['zhao','找','VC'],['zhuo','桌','VO'],['chuang','窗','IL'],['xiong','熊','XS'],['ting','听','TK'],['kuai','快','KK'],['ying','英','YK']
].map(([pinyin,example,code]) => ({ id:`syllable-${pinyin}`, category:'syllables', prompt:`“${example}”的拼音是 ${pinyin}，输入它的两键小鹤编码。`, answer:code, explanation:`${pinyin} → ${code[0]} + ${code[1]}。第一个键是声母，第二个键是韵母。` }));
const zeroInitials = [
  ['a','AA'],['ai','AI'],['an','AN'],['ang','AH'],['ao','AO'],['e','EE'],['ei','EI'],['en','EN'],['eng','EG'],['er','ER'],['o','OO'],['ou','OU']
].map(([pinyin,code]) => ({ id:`zero-${pinyin}`, category:'zero', prompt:`零声母音节 ${pinyin} 的小鹤编码是什么？`, answer:code, explanation:`${pinyin} → ${code}。零声母用韵母首字母代替声母；ang = AH，eng = EG，er = ER。` }));
const allQuestionPool = [...initials, ...finals, ...syllables, ...zeroInitials];
const zeroReference = zeroInitials.map(q => ({ pinyin:q.prompt.match(/音节 (.+) 的/)[1], code:q.answer }));
const texts = {
  daily: '每天花一点时间练习双拼，先把键位记熟，再慢慢提高输入速度。稳定而准确的输入，比一开始追求很快更重要。练习时先看清楚每个音节的声母和韵母，再连续输入两个字母。遇到不熟悉的键位，不妨停下来回想键盘上的位置。每天重复几次，正确的按键顺序就会慢慢变得自然。熟练之后，再尝试输入完整的句子和文章。',
  work: '清楚表达自己的想法，认真整理每一项工作内容。保持专注，按计划完成任务，也别忘记留一点时间复盘和休息。一个好的工作习惯，是先确认目标，再安排步骤，最后检查结果。遇到问题时，把复杂的事情拆成容易处理的小部分，逐项完成。持续学习新的方法，也要保持耐心和稳定的节奏。',
  classic: '读书破万卷，下笔如有神。纸上得来终觉浅，绝知此事要躬行。知之者不如好之者，好之者不如乐之者。学而不思则罔，思而不学则殆。山重水复疑无路，柳暗花明又一村。长风破浪会有时，直挂云帆济沧海。千里之行，始于足下。',
  custom: ''
};

function emptyState() {
  return {
    deviceMode: 'auto',
    categoryStats: { initials:{correct:0,total:0}, finals:{correct:0,total:0}, syllables:{correct:0,total:0}, zero:{correct:0,total:0} },
    itemStats: {},
    sessions: [],
    totalQuestions: 0,
    totalSessions: 0,
    totalMinutes: 0,
    bestCpm: 0,
    lastDiagnostic: null,
    todayCount: 0,
    todayDate: todayKey()
  };
}
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return emptyState();
    const base = emptyState();
    return { ...base, ...saved, categoryStats: { ...base.categoryStats, ...(saved.categoryStats || {}) }, itemStats: saved.itemStats || {}, sessions: Array.isArray(saved.sessions) ? saved.sessions : [] };
  } catch { return emptyState(); }
}
let appState = loadState();
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)); }
  catch { showToast('浏览器储存空间不足，部分记录可能无法保存'); }
}

function detectedDevice() {
  return (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || window.innerWidth < 760 ? 'mobile' : 'pc';
}
function currentDevice() { return appState.deviceMode === 'auto' ? detectedDevice() : appState.deviceMode; }
function updateDeviceUI() {
  const mode = currentDevice();
  document.body.dataset.device = mode;
  $('device-label').textContent = appState.deviceMode === 'auto' ? `${mode === 'mobile' ? '手机' : 'PC'}模式 · 自动` : (mode === 'mobile' ? '手机模式' : 'PC 模式');
  $('virtual-keyboard').style.display = mode === 'mobile' ? 'grid' : 'none';
}

let activeView = 'home';
function showView(view) {
  activeView = view;
  document.querySelectorAll('.view').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.nav === view));
  window.scrollTo({ top:0, behavior:'smooth' });
  if (view === 'home') renderHome();
  if (view === 'progress') renderProgress();
  if (view === 'keyboard') renderKeyboard();
}
function showToast(message) {
  const el = $('toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => el.classList.remove('show'), 2100);
}
function navTo(view) { showView(view); }

function getSkillAccuracy(category) {
  const s = appState.categoryStats[category] || { correct:0, total:0 };
  return s.total ? Math.round(s.correct / s.total * 100) : null;
}
function computeLevel(score) {
  if (score >= 95) return ['熟练进阶','键位掌握扎实，可以把训练重点转向稳定性与实际跟打速度。'];
  if (score >= 85) return ['稳定熟悉','大部分键位已经掌握，建议针对错题和零声母继续巩固。'];
  if (score >= 70) return ['基础建立中','基本规则已有概念，部分韵母或音节还需要反复练习。'];
  if (score >= 50) return ['入门学习中','建议先集中记忆特殊声母和高频韵母，再练两键音节。'];
  return ['初学阶段','先别追求速度，从键位图与基础声韵映射开始。'];
}
function getLevelInfo() {
  if (!appState.lastDiagnostic) return { score:null, title:'先做一次基准测试', desc:'用 2–3 分钟了解你的小鹤双拼键位熟悉度。', label:'尚未测试' };
  const score = appState.lastDiagnostic.score;
  const level = computeLevel(score);
  return { score, title:level[0], desc:level[1], label:`${appState.lastDiagnostic.date} 诊断` };
}
function renderHome() {
  if (appState.todayDate !== todayKey()) { appState.todayDate = todayKey(); appState.todayCount = 0; saveState(); }
  const info = getLevelInfo();
  $('level-title').textContent = info.title; $('level-description').textContent = info.desc; $('level-pill').textContent = info.label;
  $('level-score').textContent = info.score === null ? '—' : `${info.score}%`;
  $('level-progress').style.width = `${info.score || 0}%`;
  $('stat-questions').textContent = appState.totalQuestions.toLocaleString('zh-CN');
  $('stat-sessions').textContent = appState.totalSessions.toLocaleString('zh-CN');
  $('stat-speed').textContent = appState.bestCpm ? appState.bestCpm : '—';
  $('today-date').textContent = new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric'}).format(new Date());
  const weakest = weakestCategory();
  const categoryLabels = { initials:'声母', finals:'韵母', syllables:'两键音节', zero:'零声母' };
  if (weakest && getSkillAccuracy(weakest) !== null) {
    $('home-tip').textContent = `你目前「${categoryLabels[weakest]}」练习正确率较低，建议先做一组针对性强化，再回头复测。`;
  } else if (appState.lastDiagnostic) {
    $('home-tip').textContent = '诊断已完成。继续练习错题，并定期做 60 秒跟打，观察熟练度是否转化成真实输入速度。';
  } else {
    $('home-tip').textContent = '先完成一次诊断。系统会根据声母、韵母、音节和零声母的表现，安排下一轮练习。';
  }
}
function weakestCategory() {
  const categories = ['initials','finals','syllables','zero'];
  const observed = categories.map(c => ({ c, acc:getSkillAccuracy(c), total:appState.categoryStats[c].total })).filter(x => x.total > 0);
  if (!observed.length) return null;
  observed.sort((a,b) => a.acc - b.acc || b.total - a.total);
  return observed[0].c;
}
function renderProgress() {
  $('progress-total').textContent = appState.totalQuestions.toLocaleString('zh-CN');
  $('progress-time').textContent = `${Math.round(appState.totalMinutes)} 分钟`;
  $('progress-best').textContent = appState.bestCpm ? `${appState.bestCpm} 字/分` : '—';
  const names = { initials:'声母', finals:'韵母', syllables:'音节编码', zero:'零声母' };
  $('skill-breakdown').innerHTML = Object.keys(names).map(category => {
    const acc = getSkillAccuracy(category);
    const val = acc === null ? 0 : acc;
    const text = acc === null ? '未练习' : `${acc}%`;
    return `<div class="skill-row"><span>${names[category]}</span><div class="skill-bar"><span style="width:${val}%"></span></div><strong>${text}</strong></div>`;
  }).join('');
  const sessions = appState.sessions.slice(0,8);
  $('recent-sessions').innerHTML = sessions.length ? sessions.map(s => `<div class="recent-item"><div><strong>${escapeHTML(s.title)}</strong><small>${escapeHTML(s.date)} · ${s.count} 题 · ${Math.max(1,Math.round(s.minutes))} 分钟</small></div><b>${s.score == null ? (s.cpm ? `${s.cpm} 字/分` : '完成') : `${s.score}%`}</b></div>`).join('') : '<p class="empty-state">还没有练习记录，完成第一次练习后会显示在这里。</p>';
}
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }

function renderKeyboard() {
  const rows = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];
  $('keyboard-layout').innerHTML = rows.map(row => `<div class="keyboard-row">${row.split('').map(letter => {
    const data = keyMap[letter];
    const hasInitial = !!(data && data.initials);
    const tags = [...(data.initials || []), ...(data.finals || [])];
    return `<button class="keycap ${hasInitial?'has-initial':''}" data-key="${letter}" type="button"><strong>${letter}</strong><small>${tags.join(' / ')}</small></button>`;
  }).join('')}</div>`).join('');
  $('zero-reference').innerHTML = zeroReference.map(item => `<div class="zero-item"><strong>${item.pinyin}</strong><span>${item.code}</span></div>`).join('');
}
function showKeyDetail(letter) {
  const data = keyMap[letter]; if (!data) return;
  document.querySelectorAll('.keycap').forEach(el => el.classList.toggle('selected', el.dataset.key === letter));
  const initialsText = data.initials?.length ? `声母：${data.initials.join('、')}` : '没有特殊声母映射';
  const finalsText = data.finals?.length ? `韵母：${data.finals.join('、')}` : '—';
  $('key-detail').innerHTML = `<span class="detail-key">${letter}</span><div><strong>${initialsText}</strong><p>${finalsText}</p></div>`;
}

let exercise = null;
function sampleItems(items, count) {
  const pool = [...items];
  for (let i=pool.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  return pool.slice(0, Math.min(count,pool.length));
}
function questionPoolFor(mode) {
  if (mode === 'initials') return initials;
  if (mode === 'finals') return finals;
  if (mode === 'syllables') return syllables;
  if (mode === 'zero') return zeroInitials;
  if (mode === 'weak') {
    const weakest = weakestCategory();
    let pool = weakest ? allQuestionPool.filter(q => q.category === weakest) : allQuestionPool;
    const sorted = [...pool].sort((a,b) => itemAccuracy(a.id)-itemAccuracy(b.id));
    return sorted.slice(0, Math.min(18, sorted.length));
  }
  return allQuestionPool;
}
function itemAccuracy(id) {
  const s=appState.itemStats[id]; return s && s.total ? s.correct/s.total : 1.1;
}
const modeNames = { weak:'弱项强化', initials:'声母专练', finals:'韵母专练', syllables:'两键音节练习', zero:'零声母练习', mixed:'综合随机练习', diagnostic:'水平诊断' };
function buildExercise(mode) {
  let pool;
  let count = mode === 'diagnostic' ? 24 : 10;
  if (mode === 'diagnostic') {
    pool = [...sampleItems(initials,3), ...sampleItems(finals,7), ...sampleItems(syllables,10), ...sampleItems(zeroInitials,4)];
  } else {
    pool = questionPoolFor(mode);
    pool = sampleItems(pool, count);
  }
  return { mode, title:modeNames[mode] || '练习', questions:pool, index:0, correct:0, wrong:0, answered:false, start:Date.now(), errors:[], diagByCategory:{initials:{correct:0,total:0},finals:{correct:0,total:0},syllables:{correct:0,total:0},zero:{correct:0,total:0}} };
}
function startExercise(mode) {
  exercise = buildExercise(mode);
  $('exercise-modal').hidden = false;
  $('exercise-title').textContent = exercise.title;
  $('exercise-eyebrow').textContent = mode === 'diagnostic' ? 'BASELINE DIAGNOSTIC' : 'FOCUSED PRACTICE';
  $('question-area').hidden = false; $('exercise-result').hidden = true;
  $('next-question').hidden = true; $('answer-feedback').hidden = true;
  updateDeviceUI();
  showQuestion();
  document.body.style.overflow = 'hidden';
  if (currentDevice() === 'pc') setTimeout(() => $('answer-input').focus(), 150);
}
function showQuestion() {
  if (!exercise) return;
  const q = exercise.questions[exercise.index];
  exercise.answered = false;
  $('exercise-counter').textContent = `${exercise.index+1} / ${exercise.questions.length}`;
  $('exercise-score').textContent = `答对 ${exercise.correct} 题`;
  $('exercise-progress').style.width = `${exercise.index / exercise.questions.length * 100}%`;
  $('question-type').textContent = ({initials:'特殊声母',finals:'韵母键位',syllables:'两键音节',zero:'零声母'})[q.category];
  $('question-prompt').textContent = q.prompt;
  $('question-hint').textContent = currentDevice() === 'mobile' ? '点击下方字母键输入，或使用手机键盘' : '使用键盘输入答案，按 Enter 确认';
  $('answer-input').value = '';
  $('answer-input').maxLength = q.answer.length;
  $('answer-input').placeholder = q.answer.length === 1 ? '1 个键' : '2 个键';
  $('answer-feedback').hidden = true;
  $('next-question').hidden = true;
  $('submit-answer').disabled = false;
  $('show-answer').hidden = false;
  $('answer-input').disabled = false;
  if (currentDevice() === 'pc') $('answer-input').focus();
}
function normalizeAnswer(value) { return String(value || '').toUpperCase().replace(/[^A-Z]/g,'').slice(0,2); }
function checkAnswer() {
  if (!exercise || exercise.answered) return;
  const q = exercise.questions[exercise.index];
  const value = normalizeAnswer($('answer-input').value);
  if (value.length !== q.answer.length) { showToast(`请输入 ${q.answer.length} 个字母`); return; }
  exercise.answered = true;
  const correct = value === q.answer;
  recordQuestion(q, correct);
  if (correct) { exercise.correct++; exercise.diagByCategory[q.category].correct++; }
  else { exercise.wrong++; exercise.errors.push(q.id); }
  exercise.diagByCategory[q.category].total++;
  $('exercise-score').textContent = `答对 ${exercise.correct} 题`;
  $('answer-input').disabled = true;
  $('submit-answer').disabled = true;
  $('show-answer').hidden = true;
  $('answer-feedback').hidden = false;
  $('answer-feedback').className = `feedback ${correct?'correct':'wrong'}`;
  $('answer-feedback').innerHTML = correct ? `答对了！${escapeHTML(q.explanation)}` : `这题还不熟。正确答案是 <strong>${q.answer}</strong>。${escapeHTML(q.explanation)}`;
  $('next-question').hidden = false;
  $('next-question').textContent = exercise.index === exercise.questions.length-1 ? '查看结果 →' : '下一题 →';
  $('exercise-progress').style.width = `${(exercise.index+1)/exercise.questions.length*100}%`;
  saveState();
}
function recordQuestion(q, correct) {
  const cat = appState.categoryStats[q.category]; cat.total++; if (correct) cat.correct++;
  if (!appState.itemStats[q.id]) appState.itemStats[q.id] = { correct:0,total:0 };
  appState.itemStats[q.id].total++; if (correct) appState.itemStats[q.id].correct++;
  appState.totalQuestions++;
  if (appState.todayDate !== todayKey()) { appState.todayDate=todayKey(); appState.todayCount=0; }
  appState.todayCount++;
}
function revealHint() {
  if (!exercise || exercise.answered) return;
  const q = exercise.questions[exercise.index];
  $('answer-feedback').hidden = false; $('answer-feedback').className='feedback';
  $('answer-feedback').textContent = q.explanation;
  $('show-answer').textContent = '提示已显示';
}
function nextQuestion() {
  if (!exercise) return;
  exercise.index++;
  if (exercise.index >= exercise.questions.length) finishExercise(); else showQuestion();
}
function finishExercise() {
  const minutes = Math.max(0.3,(Date.now()-exercise.start)/60000);
  const score = Math.round(exercise.correct / exercise.questions.length * 100);
  appState.totalSessions++;
  appState.totalMinutes += minutes;
  const now = new Date();
  const record = { title:exercise.title, date:now.toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}), minutes, count:exercise.questions.length, score, mode:exercise.mode };
  appState.sessions.unshift(record); appState.sessions = appState.sessions.slice(0,40);
  if (exercise.mode === 'diagnostic') {
    const categoryBreakdown = {};
    Object.keys(exercise.diagByCategory).forEach(c => {
      const item=exercise.diagByCategory[c]; categoryBreakdown[c] = item.total ? Math.round(item.correct/item.total*100) : null;
    });
    appState.lastDiagnostic = { score, date:todayKey(), categoryBreakdown };
    record.title = '小鹤双拼水平诊断';
    saveState();
    renderDiagnosticResult(score,categoryBreakdown);
  } else {
    saveState();
    renderExerciseResult(score,minutes);
  }
  renderHome(); renderProgress();
}
function renderExerciseResult(score,minutes) {
  $('question-area').hidden = true; $('exercise-result').hidden=false;
  const recommendation = weakestCategory();
  const names={initials:'声母',finals:'韵母',syllables:'两键音节',zero:'零声母'};
  $('exercise-result').innerHTML = `<div class="result-score">${score}%</div><h3>${score>=90?'表现很好！':score>=70?'继续保持！':'再练一轮会更稳。'}</h3><p>本次完成 ${exercise.questions.length} 题，答对 ${exercise.correct} 题，用时约 ${Math.round(minutes*10)/10} 分钟。</p><div class="result-breakdown"><div><span>答对</span><strong>${exercise.correct}</strong></div><div><span>需要复习</span><strong>${exercise.wrong}</strong></div></div><p>${recommendation?`系统观察到「${names[recommendation]}」目前较需要巩固。`: '继续累积不同题型的练习记录。'}</p><div class="result-actions"><button class="button button-dark" id="result-repeat">再练一次</button><button class="button button-outline" id="result-home">返回首页</button></div>`;
  $('result-repeat').onclick=()=>startExercise(exercise.mode);
  $('result-home').onclick=()=>{closeExercise();showView('home');};
}
function renderDiagnosticResult(score,breakdown) {
  $('question-area').hidden=true; $('exercise-result').hidden=false;
  const level=computeLevel(score);
  const names={initials:'声母',finals:'韵母',syllables:'两键音节',zero:'零声母'};
  const categoryMarkup=Object.entries(names).map(([k,n])=>`<div><span>${n}</span><strong>${breakdown[k]===null?'—':`${breakdown[k]}%`}</strong></div>`).join('');
  const values=Object.entries(breakdown).filter(([,v])=>v!==null).sort((a,b)=>a[1]-b[1]);
  const weak=values[0];
  $('exercise-result').innerHTML=`<div class="result-score">${score}%</div><h3>${level[0]}</h3><p>${level[1]}</p><div class="result-breakdown">${categoryMarkup}</div><p>${weak?`目前最需要加强的是「${names[weak[0]]}」（${weak[1]}%）。建议回到练习页进行弱项强化。`:'可以继续做专项练习，建立更完整的基准。'}</p><div class="result-actions"><button class="button button-dark" id="result-weak">开始弱项练习</button><button class="button button-outline" id="result-home">返回首页</button></div>`;
  $('result-weak').onclick=()=>{closeExercise();startExercise('weak');};
  $('result-home').onclick=()=>{closeExercise();showView('home');};
}
function closeExercise() { $('exercise-modal').hidden=true; document.body.style.overflow=''; exercise=null; renderHome(); }

function buildVirtualKeyboard() {
  const root = $('virtual-keyboard');
  root.innerHTML = '';
  // Keep the familiar staggered QWERTY layout instead of a 7-column alphabet grid.
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  rows.forEach((letters, index) => {
    const row = document.createElement('div');
    row.className = `virtual-keyboard-row row-${index + 1}`;
    [...letters].forEach(letter => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = letter;
      btn.dataset.letter = letter;
      btn.addEventListener('click', () => appendVirtualKey(letter));
      row.appendChild(btn);
    });
    root.appendChild(row);
  });
}
function appendVirtualKey(letter) {
  const input=$('answer-input');if(input.disabled||!exercise||exercise.answered)return;
  const max=Number(input.maxLength)||2;const value=normalizeAnswer(input.value);
  input.value=(value+letter).slice(0,max);
  if(input.value.length===max) checkAnswer();
}

let speedTimer=null, speedRemaining=60, speedDuration=60, speedStartedAt=0, speedTargetText='', speedHasStarted=false;
function chooseSpeedText() {
  const source=$('text-source').value;
  if(source==='custom') {
    const own=$('custom-material').value.trim();
    if(own.length<10) { showToast('请先在练习页填写至少 10 个字的自选素材'); return null; }
    return own;
  }
  return texts[source] || texts.daily;
}
function startSpeedTest() {
  const target=chooseSpeedText();if(!target)return;
  speedTargetText=target;speedDuration=Number($('speed-duration').value)||60;speedRemaining=speedDuration;speedHasStarted=false;speedStartedAt=0;
  $('speed-modal').hidden=false;document.body.style.overflow='hidden';
  $('speed-target').textContent=target;$('speed-input').value='';$('speed-input').disabled=true;
  $('speed-clock').textContent=speedDuration;$('speed-typed').textContent='0 字';$('speed-state').textContent='准备中';
  $('speed-start-button').disabled=false;$('speed-start-button').textContent='开始计时';$('speed-finish-button').disabled=true;$('speed-result').hidden=true;
  clearInterval(speedTimer);
}
function beginSpeedTimer() {
  if(speedHasStarted)return;
  speedHasStarted=true;speedStartedAt=Date.now();$('speed-input').disabled=false;$('speed-input').focus();
  $('speed-start-button').disabled=true;$('speed-start-button').textContent='计时中…';$('speed-finish-button').disabled=false;$('speed-state').textContent='进行中';
  speedTimer=setInterval(()=>{
    speedRemaining=Math.max(0,speedDuration-Math.floor((Date.now()-speedStartedAt)/1000));
    $('speed-clock').textContent=speedRemaining;
    if(speedRemaining<=0) finishSpeedTest();
  },200);
}
function editDistance(a,b) {
  const prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){
    let diagonal=prev[0];prev[0]=i;
    for(let j=1;j<=b.length;j++){
      const old=prev[j];prev[j]=Math.min(prev[j]+1,prev[j-1]+1,diagonal+(a[i-1]===b[j-1]?0:1));diagonal=old;
    }
  }
  return prev[b.length];
}
function finishSpeedTest() {
  if(!speedHasStarted)return;
  clearInterval(speedTimer);speedTimer=null;
  const elapsed=Math.max(1,(Date.now()-speedStartedAt)/1000);const typed=$('speed-input').value;
  const comparedTarget=speedTargetText.slice(0,typed.length);
  const distance=typed.length?editDistance(typed,comparedTarget):0;
  const accuracy=typed.length?Math.max(0,Math.round((1-distance/typed.length)*100)):0;
  const correctChars=Math.max(0,typed.length-distance);
  const cpm=Math.round(correctChars/(elapsed/60));
  appState.totalSessions++;appState.totalMinutes+=elapsed/60;if(cpm>appState.bestCpm)appState.bestCpm=cpm;
  appState.sessions.unshift({title:'中文跟打测速',date:new Date().toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}),minutes:elapsed/60,count:typed.length,score:null,cpm});appState.sessions=appState.sessions.slice(0,40);saveState();
  $('speed-input').disabled=true;$('speed-start-button').disabled=true;$('speed-finish-button').disabled=true;$('speed-state').textContent='已完成';$('speed-clock').textContent=`${Math.max(0,speedRemaining)} 秒`;
  $('speed-result').hidden=false;$('speed-result').innerHTML=`<strong>${cpm} 字 / 分钟</strong><p>准确率 ${accuracy}% · 输入 ${typed.length} 字 · 用时 ${Math.round(elapsed)} 秒</p><p>${accuracy>=95?'准确度很好，继续保持稳定节奏。':accuracy>=85?'可以稍微放慢一点，优先减少错字。':'建议先提高准确率，再逐渐加快速度。'}</p>`;
  renderHome();renderProgress();
}
function closeSpeedTest(){clearInterval(speedTimer);speedTimer=null;$('speed-modal').hidden=true;document.body.style.overflow='';}

// Navigation and controls
document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>navTo(el.dataset.nav)));
document.querySelectorAll('[data-practice]').forEach(el=>el.addEventListener('click',()=>startExercise(el.dataset.practice)));
$('home-diagnostic').addEventListener('click',()=>startExercise('diagnostic'));
$('test-diagnostic').addEventListener('click',()=>startExercise('diagnostic'));
$('close-exercise').addEventListener('click',closeExercise);
$('submit-answer').addEventListener('click',checkAnswer);
$('next-question').addEventListener('click',nextQuestion);
$('show-answer').addEventListener('click',revealHint);
$('answer-input').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();checkAnswer();}});
$('answer-input').addEventListener('input',()=>{const input=$('answer-input');input.value=normalizeAnswer(input.value);});
$('close-speed').addEventListener('click',closeSpeedTest);
$('start-speed').addEventListener('click',startSpeedTest);
$('start-custom').addEventListener('click',()=>{
  const val=$('custom-material').value.trim();if(val.length<10){showToast('请先输入至少 10 个字的练习素材');return;}
  $('text-source').value='custom';showView('test');startSpeedTest();
});
$('speed-start-button').addEventListener('click',beginSpeedTimer);
$('speed-finish-button').addEventListener('click',finishSpeedTest);
$('speed-input').addEventListener('input',()=>{
  if(!speedHasStarted)beginSpeedTimer();
  $('speed-typed').textContent=`${$('speed-input').value.length} 字`;
  if($('speed-input').value===speedTargetText)finishSpeedTest();
});
$('keyboard-layout').addEventListener('click',event=>{const key=event.target.closest('[data-key]');if(key)showKeyDetail(key.dataset.key);});
$('device-toggle').addEventListener('click',()=>{
  const current=appState.deviceMode;
  appState.deviceMode=current==='auto'?'pc':current==='pc'?'mobile':'auto';
  saveState();updateDeviceUI();
  showToast(`已切换为${appState.deviceMode==='auto'?'自动识别':appState.deviceMode==='pc'?'PC':'手机'}界面`);
});
$('reset-data').addEventListener('click',()=>{
  if(!window.confirm('确定清除本设备保存的全部练习、诊断与测速记录？此操作无法撤销。'))return;
  appState=emptyState();saveState();renderHome();renderProgress();showToast('学习记录已清除');
});
$('exercise-modal').addEventListener('click',event=>{if(event.target===$('exercise-modal'))closeExercise();});
$('speed-modal').addEventListener('click',event=>{if(event.target===$('speed-modal'))closeSpeedTest();});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    if(!$('exercise-modal').hidden)closeExercise();
    if(!$('speed-modal').hidden)closeSpeedTest();
  }
});

// PWA install prompt
let deferredInstallPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;$('install-button').hidden=false;});
$('install-button').addEventListener('click',async()=>{
  if(!deferredInstallPrompt){showToast('请使用浏览器菜单中的“添加到主屏幕”');return;}
  deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$('install-button').hidden=true;
});
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}

// Initial render
updateDeviceUI();buildVirtualKeyboard();renderKeyboard();renderHome();renderProgress();
