/* =========================================================
   도윤렌트카 · 차량임대차계약서 (전자계약 시안)
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- utils ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const digits = (s) => String(s == null ? '' : s).replace(/[^0-9]/g, '');
  const money = (v) => { const n = Number(digits(v)); return n ? n.toLocaleString('ko-KR') : ''; };

  function koAmount(v) {
    let n = Number(digits(v));
    if (!n) return '';
    const d = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    const u = ['', '십', '백', '천'];
    const b = ['', '만', '억', '조'];
    let out = '', g = 0;
    while (n > 0 && g < b.length) {
      let part = n % 10000, s = '';
      for (let i = 0; i < 4 && part > 0; i++) {
        const x = part % 10;
        if (x) s = d[x] + u[i] + s;
        part = Math.floor(part / 10);
      }
      if (s) out = s + b[g] + out;
      n = Math.floor(n / 10000); g++;
    }
    return out;
  }

  const pad2 = (n) => String(n).padStart(2, '0');
  function todayISO() {
    const t = new Date();
    return t.getFullYear() + '-' + pad2(t.getMonth() + 1) + '-' + pad2(t.getDate());
  }
  function fmtDT(iso) {
    if (!iso) return '';
    const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
    if (!m) return iso;
    let out = `${m[1]}. ${m[2]}. ${m[3]}.`;
    if (m[4]) out += ` ${m[4]}:${m[5]}`;
    return out;
  }
  function fmtDateKR(iso) {
    const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return '';
    return `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일`;
  }
  function fmtPhone(v) {
    const d = digits(v).slice(0, 11);
    if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
    if (d.length > 7) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return d;
  }
  function fmtRRN(v) {
    const d = digits(v).slice(0, 13);
    return d.length > 6 ? `${d.slice(0, 6)}-${d.slice(6)}` : d;
  }
  function fmtLic(v) {
    const d = digits(v).slice(0, 12);
    if (d.length <= 2) return d;
    if (d.length <= 4) return `${d.slice(0, 2)}-${d.slice(2)}`;
    if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
    if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4, 10)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4, 10)}-${d.slice(10)}`;
  }

  let toastTimer = null;
  function toast(msg, warn) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.toggle('warn', !!warn);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  }

  /* ---------------- data ---------------- */
  const BRANCHES = [
    { name: '서울건대점', tel: '02-467-2120', dial: '024672120' },
    { name: '부산지점', tel: '010-8708-1154', dial: '01087081154' },
    { name: '안산지점', tel: '010-7338-2135', dial: '01073382135' },
    { name: '영등포지점', tel: '010-3444-1995', dial: '01034441995' },
    { name: 'DMC지점', tel: '010-4146-0434', dial: '01041460434' },
    { name: '부산서면지점', tel: '010-9402-4405', dial: '01094024405' }
  ];

  const X_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round"/><path d="M6 6l12 12M18 6L6 18" stroke="#e0454b" stroke-width="3.2" stroke-linecap="round"/></svg>';

  const CAR_SVG = {
    front: `<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="150" cy="118" rx="90" ry="5" fill="#eef2f7"/>
      <path d="M60 100c0-15 5-24 18-27l16-8c8-18 28-26 56-26s48 8 56 26l16 8c13 3 18 12 18 27 0 6-4 9-11 9H71c-7 0-11-3-11-9Z" fill="#f8fbfe" stroke="#5b6b80" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M103 63c8-14 26-20 47-20s39 6 47 20" fill="#e9eff7" stroke="#5b6b80" stroke-width="2"/>
      <path d="M64 72c-6-1-10 2-10 7s4 7 10 6" fill="#f2f6fb" stroke="#5b6b80" stroke-width="1.8"/>
      <path d="M236 72c6-1 10 2 10 7s-4 7-10 6" fill="#f2f6fb" stroke="#5b6b80" stroke-width="1.8"/>
      <rect x="68" y="76" width="34" height="13" rx="6.5" fill="#ffffff" stroke="#5b6b80" stroke-width="1.8"/>
      <rect x="198" y="76" width="34" height="13" rx="6.5" fill="#ffffff" stroke="#5b6b80" stroke-width="1.8"/>
      <rect x="113" y="78" width="74" height="16" rx="4" fill="#eef3f9" stroke="#5b6b80" stroke-width="1.8"/>
      <path d="M122 83h56M122 88h56" stroke="#a8b7c9" stroke-width="1.4"/>
      <path d="M74 101h152" stroke="#a8b7c9" stroke-width="1.6"/>
      <rect x="130" y="101" width="40" height="9" rx="2" fill="#ffffff" stroke="#5b6b80" stroke-width="1.4"/>
      <path d="M84 109v5h20M216 109v5h-20" stroke="#5b6b80" stroke-width="2"/>
    </svg>`,
    rear: `<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="150" cy="118" rx="90" ry="5" fill="#eef2f7"/>
      <path d="M60 100c0-15 5-24 18-27l16-8c8-18 28-26 56-26s48 8 56 26l16 8c13 3 18 12 18 27 0 6-4 9-11 9H71c-7 0-11-3-11-9Z" fill="#f8fbfe" stroke="#5b6b80" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M101 56c9-9 27-13 49-13s40 4 49 13c4 5 3 14 3 20H98c0-6-1-15 3-20Z" fill="#e9eff7" stroke="#5b6b80" stroke-width="2"/>
      <path d="M64 72c-6-1-10 2-10 7s4 7 10 6" fill="#f2f6fb" stroke="#5b6b80" stroke-width="1.8"/>
      <path d="M236 72c6-1 10 2 10 7s-4 7-10 6" fill="#f2f6fb" stroke="#5b6b80" stroke-width="1.8"/>
      <rect x="66" y="76" width="36" height="15" rx="4" fill="#ffffff" stroke="#5b6b80" stroke-width="1.8"/>
      <rect x="198" y="76" width="36" height="15" rx="4" fill="#ffffff" stroke="#5b6b80" stroke-width="1.8"/>
      <rect x="120" y="82" width="60" height="20" rx="3" fill="#eef3f9" stroke="#5b6b80" stroke-width="1.8"/>
      <path d="M128 88h44M128 95h44" stroke="#a8b7c9" stroke-width="1.4"/>
      <path d="M74 104h152" stroke="#a8b7c9" stroke-width="1.6"/>
      <path d="M84 111v4h20M216 111v4h-20" stroke="#5b6b80" stroke-width="2"/>
    </svg>`,
    driver: `<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="150" cy="118" rx="104" ry="5" fill="#eef2f7"/>
      <path d="M18 94c0-9 6-14 17-16l24-5c10-18 28-27 56-28h32c27 1 44 9 56 21l26 6c14 3 22 7 22 16v5c0 4-3 6-7 6H25c-4 0-7-2-7-6v-1Z" fill="#f8fbfe" stroke="#5b6b80" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M76 73c8-14 23-21 47-22h9v22H76Z" fill="#e9eff7" stroke="#5b6b80" stroke-width="1.9"/>
      <path d="M137 51h29c20 1 33 7 42 22h-71V51Z" fill="#e9eff7" stroke="#5b6b80" stroke-width="1.9"/>
      <path d="M137 51v22M132 73h76" stroke="#5b6b80" stroke-width="1.7"/>
      <path d="M137 84v14M222 79v22" stroke="#9fb0c4" stroke-width="1.4"/>
      <path d="M168 82h13" stroke="#5b6b80" stroke-width="2" stroke-linecap="round"/>
      <circle cx="74" cy="96" r="17" fill="#ffffff" stroke="#5b6b80" stroke-width="2.2"/>
      <circle cx="74" cy="96" r="6.5" fill="#f1f5f9" stroke="#5b6b80" stroke-width="1.7"/>
      <circle cx="216" cy="96" r="17" fill="#ffffff" stroke="#5b6b80" stroke-width="2.2"/>
      <circle cx="216" cy="96" r="6.5" fill="#f1f5f9" stroke="#5b6b80" stroke-width="1.7"/>
      <path d="M40 84h16" stroke="#5b6b80" stroke-width="2" stroke-linecap="round"/>
      <path d="M258 82h14" stroke="#5b6b80" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    passenger: `<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(300,0) scale(-1,1)">
        <ellipse cx="150" cy="118" rx="104" ry="5" fill="#eef2f7"/>
        <path d="M18 94c0-9 6-14 17-16l24-5c10-18 28-27 56-28h32c27 1 44 9 56 21l26 6c14 3 22 7 22 16v5c0 4-3 6-7 6H25c-4 0-7-2-7-6v-1Z" fill="#f8fbfe" stroke="#5b6b80" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M76 73c8-14 23-21 47-22h9v22H76Z" fill="#e9eff7" stroke="#5b6b80" stroke-width="1.9"/>
        <path d="M137 51h29c20 1 33 7 42 22h-71V51Z" fill="#e9eff7" stroke="#5b6b80" stroke-width="1.9"/>
        <path d="M137 51v22M132 73h76" stroke="#5b6b80" stroke-width="1.7"/>
        <path d="M137 84v14M222 79v22" stroke="#9fb0c4" stroke-width="1.4"/>
        <path d="M168 82h13" stroke="#5b6b80" stroke-width="2" stroke-linecap="round"/>
        <circle cx="74" cy="96" r="17" fill="#ffffff" stroke="#5b6b80" stroke-width="2.2"/>
        <circle cx="74" cy="96" r="6.5" fill="#f1f5f9" stroke="#5b6b80" stroke-width="1.7"/>
        <circle cx="216" cy="96" r="17" fill="#ffffff" stroke="#5b6b80" stroke-width="2.2"/>
        <circle cx="216" cy="96" r="6.5" fill="#f1f5f9" stroke="#5b6b80" stroke-width="1.7"/>
        <path d="M40 84h16" stroke="#5b6b80" stroke-width="2" stroke-linecap="round"/>
        <path d="M258 82h14" stroke="#5b6b80" stroke-width="2" stroke-linecap="round"/>
      </g>
    </svg>`
  };

  const VIEWS = [['front', '앞'], ['rear', '뒤'], ['driver', '운전석'], ['passenger', '조수석']];

  const ITEMS = [
    ['nav', '휴대용 네비게이션'],
    ['charger', '충전기'],
    ['cable', '충전용 케이블'],
    ['purifier', '공기정화기']
  ];

  /* ---------------- field config ---------------- */
  const VEHICLE = [
    { k: 'mgr', label: '배차담당', ph: '예) 김도윤', m: 'half' },
    { k: 'mgr2', label: '반차담당', ph: '예) 김도윤', m: 'half' },
    { k: 'accidentRate', label: '사고율', ph: '예) 0%', m: 'half' },
    { k: 'accidentMgr', label: '담당', ph: '예) 김도윤', m: 'half' },
    { k: 'car', label: '차명', ph: '예) 쏘나타 DN8', m: 'half' },
    { k: 'carNo', label: '차량번호', ph: '예) 12가 3456', m: 'half' },
    { k: 'outAt', label: '배차일시', type: 'datetime' },
    { k: 'inAt', label: '반차일시', type: 'datetime' },
    { k: 'inDoneAt', label: '반차완료일시', type: 'datetime' },
    { k: 'fee', label: '총사용요금', type: 'money', ph: '0', suffix: '원' },
    { k: 'fuel', label: '연료', type: 'radio', opts: [['LPG', 'LPG'], ['경유', '경유'], ['휘발유', '휘발유']] },
    { k: 'kmNow', label: '현재KM', type: 'num', ph: '예) 45,120', suffix: 'km', m: 'half' },
    { k: 'kmIn', label: '반차KM', type: 'num', ph: '반차 시 입력', suffix: 'km', m: 'half' },
    { k: 'tank', label: '배차 시 연료량', type: 'radio', opts: [['E', 'E'], ['1/4', '1/4'], ['2/4', '2/4'], ['3/4', '3/4'], ['F', 'F']], help: '배차 시 연료 게이지 위치를 선택해 주세요.' },
    { k: 'carIns', label: '자차보험 추가가입', type: 'radio', opts: [['가입', '가입'], ['미가입', '미가입']], m: 'half' },
    { k: 'deductible', label: '자차면책금', type: 'money', suffix: '원', ph: '예) 500,000', m: 'half' },
    { k: 'insurer', label: '보험사', ph: '예) 삼성화재', m: 'half' },
    { k: 'claimNo', label: '접수번호', ph: '예) 2026-1234567', m: 'half' },
    { k: 'insMgr', label: '보험담당', ph: '예) 박사고', m: 'half' },
    { k: 'fax', label: '팩스', ph: '예) 02-000-0000', m: 'half' },
    { k: 'otherCarNo', label: '피해차량번호', ph: '예) 34나 5678', m: 'half' },
    { k: 'otherCarType', label: '차종', ph: '예) 아반떼', m: 'half' },
    { k: 'shop', label: '공업사', ph: '예) 도윤공업사' },
    { k: 'note', label: '비고', type: 'textarea', ph: '예) 대인·대물·자손 보험 처리 시 면책금 50만원 / 단독사고 100만원' }
  ];

  const RENTER = [
    { k: 'name', label: '성명', ph: '예) 홍길동', req: true, m: 'half' },
    { k: 'phone', label: '연락처 (H.P)', ph: '010-0000-0000', type: 'phone', req: true, m: 'half' },
    { k: 'rrn', label: '주민등록번호', ph: '000000-0000000', type: 'rrn', req: true },
    { k: 'licNo', label: '운전면허번호', ph: '00-00-000000-00', type: 'lic', req: true, m: 'half' },
    { k: 'licType', label: '면허 종류', type: 'radio', opts: [['1종', '1종'], ['2종', '2종']], m: 'half' },
    { k: 'addr', label: '주소', ph: '도로명 주소를 입력해 주세요', type: 'textarea', rows: 2 }
  ];

  const GUARANTOR = [
    { k: 'gName', label: '성명', ph: '예) 김보증', m: 'half' },
    { k: 'gHp', label: 'H.P', ph: '010-0000-0000', type: 'phone', m: 'half' },
    { k: 'gRrn', label: '주민등록번호', ph: '000000-0000000', type: 'rrn' },
    { k: 'gLicNo', label: '운전면허번호', ph: '00-00-000000-00', type: 'lic' },
    { k: 'gTel', label: '전화번호', ph: '02-000-0000', type: 'phone', m: 'half' },
    { k: 'gAddr', label: '주소', ph: '도로명 주소', type: 'textarea', rows: 2 }
  ];

  /* ---------------- state ---------------- */
  const DRAFT_KEY = 'doyoon-contract-draft-v2';
  const state = {
    admin: false,
    locked: false,
    fields: { signDate: todayISO() },
    damage: [],
    photo: null,
    sig: { renter: null, guarantor: null },
    consent: false,
    items: []
  };
  const pads = {};
  const listeners = [];

  const VEH_KEYS = VEHICLE.map((f) => f.k);

  /* ---------------- url prefill ---------------- */
  const Q = new URLSearchParams(location.search);
  const PARAM_MAP = {
    mgr: 'mgr', mgr2: 'mgr2', rate: 'accidentRate', amgr: 'accidentMgr', car: 'car', carNo: 'carNo',
    out: 'outAt', in: 'inAt', done: 'inDoneAt', fee: 'fee', fuel: 'fuel', kmNow: 'kmNow', kmIn: 'kmIn',
    tank: 'tank', note: 'note', ins: 'carIns', ded: 'deductible', insurer: 'insurer', claim: 'claimNo',
    insMgr: 'insMgr', fax: 'fax', oCar: 'otherCarNo', oType: 'otherCarType', shop: 'shop'
  };

  function parseDmg(v) {
    return String(v).split(',').map((p) => {
      const [view, x, y] = p.split(':');
      if (!view || x == null || y == null) return null;
      const nx = parseFloat(x), ny = parseFloat(y);
      if (!isFinite(nx) || !isFinite(ny)) return null;
      if (!VIEWS.some(([k]) => k === view)) return null;
      return { v: view, x: Math.min(1, Math.max(0, nx)), y: Math.min(1, Math.max(0, ny)) };
    }).filter(Boolean).slice(0, 80);
  }
  function dmgParam() {
    return state.damage.map((d) => `${d.v}:${d.x.toFixed(3)}:${d.y.toFixed(3)}`).join(',');
  }

  let prefilled = false;
  state.admin = Q.get('admin') === '1';
  Object.keys(PARAM_MAP).forEach((p) => {
    const v = Q.get(p);
    if (v == null || v === '') return;
    const k = PARAM_MAP[p];
    const f = VEHICLE.find((x) => x.k === k);
    let val = v;
    if (f && (f.type === 'money' || f.type === 'num')) val = digits(v);
    if (f && f.type === 'datetime') val = String(v).replace(' ', 'T').slice(0, 16);
    state.fields[k] = val;
    prefilled = true;
  });
  if (Q.get('dmg')) { state.damage = parseDmg(Q.get('dmg')); prefilled = true; }
  state.locked = prefilled && !state.admin;

  /* ---------------- draft ---------------- */
  function loadDraft() {
    if (prefilled) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      Object.keys(d.fields || {}).forEach((k) => {
        if (k === 'rrn' || k === 'gRrn') return;
        state.fields[k] = d.fields[k];
      });
      if (Array.isArray(d.damage)) state.damage = d.damage;
      state.items = Array.isArray(d.items) ? d.items : [];
      state.consent = !!d.consent;
    } catch (e) { /* ignore */ }
  }
  let draftTimer = null;
  function saveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      try {
        const fields = Object.assign({}, state.fields);
        delete fields.rrn; delete fields.gRrn;
        localStorage.setItem(DRAFT_KEY, JSON.stringify({
          fields, damage: state.damage, items: state.items, consent: state.consent
        }));
      } catch (e) { /* ignore */ }
    }, 400);
  }

  /* ---------------- render helpers ---------------- */
  function fieldHTML(f, lockedClass) {
    const v = state.fields[f.k] == null ? '' : state.fields[f.k];
    const id = 'f_' + f.k;
    const cls = 'field' + (f.m === 'half' ? ' half' : '');
    let control = '';

    if (f.type === 'radio') {
      control = `<div class="pills" data-radio="${f.k}" role="radiogroup" aria-label="${esc(f.label)}">` +
        f.opts.map(([val, label]) => `<label class="pill"><input type="radio" name="${f.k}" value="${esc(val)}" ${String(v) === String(val) ? 'checked' : ''}><span>${esc(label)}</span></label>`).join('') +
        `</div>`;
    } else if (f.type === 'textarea') {
      control = `<textarea class="inp" id="${id}" data-k="${f.k}" rows="${f.rows || 3}" placeholder="${esc(f.ph || '')}">${esc(v)}</textarea>`;
    } else {
      const t = (f.type === 'money' || f.type === 'num' || f.type === 'phone' || f.type === 'rrn' || f.type === 'lic') ? 'text'
        : f.type === 'datetime' ? 'datetime-local' : 'text';
      const im = f.type === 'phone' || f.type === 'money' || f.type === 'num' ? 'numeric' : 'text';
      control = `<input class="inp" id="${id}" data-k="${f.k}" data-type="${f.type || 'text'}" type="${t}" inputmode="${im}" value="${esc(v)}" placeholder="${esc(f.ph || '')}">`;
    }

    return `<div class="${cls}" data-field="${f.k}">
      <label for="${id}">${esc(f.label)}${f.req ? '<em class="req">필수</em>' : ''}</label>
      <div class="ctrl">${control}${f.suffix ? `<span class="suffix">${f.suffix}</span>` : ''}</div>
      ${f.help ? `<p class="help">${f.help}</p>` : ''}
    </div>`;
  }

  function carBlockHTML() {
    return `<div class="damage">
      <div class="dmg-head">
        <div>
          <h3>손상된 부분 X 표 <em>4면</em></h3>
          <p>차량 그림을 손가락으로 탭하면 그 위치에 빨간 X가 표시됩니다. 다시 탭하면 지워지고, 계약서에도 그대로 인쇄됩니다.</p>
        </div>
        <div class="dmg-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-act="dmg-undo">마지막 X 취소</button>
          <button type="button" class="btn btn-ghost btn-sm" data-act="dmg-clear">전체 초기화</button>
        </div>
      </div>
      <div class="dmg-grid">
        ${VIEWS.map(([v, l]) => `<div class="car" data-view="${v}">
          <div class="car-art">${CAR_SVG[v]}</div>
          <span class="car-label">${l}</span>
        </div>`).join('')}
      </div>
      <p class="dmg-note">※ 차량 픽업 시 수리 관계는 차량 제조사 직영 서비스센터에서 수리를 원칙으로 합니다.</p>
    </div>`;
  }

  function sectionHTML(o) {
    return `<section class="card" id="${o.id}">
      <header class="card-head">
        <span class="step">${o.no}</span>
        <div class="ch-text"><h2>${o.title}</h2><p>${o.desc || ''}</p></div>
        ${o.tag || ''}
      </header>
      <div class="card-body">${o.body}</div>
    </section>`;
  }

  /* ---------------- build form ---------------- */
  function buildForm() {
    const lockChip = `<span class="chip" id="vehChip">${state.locked
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>배차담당자 입력'
      : '배차담당자 입력'}</span>`;

    const vehicle = sectionHTML({
      id: 'sec-vehicle', no: '01',
      title: '차량 · 배차 정보',
      desc: state.locked
        ? '배차담당자가 입력한 정보입니다. 내용이 다르면 지점으로 연락해 주세요.'
        : '배차 정보와 손상 상태를 확인해 주세요. 차량 그림을 탭하면 손상 위치에 X가 표시됩니다.',
      tag: lockChip,
      body: `<div class="grid">${VEHICLE.map((f) => fieldHTML(f)).join('')}</div>${carBlockHTML()}`
    });

    const terms = sectionHTML({
      id: 'sec-terms', no: '02',
      title: '대여차량 손해에 관한 각서',
      desc: '아래 약관을 확인하고 개인정보 수집·이용에 동의해 주세요.',
      tag: '',
      body: `<div class="terms-list" data-terms>
        <li>운전자격은 승용, 승합 <span class="inline-age">(만 <input type="text" inputmode="numeric" maxlength="2" data-k="minAge" value="${esc(state.fields.minAge || '')}" aria-label="운전 가능 최소 연령">세)</span> 이상 운전 가능함. <b>(임차인 및 제2운전자 외 제3자가 운전한 경우 보험혜택을 받지 못함)</b></li>
        <li>본 차량은 책임·종합보험에 가입되어 있으며 <b>(대인 : 무한 / 대물 : 억원 / 자손 : 삼천만원)</b>, 자차보험은 <b id="insStateText">${state.fields.carIns ? '(' + esc(state.fields.carIns) + ')' : '( 가입 · 미가입 )'}</b> 상태입니다.</li>
        <li>차량사고 발생 시 <b>차량감가비 30%, 휴차 보상 대여료 80%</b>는 임차인 부담입니다.</li>
      </div>
      <div class="alert-boxes">
        <div class="alert-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg><span>대인·대물·자손으로 보험 처리 시 <b>면책금 50만원</b> 임차인 부담</span></div>
        <div class="alert-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg><span>흡연·반려동물로 인한 오염 시 <b>특수크리닉 30만원</b> 임차인 부담</span></div>
      </div>
      <div class="terms-list" data-terms style="margin-top:2px">
        <li>계약기간 이전 연장운행 시 당사의 허락을 득하여야 하며, 통보 없이 24시간 이상 초과 운행 시에는 불법사용으로 간주되어 도난신고 및 직접 조치를 취하여도 이의를 제기할 수 없으며 보험 혜택도 받지 못합니다. <b>(연장 시 시간당 10% 가산금 추가)</b></li>
        <li>본 차량은 위치추적장치가 장착되어 있으며 <b>위치정보 수집에 동의</b>합니다.</li>
        <li>임차인 및 제2운전자는 계약서상 기재된 약관을 숙지하며, 주차위반·교통법규위반 등에 대하여 임차인이 책임질 것을 서약합니다. 자동차 대여 표준약관에 명시된 사항을 이행치 않았을 때는 민·형사상 책임도 감수하며 이의를 제기하지 않겠습니다.</li>
        <li>임차인(운전자)은 임차기간 동안 본 계약서의 내용이 사실과 다름이 없음을 확인하며, 보험사에 대한 대차료(렌트비용) 청구권을 <b>도윤렌트카에 위임</b>합니다.</li>
      </div>
      <div class="items-box">
        <h4>지급품목 <span>받은 품목을 체크해 주세요 (선택)</span></h4>
        <div class="checks">
          ${ITEMS.map(([k, label]) => `<label class="check"><input type="checkbox" data-item="${k}" ${state.items.includes(k) ? 'checked' : ''}><span>${label}</span></label>`).join('')}
        </div>
      </div>
      <details class="privacy-box">
        <summary>개인정보 수집·이용 및 제3자 제공 동의서<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></summary>
        <div class="privacy-body">
          <p>이 계약서에 기재되는 개인정보는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 의하여 아래와 같이 이용하는 것에 동의합니다.</p>
          <p>· 관공서 교통법규 위반 및 과태료(범칙금) 부과, 보험 판매업무, 고객의 귀책사유로 인한 계약 불이행 등으로 회사의 손해가 발생한 경우</p>
          <p>· 임차인이 계약종료 후 차량을 미반납할 경우 당사는 임차인을 형사고소 후 차량 회수 조치 예정이며, 반환되지 않은 차량을 운행한 운전자는 운전면허 취소 등 불이익을 받을 수 있습니다.</p>
        </div>
      </details>
      <div class="checks" style="margin-top:12px">
        <label class="check consent"><input type="checkbox" id="consentBox" ${state.consent ? 'checked' : ''}><span>위 약관과 개인정보 수집·이용 및 제3자 제공에 동의합니다 (필수)</span></label>
      </div>`
    });

    const renter = sectionHTML({
      id: 'sec-renter', no: '03',
      title: '임차인 정보 · 운전면허증',
      desc: '계약서에 기재될 임차인 정보를 입력하고 면허증 사진을 첨부해 주세요.',
      body: `<div class="grid">${RENTER.map((f) => fieldHTML(f)).join('')}</div>
      <div class="upload" style="margin-top:16px">
        <div class="upload-btns">
          <button type="button" class="btn" data-act="photo-camera">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"/><circle cx="12" cy="13" r="3.5"/></svg>
            면허증 촬영
          </button>
          <button type="button" class="btn" data-act="photo-gallery">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 15 5-4 4 3 3-2 6 5"/><circle cx="15" cy="8.5" r="1.4"/></svg>
            앨범에서 선택
          </button>
        </div>
        <p class="ocr-note"><span class="dot"></span>면허 진위확인 · 자동 입력(OCR) 연동 자리 — 추후 API 연결 예정</p>
        <div class="license-preview ${state.photo ? 'show' : ''}" id="licensePreview">
          <img id="licenseImg" alt="운전면허증 미리보기" src="${state.photo || ''}">
          <div class="lp-bar">
            <span><b>운전면허증</b> 첨부 완료</span>
            <button type="button" class="btn btn-ghost btn-sm" data-act="photo-remove">삭제</button>
          </div>
        </div>
        <input type="file" accept="image/*" capture="environment" id="fileCamera" hidden>
        <input type="file" accept="image/*" id="fileGallery" hidden>
      </div>`
    });

    const guarantor = sectionHTML({
      id: 'sec-guarantor', no: '04',
      title: '연대보증인 및 제2운전자',
      desc: '해당되는 경우에만 펼쳐서 작성해 주세요. 없으면 비워 두셔도 됩니다.',
      tag: '<span class="chip gray">선택</span>',
      body: `<div class="grid">${GUARANTOR.map((f) => fieldHTML(f)).join('')}</div>
      <div class="sign-grid" style="margin-top:14px">
        <div class="sig-card">
          <div class="sig-card-head"><strong>제2운전자 서명</strong><span class="sig-state" id="sigState-guarantor">서명 전</span></div>
          <div class="sig" data-sig-box="guarantor"><canvas data-sig="guarantor" aria-label="제2운전자 전자서명"></canvas><span class="sig-hint">손가락으로 서명해 주세요</span></div>
          <div class="sig-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="sig-clear" data-target="guarantor">다시 쓰기</button></div>
        </div>
        <div class="sig-card" style="align-content:start">
          <div class="sig-card-head"><strong>연대보증인 안내</strong></div>
          <p style="font-size:12.5px;color:#6b7a90;line-height:1.6">연대보증인은 임차인의 채무를 함께 부담합니다. 성명과 연락처, 서명(선택)을 남겨 주세요. 계약서에는 임차인과 함께 기재됩니다.</p>
        </div>
      </div>`
    });

    const sign = sectionHTML({
      id: 'sec-sign', no: '05',
      title: '전자서명',
      desc: '작성일자와 성명을 확인하고 서명란에 손가락으로 서명해 주세요.',
      tag: '<span class="chip" id="signChip">서명 전</span>',
      body: `<div class="grid">
        <div class="field half"><label for="f_signDate">작성일자</label><div class="ctrl"><input class="inp" type="date" id="f_signDate" data-k="signDate" value="${esc(state.fields.signDate || todayISO())}"></div></div>
        <div class="field half"><label for="f_signName">서명자 성명<em class="req">필수</em></label><div class="ctrl"><input class="inp" type="text" id="f_signName" data-k="signName" value="${esc(state.fields.signName || '')}" placeholder="임차인 성명"></div></div>
      </div>
      <div class="sign-grid" style="margin-top:14px">
        <div class="sig-card">
          <div class="sig-card-head"><strong>임차인 서명<em class="req">필수</em></strong><span class="sig-state" id="sigState-renter">서명 전</span></div>
          <div class="sig" data-sig-box="renter"><canvas data-sig="renter" aria-label="임차인 전자서명"></canvas><span class="sig-hint">손가락으로 서명해 주세요</span></div>
          <div class="sig-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="sig-clear" data-target="renter">다시 쓰기</button></div>
        </div>
      </div>
      <p class="help" style="margin-top:10px">서명은 계약서에 이미지로 포함되어 인쇄·PDF로 함께 저장됩니다.</p>`
    });

    $('#formRoot').innerHTML = vehicle + terms + renter + guarantor + sign;
  }

  /* ---------------- damage ---------------- */
  function renderDamages() {
    $$('.car').forEach((car) => {
      const v = car.dataset.view;
      const art = $('.car-art', car);
      $$('.xmark', art).forEach((n) => n.remove());
      state.damage.filter((d) => d.v === v).forEach((d) => {
        const el = document.createElement('span');
        el.className = 'xmark';
        el.style.left = (d.x * 100) + '%';
        el.style.top = (d.y * 100) + '%';
        el.innerHTML = X_SVG;
        el.title = '탭하면 삭제';
        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          state.damage = state.damage.filter((x) => x !== d);
          renderDamages(); saveDraft();
        });
        art.appendChild(el);
      });
    });
  }

  function bindDamage() {
    $$('.car-art').forEach((art) => {
      art.addEventListener('click', (ev) => {
        if (ev.target.closest('.xmark')) return;
        const r = art.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width;
        const y = (ev.clientY - r.top) / r.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) return;
        state.damage.push({ v: art.parentElement.dataset.view, x: +x.toFixed(3), y: +y.toFixed(3) });
        renderDamages(); saveDraft();
      });
    });
  }

  /* ---------------- signature pad ---------------- */
  function createPad(canvas, key) {
    const ctx = canvas.getContext('2d');
    const box = canvas.parentElement;
    const strokes = [];
    let cur = null;
    let drawing = false;

    function resize() {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    function draw() {
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2.5));
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2.5));
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#12203a';
      strokes.forEach((pts) => {
        if (pts.length === 1) {
          ctx.beginPath();
          ctx.arc(pts[0].x * w, pts[0].y * h, 1.3, 0, Math.PI * 2);
          ctx.fillStyle = '#12203a'; ctx.fill();
          return;
        }
        ctx.beginPath();
        ctx.moveTo(pts[0].x * w, pts[0].y * h);
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2 * w;
          const my = (pts[i].y + pts[i + 1].y) / 2 * h;
          ctx.quadraticCurveTo(pts[i].x * w, pts[i].y * h, mx, my);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x * w, last.y * h);
        ctx.stroke();
      });
      if (!strokes.length) box.classList.remove('has');
    }
    function pos(ev) {
      const r = canvas.getBoundingClientRect();
      return {
        x: Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)),
        y: Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height))
      };
    }
    function out() {
      // export as PNG dataURL at fixed size
      const W = 640, H = 220;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const cx = c.getContext('2d');
      cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, W, H);
      cx.lineWidth = 3; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.strokeStyle = '#12203a';
      // keep drawing aspect: sample canvas aspect
      const ar = (canvas.width || 1) / (canvas.height || 1);
      let dw = W, dh = W / ar;
      if (dh > H) { dh = H; dw = H * ar; }
      strokes.forEach((pts) => {
        if (pts.length === 1) {
          cx.beginPath(); cx.arc(pts[0].x * dw, pts[0].y * dh, 1.6, 0, Math.PI * 2); cx.fillStyle = '#12203a'; cx.fill(); return;
        }
        cx.beginPath();
        cx.moveTo(pts[0].x * dw, pts[0].y * dh);
        for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i].x * dw, pts[i].y * dh);
        cx.stroke();
      });
      return c.toDataURL('image/png');
    }

    const onDown = (ev) => {
      ev.preventDefault();
      drawing = true;
      cur = [pos(ev)];
      strokes.push(cur);
      box.classList.add('has');
      try { canvas.setPointerCapture(ev.pointerId); } catch (e) { }
      draw(); update();
    };
    const onMove = (ev) => {
      if (!drawing || !cur) return;
      ev.preventDefault();
      cur.push(pos(ev));
      draw();
    };
    const onUp = () => { drawing = false; cur = null; update(); };

    function update() {
      const has = strokes.length > 0;
      state.sig[key] = has ? out() : null;
      const st = $('#sigState-' + key);
      if (st) { st.textContent = has ? '서명 완료' : '서명 전'; st.classList.toggle('on', has); }
      if (key === 'renter') refreshProgress();
      saveDraft();
    }

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    listeners.push(onResize);
    setTimeout(resize, 30);
    resize();

    return {
      clear() { strokes.length = 0; drawing = false; cur = null; draw(); update(); },
      has() { return strokes.length > 0; }
    };
  }

  function initPads() {
    $$('canvas[data-sig]').forEach((c) => {
      const key = c.dataset.sig;
      pads[key] = createPad(c, key);
      if (state.sig[key]) $('#sigState-' + key).classList.add('on'), $('#sigState-' + key).textContent = '서명 완료';
    });
  }

  /* ---------------- lock (customer mode) ---------------- */
  function applyLock() {
    VEH_KEYS.forEach((k) => {
      const w = document.querySelector(`[data-field="${k}"]`);
      if (!w) return;
      $$('input,textarea', w).forEach((inp) => {
        if (inp.type === 'radio') inp.disabled = state.locked;
        else inp.readOnly = state.locked;
      });
      w.classList.toggle('is-locked', state.locked);
    });
    const chip = $('#vehChip');
    if (chip) {
      chip.innerHTML = state.locked
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>배차담당자 입력'
        : '배차담당자 입력';
      chip.classList.toggle('done', state.locked);
    }
  }

  /* ---------------- progress ---------------- */
  function requiredList() {
    const f = state.fields;
    return [
      { ok: !!String(f.name || '').trim(), k: 'name', label: '성명' },
      { ok: !!String(f.phone || '').trim(), k: 'phone', label: '연락처' },
      { ok: !!String(f.rrn || '').trim(), k: 'rrn', label: '주민등록번호' },
      { ok: !!String(f.licNo || '').trim(), k: 'licNo', label: '운전면허번호' },
      { ok: !!String(f.signName || f.name || '').trim(), k: 'signName', label: '서명자 성명' },
      { ok: state.consent, k: 'consent', label: '약관 동의' },
      { ok: !!state.sig.renter, k: 'sig', label: '서명' }
    ];
  }
  function refreshProgress() {
    const list = requiredList();
    const done = list.filter((x) => x.ok).length;
    const pct = Math.round((done / list.length) * 100);
    $('#abFill').style.width = pct + '%';
    $('#abSub').textContent = done === list.length
      ? '필수 항목을 모두 작성했습니다. 계약서를 확인해 주세요.'
      : `필수 항목 ${done}/${list.length} 완료`;
    $('#abTitle').textContent = done === list.length ? '작성 완료' : '작성 중';
    $('#signChip').textContent = state.sig.renter ? '서명 완료' : '서명 전';
    $('#signChip').classList.toggle('done', !!state.sig.renter);
  }

  /* ---------------- document ---------------- */
  function V(k) {
    const v = state.fields[k];
    if (v == null || v === '') return '';
    if (k === 'fee' || k === 'deductible') return money(v);
    if (k === 'kmNow' || k === 'kmIn') return money(v);
    return String(v);
  }
  function cell(k, suffix) {
    const v = V(k);
    if (!v) return '&nbsp;';
    return esc(v) + (suffix ? ' ' + suffix : '');
  }
  function dtCell(k) {
    const v = V(k);
    return v ? esc(fmtDT(v)) : '&nbsp;';
  }
  function optCell(k, opts) {
    const v = V(k);
    if (!v) return opts.map((o) => '□ ' + o).join('&nbsp;&nbsp;');
    return opts.map((o) => (o === v ? '■ <b>' + esc(o) + '</b>' : '□ ' + esc(o))).join('&nbsp;&nbsp;');
  }
  function periodCell(k, opts) {
    const v = V(k);
    if (!v) return opts.map((o) => '□ ' + o).join('&nbsp;&nbsp;');
    return opts.map((o) => (o === v ? '■ <b>' + esc(o) + '</b>' : '□ ' + esc(o))).join('&nbsp;&nbsp;');
  }

  function gaugeHTML() {
    const v = V('tank');
    const opts = ['E', '1/4', '2/4', '3/4', 'F'];
    return `<span class="gauge">${opts.map((o, i) => `<i class="${o === v ? 'on' : ''}">${o}</i>${i < opts.length - 1 ? '<em></em>' : ''}`).join('')}</span>`;
  }

  function paperDamage() {
    return `<div class="p-damage">
      <h3>손상된 부분 X 표</h3>
      <div class="p-dmg-grid">
        ${VIEWS.map(([v, l]) => `<div class="p-car" data-view="${v}">
          <div class="car-art">${CAR_SVG[v]}${state.damage.filter((d) => d.v === v).map((d) => `<span class="xmark" style="left:${(d.x * 100).toFixed(2)}%;top:${(d.y * 100).toFixed(2)}%">${X_SVG}</span>`).join('')}</div>
          <span class="car-label">${l}</span>
        </div>`).join('')}
      </div>
      <p class="p-note" style="margin-top:4px">※ 차량 픽업 시 수리 관계는 차량 제조사 직영 서비스센터에서 수리를 원칙으로 합니다.</p>
    </div>`;
  }

  function buildPaper() {
    const f = state.fields;
    const signName = (f.signName || f.name || '').trim();
    const sigImg = state.sig.renter ? `<img class="p-sigimg" src="${state.sig.renter}" alt="임차인 서명">` : '';
    const gSigImg = state.sig.guarantor ? `<img class="p-sigimg" src="${state.sig.guarantor}" alt="제2운전자 서명">` : '';
    const fee = V('fee');
    const feeKR = koAmount(f.fee);

    return `<div class="paper" id="paper">
      <div class="p-head">
        <div class="p-brand">
          <div class="p-logo">
            <span class="p-mark">DY</span>
            <span><b>도윤렌트카</b><small>DOYOON RENTCAR</small></span>
          </div>
          <ul class="p-branches">
            ${BRANCHES.map((b) => `<li><b>${b.name}</b><span class="v">${b.tel}</span></li>`).join('')}
          </ul>
        </div>
        <h1 class="p-title">차량임대차계약서<span>VEHICLE RENTAL AGREEMENT</span></h1>
      </div>

      <table class="pt">
        <colgroup><col class="col-k"><col><col class="col-k"><col></colgroup>
        <tr><th>배차담당</th><td class="val">${cell('mgr')}</td><th>반차담당</th><td class="val">${cell('mgr2')}</td></tr>
        <tr><th>사고율</th><td class="val">${cell('accidentRate')}</td><th>담당</th><td class="val">${cell('accidentMgr')}</td></tr>
        <tr><th>차명</th><td class="val">${cell('car')}</td><th>차량번호</th><td class="val">${cell('carNo')}</td></tr>
        <tr><th>배차일시</th><td class="val">${dtCell('outAt')}</td><th>반차일시</th><td class="val">${dtCell('inAt')}</td></tr>
        <tr><th>총사용요금</th><td class="val">${fee ? esc(fee) + ' 원' + (feeKR ? ` <span class="sub">(일금 ${esc(feeKR)}원정)</span>` : '') : '&nbsp;'}</td><th>반차완료일시</th><td class="val">${dtCell('inDoneAt')}</td></tr>
        <tr><th>연료</th><td class="val">${optCell('fuel', ['LPG', '경유', '휘발유'])}</td><th>현재KM</th><td class="val">${cell('kmNow', 'km')}</td></tr>
        <tr><th>반차KM</th><td class="val">${cell('kmIn', 'km')}</td><th>배차시연료</th><td class="val">${gaugeHTML()}</td></tr>
        <tr><th>자차보험</th><td class="val">${optCell('carIns', ['가입', '미가입'])}</td><th>자차면책금</th><td class="val">${cell('deductible', '원')}</td></tr>
        <tr><th>비고</th><td colspan="3">${V('note') ? esc(V('note')) : '차대차 사고 면책금 50만원 / 단독사고 면책금 100만원'}</td></tr>
        <tr><th>보험사</th><td class="val">${cell('insurer')}</td><th>접수번호</th><td class="val">${cell('claimNo')}</td></tr>
        <tr><th>보험담당</th><td class="val">${cell('insMgr')}</td><th>팩스</th><td class="val">${cell('fax')}</td></tr>
        <tr><th>피해차량번호</th><td class="val">${cell('otherCarNo')}</td><th>차종</th><td class="val">${cell('otherCarType')}</td></tr>
        <tr><th>공업사</th><td colspan="3">${cell('shop')}</td></tr>
      </table>

      ${paperDamage()}

      <section class="p-terms">
        <h2>대여차량 손해에 관한 각서</h2>
        <ol>
          <li>운전자격은 승용, 승합 <b>(만 ${V('minAge') ? esc(V('minAge')) : '　'}세)</b> 이상 운전 가능함. (임차인 및 제2운전자 외 제3자가 운전한 경우 보험혜택을 받지 못함)</li>
          <li>본 차량은 책임, 종합보험 <b>(대인 : 무한 / 대물 : 억원 / 자손 : 삼천만원)</b>에 가입되어 있으며, 자차보험은 <b>(${V('carIns') ? esc(V('carIns')) : '가입 · 미가입'})</b> 상태입니다.</li>
          <li>차량사고 발생 시 차량감가비 30%, 휴차 보상 대여료 80%는 임차인 부담.</li>
        </ol>
        <div class="p-alerts">
          <div class="p-alert">대인·대물·자손으로 보험 처리 시 면책금 50만원 임차인 부담</div>
          <div class="p-alert">흡연·반려동물로 인한 오염 시 특수크리닉 30만원 임차인 부담</div>
        </div>
        <ol start="4">
          <li>계약기간 이전 연장운행 시 당사의 허락을 득하여야 하며, 통보 없이 24시간 이상 초과 운행 시에는 불법사용으로 간주되어 도난신고 및 직접 조치를 취하여도 이의를 제기할 수 없으며 보험 혜택도 받지 못합니다. (연장 시 시간당 10% 가산금이 추가됩니다.)</li>
          <li>본 차량은 위치추적장치가 장착되어 있으며 위치정보 수집에 동의합니다.</li>
          <li>임차인 및 제2운전자는 계약서상 기재된 약관의 내용을 숙지하며, 발생되는 주차위반·교통법규위반·사고 등에 대하여 임차인이 책임질 것을 서약하며, 자동차 대여 표준약관에 명시된 사항을 이행치 않았을 때는 민·형사상의 책임도 감수하겠으며 이의를 제기치 않겠을 것을 각서합니다.</li>
          <li>상기 임차인(운전자)은 임차기간 동안 본 계약서와 내용이 사실과 다름이 없음을 확인하며, 보험사에 대한 대차료(렌트비용) 청구권을 임차인이 도윤렌트카에 위임하기에 이에 서명합니다.</li>
        </ol>

        <div class="p-items">
          <span>지급품목 :</span>
          ${ITEMS.map(([k, label]) => `<span class="tag ${state.items.includes(k) ? 'on' : ''}">${state.items.includes(k) ? '☑' : '☐'} ${label}</span>`).join('')}
        </div>

        <div class="p-privacy">
          <h4>※ 개인정보 수집·이용 및 개인정보의 제3자 제공 동의서</h4>
          <p>이 계약서에 기재되는 개인정보는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 의하여 계약서에 기재된 내용을 아래와 같이 이용하는 것에 동의합니다.</p>
          <p>※ 관공서 교통법규 위반 및 과태료(범칙금) 부과, 보험 판매업무, 고객의 귀책사유로 인한 계약 불이행 등으로 회사의 손해가 발생한 경우.</p>
          <p>※ 임차인이 계약종료 후 차량을 미반납할 경우 당사는 임차인을 형사고소 후 차량 회수 조치 예정이며, 반환되지 않은 차량을 운행한 운전자는 운전면허 취소 등 불이익을 받을 수 있습니다.</p>
        </div>

        <div class="p-signrow">
          <div class="lbl">${esc(fmtDateKR(f.signDate) || '　　年　　月　　日')}</div>
          <div class="lbl">성명 : <span class="val">${esc(signName) || '&nbsp;'}</span></div>
          <div class="lbl">${sigImg || '<span class="p-sigempty"></span>'} (인)</div>
        </div>
      </section>

      <div class="p-renter-wrap">
        <table class="pt" style="margin-top:10px">
          <colgroup><col style="width:26px"><col class="col-k"><col><col style="width:34%"></colgroup>
          <tr><th rowspan="5" style="writing-mode:vertical-rl;text-orientation:upright;letter-spacing:.3em;padding:6px 2px">임차인</th><td class="lbl">주　소</td><td colspan="2">${V('addr') ? esc(V('addr')) : '&nbsp;'}</td></tr>
          <tr><td class="lbl">주민등록번호</td><td colspan="2">${V('rrn') ? esc(V('rrn')) : '&nbsp;'}</td></tr>
          <tr><td class="lbl">운전면허번호</td><td>${cell('licNo')}</td><td style="text-align:center">${optCell('licType', ['1종', '2종'])}</td></tr>
          <tr><td class="lbl">H　P</td><td colspan="2">${cell('phone')}</td></tr>
          <tr><td class="lbl">성　명</td><td>${esc(f.name) || '&nbsp;'}</td><td style="text-align:center">${sigImg ? `<img class="p-sigimg" style="height:26px" src="${state.sig.renter}" alt="서명">` : ''} (인)</td></tr>
        </table>
        <ul class="p-note" style="margin-top:5px">
          <li>유류는 최초 대여 시와 동일한 양으로 반납하시며, 부족 시에는 사용한 유류만큼 추가 부담합니다.</li>
          <li>차량 반납 이전 발생한 주차비, 통행료, 과태료는 고객님 부담입니다.</li>
        </ul>

        <div class="p-license">
          <span class="cap">운전면허증<br>사본</span>
          ${state.photo ? `<img src="${state.photo}" alt="운전면허증 사본">` : '<div class="empty">운전면허증 사진 미첨부</div>'}
        </div>

        <table class="pt" style="margin-top:8px">
          <colgroup><col style="width:56px"><col class="col-k"><col><col style="width:26%"></colgroup>
          <tr><th rowspan="5" style="font-size:9.4px;line-height:1.35">연대보증인<br>및<br>제2운전자</th><td class="lbl">성　명</td><td>${esc(f.gName) || '&nbsp;'}</td><td rowspan="5" style="text-align:center">${gSigImg || '<span class="p-sigempty"></span>'}<br>(인)</td></tr>
          <tr><td class="lbl">주　소</td><td>${V('gAddr') ? esc(V('gAddr')) : '&nbsp;'}</td></tr>
          <tr><td class="lbl">주민등록번호</td><td>${V('gRrn') ? esc(V('gRrn')) : '&nbsp;'}</td></tr>
          <tr><td class="lbl">운전면허번호</td><td>${cell('gLicNo')}</td></tr>
          <tr><td class="lbl">전화번호</td><td>${cell('gTel')} ${V('gHp') ? ' / H.P ' + esc(V('gHp')) : ''}</td></tr>
        </table>
      </div>

      <div class="p-foot">
        <span>위 계약 내용을 확인하였으며, 전자서명으로 이 계약에 동의합니다.</span>
        <span>도윤렌트카 · 작성 ${esc(fmtDT(f.signDate) || '')}</span>
      </div>
    </div>`;
  }

  /* ---------------- preview ---------------- */
  function openPreview() {
    const missing = requiredList().filter((x) => !x.ok);
    if (missing.length) {
      const names = missing.map((m) => m.label).join(', ');
      toast(`아직 작성하지 않은 항목이 있습니다: ${names}`, true);
      const first = missing[0];
      if (first.k === 'sig') {
        $('#sec-sign').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (first.k === 'consent') {
        $('#consentBox').closest('.checks').scrollIntoView({ behavior: 'smooth', block: 'center' });
        $('#consentBox').closest('.card').classList.add('shake');
      } else {
        const el = document.querySelector(`[data-field="${first.k}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('has-error');
          setTimeout(() => el.classList.remove('has-error'), 2200);
        }
      }
      refreshProgress();
      return;
    }
    $('#paperRoot').innerHTML = buildPaper();
    $('#preview').hidden = false;
    document.body.classList.add('lock');
    $('#preview').scrollTop = 0;
    $('.pv-body').scrollTop = 0;
    history.replaceState(null, '', location.pathname + location.search + '#preview');
  }
  function closePreview() {
    $('#preview').hidden = true;
    document.body.classList.remove('lock');
    history.replaceState(null, '', location.pathname + location.search);
    $('#sec-sign').scrollIntoView({ block: 'start' });
  }

  /* ---------------- admin link ---------------- */
  function buildLink() {
    const q = new URLSearchParams();
    Object.keys(PARAM_MAP).forEach((p) => {
      const k = PARAM_MAP[p];
      const v = state.fields[k];
      if (v == null || v === '') return;
      q.set(p, v);
    });
    if (state.damage.length) q.set('dmg', dmgParam());
    const url = location.origin + location.pathname + '?' + q.toString();
    return url;
  }
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  function refreshAdminLink() {
    const inp = $('#adminLink');
    if (!inp) return;
    const url = buildLink();
    inp.value = url;
    const len = $('#adminLinkLen');
    if (len) len.textContent = url.length + '자';
  }

  /* ---------------- photo ---------------- */
  function handlePhoto(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) { toast('이미지 파일만 첨부할 수 있습니다.', true); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1400;
        let w = img.width, h = img.height;
        if (w > max || h > max) {
          const r = Math.min(max / w, max / h);
          w = Math.round(w * r); h = Math.round(h * r);
        }
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const cx = c.getContext('2d');
        cx.fillStyle = '#fff'; cx.fillRect(0, 0, w, h);
        cx.drawImage(img, 0, 0, w, h);
        state.photo = c.toDataURL('image/jpeg', 0.85);
        const pv = $('#licensePreview');
        $('#licenseImg').src = state.photo;
        pv.classList.add('show');
        toast('운전면허증이 첨부되었습니다.');
      };
      img.onerror = () => toast('이미지를 읽을 수 없습니다. 다른 사진을 선택해 주세요.', true);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /* ---------------- events ---------------- */
  function bindEvents() {
    const root = $('#formRoot');

    root.addEventListener('input', (ev) => {
      const t = ev.target;
      if (t.dataset && t.dataset.k) {
        if (t.type === 'radio') return;
        state.fields[t.dataset.k] = t.value;
        if (t.dataset.k === 'carIns') {
          const s = $('#insStateText');
          if (s) s.textContent = t.value ? `(${t.value})` : '( 가입 · 미가입 )';
        }
        if (t.dataset.k === 'name') {
          const sn = $('#f_signName');
          if (sn && (!sn.dataset.touched || !sn.value)) sn.value = t.value;
        }
        refreshProgress();
        saveDraft();
      }
      if (t.id === 'consentBox') {
        state.consent = t.checked; refreshProgress(); saveDraft();
      }
      if (t.dataset && t.dataset.item) {
        const k = t.dataset.item;
        if (t.checked) { if (!state.items.includes(k)) state.items.push(k); }
        else state.items = state.items.filter((x) => x !== k);
        saveDraft();
      }
    });

    root.addEventListener('change', (ev) => {
      const t = ev.target;
      if (t.type === 'radio' && t.name) {
        state.fields[t.name] = t.value;
        if (t.name === 'carIns') {
          const s = $('#insStateText');
          if (s) s.textContent = `(${t.value})`;
        }
        refreshProgress(); saveDraft();
      }
      if (t.type === 'checkbox' && t.id === 'consentBox') {
        state.consent = t.checked; refreshProgress(); saveDraft();
      }
      if (t.dataset && t.dataset.k) {
        const k = t.dataset.k, type = t.dataset.type;
        let v = t.value;
        if (type === 'phone') v = fmtPhone(v);
        else if (type === 'rrn') v = fmtRRN(v);
        else if (type === 'lic') v = fmtLic(v);
        else if (type === 'money' || type === 'num') v = money(v);
        if (v !== t.value) t.value = v;
        state.fields[k] = v;
        if (k === 'signName') t.dataset.touched = '1';
        refreshProgress(); saveDraft();
      }
    });

    root.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === 'dmg-undo') {
        state.damage.pop(); renderDamages(); saveDraft();
        toast('마지막 표시를 지웠습니다.');
      } else if (act === 'dmg-clear') {
        if (!state.damage.length) { toast('표시된 손상이 없습니다.'); return; }
        state.damage = []; renderDamages(); saveDraft();
        toast('손상 표시를 모두 지웠습니다.');
      } else if (act === 'sig-clear') {
        const key = btn.dataset.target;
        if (pads[key]) pads[key].clear();
        toast('서명을 지웠습니다.');
      } else if (act === 'photo-camera') {
        $('#fileCamera').click();
      } else if (act === 'photo-gallery') {
        $('#fileGallery').click();
      } else if (act === 'photo-remove') {
        state.photo = null;
        $('#licenseImg').src = '';
        $('#licensePreview').classList.remove('show');
        toast('첨부한 사진을 삭제했습니다.');
      }
    });

    $('#fileCamera').addEventListener('change', (e) => handlePhoto(e.target.files[0]));
    $('#fileGallery').addEventListener('change', (e) => handlePhoto(e.target.files[0]));

    $('#btnPreview').addEventListener('click', openPreview);
    $('#btnBack').addEventListener('click', closePreview);
    $('#btnPrint').addEventListener('click', () => window.print());

    $('#adminToggle').addEventListener('click', () => {
      const next = !state.admin;
      location.href = location.pathname + (next ? '?admin=1' : '');
    });

    if ($('#btnCopyLink')) {
      $('#btnCopyLink').addEventListener('click', async () => {
        const url = buildLink();
        const ok = await copyText(url);
        toast(ok ? '고객용 링크를 복사했습니다. 고객에게 붙여넣어 보내세요.' : '복사가 차단되었습니다. 링크 칸을 길게 눌러 직접 복사해 주세요.', !ok);
        refreshAdminLink();
      });
      $('#btnOpenLink').addEventListener('click', () => {
        window.open(buildLink(), '_blank', 'noopener');
      });
      $('#adminLink').addEventListener('focus', (e) => e.target.select());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !$('#preview').hidden) closePreview();
    });
  }

  /* ---------------- init ---------------- */
  function renderBranches() {
    $('#branchList').innerHTML = BRANCHES.map((b) => `<li><a href="tel:${b.dial}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
      <b>${b.name}</b><span>${b.tel}</span></a></li>`).join('');
  }

  function init() {
    renderBranches();
    loadDraft();
    buildForm();
    applyLock();
    bindDamage();
    renderDamages();
    initPads();
    bindEvents();
    refreshProgress();
    $('#adminPanel').hidden = !state.admin;
    $('#adminToggle').setAttribute('aria-pressed', String(state.admin));
    if (state.admin) refreshAdminLink();
    if (state.locked) {
      const note = $('#sec-vehicle .ch-text p');
      if (note) note.textContent = '배차담당자가 입력한 정보입니다. 내용이 다르면 지점으로 연락해 주세요.';
    }
    if (location.hash === '#preview') { /* nothing: full data needed */ }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
