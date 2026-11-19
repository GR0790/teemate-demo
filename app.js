/* =========================================================
   티메이트 TeeMate — 데모 앱
   상태 · 가격 엔진 · SVG 목업 · 렌더 · 인터랙션 · 견적서
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 기본 데이터 ---------- */
  const TEE  = "M200 40 C185 40 172 46 163 57 L104 74 C86 83 72 97 65 115 L45 196 C41 208 47 220 59 223 L96 233 C106 236 113 229 114 219 L96 190 L96 386 C96 396 104 404 115 404 L285 404 C296 404 304 396 304 386 L304 190 L286 219 C287 229 294 236 304 233 L341 223 C353 220 359 208 355 196 L335 115 C328 97 314 83 296 74 L237 57 C228 46 215 40 200 40 Z";
  const LONG = "M200 40 C185 40 172 46 163 57 L104 74 C88 88 78 108 74 130 L56 292 C54 306 60 316 72 318 L98 322 C106 323 110 317 110 308 L96 190 L96 386 C96 396 104 404 115 404 L285 404 C296 404 304 396 304 386 L304 190 L290 308 C290 317 294 323 302 322 L328 318 C340 316 346 306 344 292 L326 130 C322 108 312 88 296 74 L237 57 C228 46 215 40 200 40 Z";
  const VEST = "M200 46 C184 46 171 52 162 62 L122 76 C136 100 148 124 152 150 C156 178 138 200 106 206 L106 380 C106 390 114 398 125 398 L275 398 C286 398 294 390 294 380 L294 206 C262 200 244 178 248 150 C252 124 264 100 278 76 L238 62 C229 52 216 46 200 46 Z";
  const CAP  = "M104 282 C100 250 104 218 112 196 C120 172 132 156 148 147 C164 139 182 136 200 136 C218 136 236 139 252 147 C268 156 280 172 288 196 C296 218 300 250 296 282 C252 263 148 263 104 282 Z";
  const CAP_BRIM = "M104 282 C148 263 252 263 296 282 C302 290 301 309 293 316 C285 321 272 318 258 312 C240 305 160 305 142 312 C128 318 115 321 107 316 C99 309 98 290 104 282 Z";
  const CAP_SEAMSHADE = "M104 282 C148 263 252 263 296 282 L296 292 C252 273 148 273 104 292 Z";
  const CAP_BACK = "M104 282 C100 250 104 218 112 196 C120 172 132 156 148 147 C164 139 182 136 200 136 C218 136 236 139 252 147 C268 156 280 172 288 196 C296 218 300 250 296 282 C290 296 250 303 200 303 C150 303 110 296 104 282 Z";

  const neckRib = '<path d="M163 57 C174 78 226 78 237 57" fill="none" stroke="DET" stroke-width="2.6" stroke-linecap="round"/><path d="M170 60 C179 72 221 72 230 60" fill="none" stroke="DET2" stroke-width="1.2"/>';
  const hemTee  = '<path d="M98 390 L302 390" stroke="DET2" stroke-width="1.4" fill="none"/><path d="M98 398 L302 398" stroke="DET2" stroke-width="1" fill="none" stroke-dasharray="5 4"/>';
  const hemLong = '<path d="M98 390 L302 390" stroke="DET2" stroke-width="1.4" fill="none"/><path d="M98 398 L302 398" stroke="DET2" stroke-width="1" fill="none" stroke-dasharray="5 4"/>';
  const sleeveTee = '<path d="M50 201 L94 224" stroke="DET2" stroke-width="1.3" fill="none"/><path d="M350 201 L306 224" stroke="DET2" stroke-width="1.3" fill="none"/><path d="M96 190 L96 386" stroke="DET2" stroke-width=".9" fill="none" opacity=".6"/><path d="M304 190 L304 386" stroke="DET2" stroke-width=".9" fill="none" opacity=".6"/>';
  const cuffLong  = '<path d="M60 306 L96 316" stroke="DET2" stroke-width="1.4" fill="none"/><path d="M340 306 L304 316" stroke="DET2" stroke-width="1.4" fill="none"/><path d="M96 190 L96 386" stroke="DET2" stroke-width=".9" fill="none" opacity=".55"/><path d="M304 190 L304 386" stroke="DET2" stroke-width=".9" fill="none" opacity=".55"/>';
  const backNeck  = '<path d="M165 57 C176 68 224 68 235 57" fill="none" stroke="DET" stroke-width="2.2" stroke-linecap="round"/><path d="M200 53 L200 66" stroke="DET2" stroke-width="1.2"/>';
  const foldTee   = '<path d="M154 300 C160 322 158 348 152 366" stroke="DET2" stroke-width="1" fill="none" opacity=".55"/><path d="M246 300 C240 322 242 348 248 366" stroke="DET2" stroke-width="1" fill="none" opacity=".55"/>';

  const ITEMS = {
    round:{name:'라운드티', base:7900, spec:'17수 헤비 면 100% · 185g', fabric:'면 100%', size:'M~3XL', body:TEE,
      front:neckRib+sleeveTee+hemTee+foldTee, back:backNeck+hemTee+sleeveTee+foldTee,
      anchor:{chest:{x:152,y:232},back:{x:200,y:258},sleeve:{x:64,y:176,rot:-14}}},
    collar:{name:'카라티', base:10800, spec:'쿨론 PK 카라 · 흡습속건 150g', fabric:'폴리 100%', size:'M~3XL', body:TEE,
      front:neckRib+'<path d="M163 57 L170 92 L200 104 L230 92 L237 57 L200 72 Z" fill="DET3" stroke="DET" stroke-width="1.6" stroke-linejoin="round"/><path d="M191 104 L191 158 M200 104 L200 158" stroke="DET2" stroke-width="1.1"/><circle cx="200" cy="120" r="2.2" fill="DET"/><circle cx="200" cy="142" r="2.2" fill="DET"/>'+sleeveTee+hemTee+foldTee,
      back:backNeck+hemTee+sleeveTee+foldTee,
      anchor:{chest:{x:152,y:232},back:{x:200,y:258},sleeve:{x:64,y:176,rot:-14}}},
    cool:{name:'기능성 쿨론티', base:8900, spec:'쿨론 메쉬 · 자외선차단 150g', fabric:'폴리 100%', size:'M~3XL', body:TEE,
      front:neckRib+'<g fill="DET2" opacity=".75"><circle cx="146" cy="248" r="1.7"/><circle cx="164" cy="262" r="1.7"/><circle cx="182" cy="248" r="1.7"/><circle cx="200" cy="262" r="1.7"/><circle cx="218" cy="248" r="1.7"/><circle cx="236" cy="262" r="1.7"/><circle cx="254" cy="248" r="1.7"/><circle cx="154" cy="284" r="1.7"/><circle cx="172" cy="298" r="1.7"/><circle cx="190" cy="284" r="1.7"/><circle cx="208" cy="298" r="1.7"/><circle cx="226" cy="284" r="1.7"/><circle cx="244" cy="298" r="1.7"/><circle cx="146" cy="320" r="1.7"/><circle cx="164" cy="334" r="1.7"/><circle cx="182" cy="320" r="1.7"/><circle cx="200" cy="334" r="1.7"/><circle cx="218" cy="320" r="1.7"/><circle cx="236" cy="334" r="1.7"/><circle cx="254" cy="320" r="1.7"/></g>'+sleeveTee+hemTee+foldTee,
      back:backNeck+hemTee+sleeveTee+foldTee,
      anchor:{chest:{x:152,y:232},back:{x:200,y:258},sleeve:{x:64,y:176,rot:-14}}},
    mtm:{name:'맨투맨', base:14900, spec:'특양면 280g · 시보리 · 기모 옵션', fabric:'면/폴리', size:'M~3XL', body:LONG,
      front:neckRib+'<path d="M114 219 C118 226 124 230 131 229" stroke="DET2" stroke-width="1.2" fill="none"/><path d="M286 219 C282 226 276 230 269 229" stroke="DET2" stroke-width="1.2" fill="none"/>'+cuffLong+hemLong+foldTee,
      back:backNeck+cuffLong+hemLong+foldTee,
      anchor:{chest:{x:152,y:230},back:{x:200,y:256},sleeve:{x:66,y:200,rot:-12}}},
    vest:{name:'단체조끼', base:16900, spec:'망사·작업조끼 · 반사띠 옵션', fabric:'폴리 망사', size:'M~3XL', body:VEST,
      front:'<path d="M200 56 L200 394" stroke="DET" stroke-width="2.2"/><path d="M195 56 L195 394" stroke="DET2" stroke-width="1.1"/><rect x="191" y="94" width="18" height="6" rx="3" fill="DET"/><path d="M122 76 C136 100 148 124 152 150 C156 178 138 200 106 206" stroke="DET" stroke-width="2" fill="none"/><path d="M278 76 C264 100 252 124 248 150 C244 178 262 200 294 206" stroke="DET" stroke-width="2" fill="none"/><path d="M112 376 L288 376" stroke="DET2" stroke-width="1.3"/><path d="M162 62 C172 84 228 84 238 62" stroke="DET" stroke-width="2" fill="none"/>',
      back:backNeck+'<path d="M200 64 L200 394" stroke="DET2" stroke-width="1.2"/><path d="M112 376 L288 376" stroke="DET2" stroke-width="1.3"/><path d="M122 76 C136 100 148 124 152 150 C156 178 138 200 106 206" stroke="DET2" stroke-width="1.4" fill="none"/><path d="M278 76 C264 100 252 124 248 150 C244 178 262 200 294 206" stroke="DET2" stroke-width="1.4" fill="none"/>',
      anchor:{chest:{x:152,y:252},back:{x:200,y:268},sleeve:{x:118,y:200,rot:-8}}},
    jumper:{name:'단체점퍼', base:32900, spec:'바람막이 · 안감 · 지퍼', fabric:'나일론/폴리', size:'M~3XL', body:LONG,
      front:'<path d="M166 62 C166 74 178 82 200 82 C222 82 234 74 234 62 L234 50 C234 44 226 40 216 40 L184 40 C174 40 166 44 166 50 Z" fill="DET3" stroke="DET" stroke-width="1.5"/><path d="M200 82 L200 400" stroke="DET" stroke-width="2"/><path d="M196 84 L196 400" stroke="DET2" stroke-width="1"/><rect x="192" y="104" width="16" height="5" rx="2.5" fill="DET"/>'+cuffLong+'<path d="M98 390 L302 390" stroke="DET" stroke-width="2.4"/><path d="M112 338 C128 330 138 330 148 338" stroke="DET2" stroke-width="1.3" fill="none"/><path d="M288 338 C272 330 262 330 252 338" stroke="DET2" stroke-width="1.3" fill="none"/>',
      back:backNeck+'<path d="M200 70 L200 400" stroke="DET2" stroke-width="1.1"/><path d="M98 390 L302 390" stroke="DET" stroke-width="2.4"/>'+cuffLong,
      anchor:{chest:{x:152,y:230},back:{x:200,y:256},sleeve:{x:66,y:200,rot:-12}}},
    jacket:{name:'야구과잠', base:42900, spec:'야구점퍼 · 스냅 · 시보리', fabric:'폴리/울', size:'M~3XL', body:LONG,
      front:'<path d="M166 62 C166 74 178 82 200 82 C222 82 234 74 234 62 L234 48 C234 42 224 38 214 38 L186 38 C176 38 166 42 166 48 Z" fill="DET3" stroke="DET" stroke-width="1.5"/><path d="M200 82 L200 402" stroke="DET" stroke-width="2"/><g fill="DET"><circle cx="200" cy="110" r="3"/><circle cx="200" cy="152" r="3"/><circle cx="200" cy="194" r="3"/></g><path d="M40 292 L82 309" stroke="DET" stroke-width="2.4"/><path d="M360 292 L318 309" stroke="DET" stroke-width="2.4"/><path d="M98 386 L302 386" stroke="DET" stroke-width="2.4"/><path d="M98 396 L302 396" stroke="DET" stroke-width="2.4"/><path d="M114 330 C130 322 140 322 150 330" stroke="DET2" stroke-width="1.3" fill="none"/><path d="M286 330 C270 322 260 322 250 330" stroke="DET2" stroke-width="1.3" fill="none"/>',
      back:backNeck+'<path d="M200 70 L200 402" stroke="DET2" stroke-width="1.1"/><path d="M98 386 L302 386" stroke="DET" stroke-width="2.4"/><path d="M98 396 L302 396" stroke="DET" stroke-width="2.4"/>',
      anchor:{chest:{x:152,y:230},back:{x:200,y:256},sleeve:{x:66,y:200,rot:-12}}},
    cap:{name:'모자', base:6900, spec:'볼캡 · 스냅백 · 자수 기본', fabric:'면 트윌', size:'FREE', body:CAP, cap:true,
      front:'<path d="M200 140 C197 180 199 220 200 258" stroke="DET2" stroke-width="1.2" fill="none"/><path d="M197 141 C186 180 166 218 154 250" stroke="DET2" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/><path d="M203 141 C214 180 234 218 246 250" stroke="DET2" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/><circle cx="200" cy="135" r="6.4" fill="DET3" stroke="DET" stroke-width="1.5"/><circle cx="164" cy="190" r="2.1" fill="DET2"/><circle cx="236" cy="190" r="2.1" fill="DET2"/>',
      back:'<path d="M200 140 C197 180 199 210 200 244" stroke="DET2" stroke-width="1.2" fill="none"/><path d="M197 141 C186 180 166 218 154 250" stroke="DET2" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/><path d="M203 141 C214 180 234 218 246 250" stroke="DET2" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/><circle cx="200" cy="135" r="6.4" fill="DET3" stroke="DET" stroke-width="1.5"/><path d="M170 256 C178 234 222 234 230 256" stroke="DET" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M179 256 C185 240 215 240 221 256" stroke="DET2" stroke-width="1" fill="none"/>',
      anchor:{chest:{x:200,y:204,center:true},back:{x:200,y:198,center:true},sleeve:{x:200,y:204,center:true}}}
  };

  const COLORS = {
    white:{name:'화이트', hex:'#FFFFFF'},
    black:{name:'블랙', hex:'#22262E'},
    navy:{name:'네이비', hex:'#1B2A4A'},
    gray:{name:'멜란지 그레이', hex:'#B9BFC9'},
    royal:{name:'로얄블루', hex:'#1F4FD1'},
    sky:{name:'스카이블루', hex:'#8FC2E8'},
    red:{name:'레드', hex:'#C4363C'},
    safety:{name:'형광 안전', hex:'#CCE32F'}
  };

  const POSITIONS = {
    chest:{name:'왼가슴 소형', add:3500, note:'8cm 이내', short:'가슴'},
    back:{name:'등판 대형', add:6000, note:'A4 이내', short:'등판'},
    both:{name:'왼가슴 + 등판', add:8500, note:'가장 인기', short:'가슴+등판'},
    sleeve:{name:'소매', add:3000, note:'한쪽 소매', short:'소매'}
  };

  const METHODS = {
    dye:{name:'나염', add:0, note:'면 소재 기본'},
    dtf:{name:'DTF 전사', add:1000, note:'풀컬러·사진'},
    emb:{name:'자수', add:3500, note:'고급·입체감'}
  };

  const TIERS = [
    {min:500, rate:.24, label:'500장 이상 24%'},
    {min:200, rate:.20, label:'200장 이상 20%'},
    {min:100, rate:.16, label:'100장 이상 16%'},
    {min:50,  rate:.11, label:'50장 이상 11%'},
    {min:30,  rate:.06, label:'30장 이상 6%'},
    {min:10,  rate:0,   label:'10~29장 기본가'}
  ];

  const PRINT_DISC = q => q>=500?2000 : q>=200?1800 : q>=100?1500 : q>=50?1000 : q>=30?500 : 0;

  const state = {
    item:'round', color:'navy', qty:30, pos:'chest', method:'dye',
    company:'한빛정밀', slogan:'안전제일', view:'front', guide:false
  };

  /* ---------- 유틸 ---------- */
  const $ = s => document.querySelector(s);
  const $$ = s => Array.prototype.slice.call(document.querySelectorAll(s));
  const won = n => Math.round(n).toLocaleString('ko-KR') + '원';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  function lum(hex){
    const h = hex.replace('#','');
    const r = parseInt(h.substr(0,2),16)/255, g = parseInt(h.substr(2,2),16)/255, b = parseInt(h.substr(4,2),16)/255;
    const f = c => c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055,2.4);
    return .2126*f(r)+.7152*f(g)+.0722*f(b);
  }
  const isLight = hex => lum(hex) > .62;

  /* ---------- 가격 엔진 ---------- */
  function tierFor(q){
    for (let i=0;i<TIERS.length;i++) if (q >= TIERS[i].min) return TIERS[i];
    return TIERS[TIERS.length-1];
  }
  function priceOf(itemKey, colorKey, qty, posKey, methodKey){
    const it = ITEMS[itemKey];
    const tier = tierFor(qty);
    const pDisc = PRINT_DISC(qty);
    const printRaw = POSITIONS[posKey].add + METHODS[methodKey].add;
    const print = Math.max(1200, printRaw - pDisc);
    const baseDisc = it.base * (1 - tier.rate);
    const unit = Math.round((baseDisc + print) / 10) * 10;
    const total = unit * qty;
    const vat = Math.round(total * .1);
    return {
      it, tier, base: it.base, baseDisc, print, printRaw, printDisc: printRaw - print, pDisc,
      unit, total, vat, totalWithVat: total + vat,
      saveBase: Math.round((it.base - baseDisc)) * qty
    };
  }
  const calc = () => priceOf(state.item, state.color, state.qty, state.pos, state.method);

  /* ---------- 복장 SVG ---------- */
  function garmentSVG(itemKey, colorKey, view, opts){
    opts = opts || {};
    const it = ITEMS[itemKey];
    const col = COLORS[colorKey] || COLORS.navy;
    const light = isLight(col.hex);
    const det  = light ? 'rgba(16,42,86,.34)' : 'rgba(255,255,255,.55)';
    const det2 = light ? 'rgba(16,42,86,.20)' : 'rgba(255,255,255,.32)';
    const det3 = light ? 'rgba(16,42,86,.06)' : 'rgba(255,255,255,.12)';
    const edge = light ? 'rgba(16,42,86,.22)' : 'rgba(0,0,0,.26)';
    const uid  = 'g' + Math.random().toString(36).slice(2,8);
    const body = (it.cap && view === 'back') ? CAP_BACK : it.body;
    const details = (view === 'back' ? it.back : it.front)
      .replace(/DET3/g, det3).replace(/DET2/g, det2).replace(/DET/g, det);
    const print = opts.print === false ? '' : printLayer(it, col, view, opts);
    const guide = opts.guide ? guideLayer(it, view) : '';

    return '<svg viewBox="0 0 400 470" role="img" aria-label="' + esc(it.name + ' ' + col.name + ' 미리보기') + '">' +
      '<defs>' +
        '<clipPath id="' + uid + 'clip"><path d="' + body + '"/></clipPath>' +
        '<clipPath id="' + uid + 'brimclip"><path d="' + CAP_BRIM + '"/></clipPath>' +
        '<linearGradient id="' + uid + 'sh" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="#000" stop-opacity=".15"/>' +
          '<stop offset=".2" stop-color="#000" stop-opacity="0"/>' +
          '<stop offset=".74" stop-color="#fff" stop-opacity="0"/>' +
          '<stop offset="1" stop-color="#fff" stop-opacity=".13"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + uid + 'sh2" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#fff" stop-opacity=".10"/>' +
          '<stop offset=".45" stop-color="#fff" stop-opacity="0"/>' +
          '<stop offset="1" stop-color="#000" stop-opacity=".10"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + uid + 'brim" x1="0" y1="0.02" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#fff" stop-opacity=".07"/>' +
          '<stop offset=".35" stop-color="#fff" stop-opacity="0"/>' +
          '<stop offset=".72" stop-color="#000" stop-opacity=".02"/>' +
          '<stop offset="1" stop-color="#000" stop-opacity=".12"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + uid + 'bsh" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#000" stop-opacity=".24"/>' +
          '<stop offset="1" stop-color="#000" stop-opacity="0"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<ellipse cx="200" cy="' + (it.cap ? 320 : 424) + '" rx="' + (it.cap ? 100 : 112) + '" ry="' + (it.cap ? 13 : 12) + '" fill="#0B1526" opacity=".10"/>' +
      '<path d="' + body + '" fill="' + col.hex + '" stroke="' + edge + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<g clip-path="url(#' + uid + 'clip)">' +
        '<rect x="0" y="0" width="400" height="470" fill="url(#' + uid + 'sh)"/>' +
        '<rect x="0" y="0" width="400" height="470" fill="url(#' + uid + 'sh2)"/>' +
      '</g>' +
      (it.cap && view !== 'back' ? capBrimSVG(col, edge, det2, uid) : '') +
      details + print + guide +
    '</svg>';
  }

  function capBrimSVG(col, edge, det2, uid){
    return '<path d="' + CAP_BRIM + '" fill="' + col.hex + '" stroke="' + edge + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="' + CAP_BRIM + '" fill="url(#' + uid + 'brim)"/>' +
      '<g clip-path="url(#' + uid + 'brimclip)"><path d="M104 320 C150 306 250 306 296 320" fill="none" stroke="#0B1526" stroke-opacity=".16" stroke-width="7"/></g>' +
      '<path d="' + CAP_SEAMSHADE + '" fill="url(#' + uid + 'bsh)"/>' +
      '<path d="M126 306 C158 298 242 298 274 306" fill="none" stroke="' + det2 + '" stroke-width="1" stroke-dasharray="4 3"/>';
  }

  function guideLayer(it, view){
    const a = view === 'back' ? it.anchor.back : it.anchor.chest;
    const w = it.cap ? 74 : (view === 'back' ? 156 : 86);
    const h = it.cap ? 40 : (view === 'back' ? 104 : 46);
    const x = (a.x || 200) - w/2, y = a.y - h/2 - (it.cap?8:10);
    return '<g opacity=".85"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="none" stroke="#1F5AE0" stroke-width="1.4" stroke-dasharray="5 4"/>' +
      '<text x="' + x + '" y="' + (y - 4) + '" fill="#1F5AE0" font-family="Pretendard,sans-serif" font-size="9" font-weight="700">인쇄 영역</text></g>';
  }

  function fitSize(text, base){
    const len = (text || '').length || 1;
    if (len <= 5) return base;
    return Math.max(base * .46, base * (5 / len) * 1.08);
  }

  function printLayer(it, col, view, opts){
    const light = isLight(col.hex);
    const ink  = light ? '#12203A' : '#FFFFFF';
    const ink2 = light ? 'rgba(18,32,58,.70)' : 'rgba(255,255,255,.80)';
    const company = String(opts.company != null ? opts.company : state.company).trim();
    const slogan  = String(opts.slogan  != null ? opts.slogan  : state.slogan).trim();
    const pos = opts.pos || state.pos;
    const logo = opts.logo || null;

    if (!company && !slogan){
      return '<g opacity=".5"><text x="200" y="' + (it.cap ? 192 : 262) + '" text-anchor="middle" fill="' + ink2 + '" font-size="11.5" font-family="Pretendard,sans-serif">업체명을 입력해 보세요</text></g>';
    }

    function textBlock(x, y, size, center){
      const t = company || slogan;
      const sub = company ? slogan : '';
      const fs = fitSize(t, size);
      const subSize = Math.max(5.2, fs * .38);
      const anchorText = center ? 'middle' : 'start';
      let out = '<text x="' + x + '" y="' + y + '" text-anchor="' + anchorText + '" fill="' + ink + '" font-family="Pretendard,sans-serif" font-weight="800" font-size="' + fs + '" letter-spacing="' + (center ? 1.2 : .4) + '">' + esc(t) + '</text>';
      if (sub) out += '<text x="' + x + '" y="' + (y + fs * .95) + '" text-anchor="' + anchorText + '" fill="' + ink2 + '" font-family="Pretendard,sans-serif" font-weight="700" font-size="' + subSize + '" letter-spacing="1.5">' + esc(sub) + '</text>';
      return out;
    }

    function logoBlock(x, y, scale){
      const name = company || 'OUR TEAM';
      if (logo === 'emblem'){
        return '<g transform="translate(' + x + ',' + y + ')">' +
          '<circle cx="0" cy="0" r="19" fill="none" stroke="' + ink + '" stroke-width="2"/>' +
          '<circle cx="0" cy="0" r="15" fill="none" stroke="' + ink + '" stroke-width=".7" opacity=".6"/>' +
          '<text x="0" y="4.5" text-anchor="middle" fill="' + ink + '" font-family="Pretendard,sans-serif" font-size="14" font-weight="800">H</text>' +
          '<text x="0" y="30" text-anchor="middle" fill="' + ink + '" font-family="Pretendard,sans-serif" font-size="6.6" font-weight="700" letter-spacing="1.2">' + esc(name.toUpperCase().slice(0,10)) + '</text></g>';
      }
      if (logo === 'shield'){
        return '<g transform="translate(' + x + ',' + y + ') scale(' + (scale||1) + ')">' +
          '<path d="M0 -26 L21 -17 V2 C21 15 11 23 0 28 C-11 23 -21 15 -21 2 V-17 Z" fill="none" stroke="' + ink + '" stroke-width="2.2" stroke-linejoin="round"/>' +
          '<path d="M-8 0 L-2 7 L9 -7" fill="none" stroke="' + ink + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<text x="0" y="44" text-anchor="middle" fill="' + ink + '" font-family="Pretendard,sans-serif" font-size="9" font-weight="800" letter-spacing=".6">' + esc(name) + '</text></g>';
      }
      if (logo === 'wordmark'){
        return '<g transform="translate(' + x + ',' + y + ')">' +
          '<rect x="-34" y="-17" width="68" height="30" rx="3" fill="' + ink + '"/>' +
          '<text x="0" y="4" text-anchor="middle" fill="' + (light ? '#fff' : '#12203A') + '" font-family="Pretendard,sans-serif" font-size="12.5" font-weight="800" letter-spacing=".4">' + esc(name.slice(0,6)) + '</text>' +
          '<text x="0" y="27" text-anchor="middle" fill="' + ink2 + '" font-family="Pretendard,sans-serif" font-size="6.4" font-weight="700" letter-spacing="2">' + esc((slogan||'SINCE 2019').toUpperCase().slice(0,14)) + '</text></g>';
      }
      return textBlock(x, y, 15, false);
    }

    if (opts.logo) {
      if (view === 'back' && (pos === 'chest' || pos === 'sleeve')) {
        return '<g opacity=".45"><text x="200" y="240" text-anchor="middle" fill="' + ink2 + '" font-size="10.5" font-family="Pretendard,sans-serif">앞면에서 확인</text></g>';
      }
      if (it.cap) return logoBlock(200, 198, 1);
      if (view === 'back') return logoBlock(200, 240, 1.95);
      if (pos === 'sleeve') return '<g transform="rotate(-14 66 178)">' + logoBlock(66, 178, .6) + '</g>';
      if (pos === 'back') return '<g opacity=".45"><text x="200" y="250" text-anchor="middle" fill="' + ink2 + '" font-size="10.5" font-family="Pretendard,sans-serif">등판 인쇄 · 뒷면에서 확인</text></g>';
      return logoBlock(it.anchor.chest.x + 22, it.anchor.chest.y - 10, 1.7);
    }

    if (view === 'back'){
      if (pos === 'chest' || pos === 'sleeve'){
        return '<g opacity=".45"><text x="200" y="240" text-anchor="middle" fill="' + ink2 + '" font-size="10.5" font-family="Pretendard,sans-serif">' + (pos === 'chest' ? '왼가슴 인쇄 · 앞면에서 확인' : '소매 인쇄 · 앞면에서 확인') + '</text></g>';
      }
      return textBlock(it.anchor.back.x, it.anchor.back.y - 16, 27, true);
    }

    if (it.cap) return textBlock(200, 205, 16, true);
    if (pos === 'back') return '<g opacity=".45"><text x="200" y="250" text-anchor="middle" fill="' + ink2 + '" font-size="10.5" font-family="Pretendard,sans-serif">등판 인쇄 · 뒷면에서 확인</text></g>';
    if (pos === 'sleeve') return '<g transform="rotate(-14 ' + it.anchor.sleeve.x + ' ' + it.anchor.sleeve.y + ')">' + textBlock(it.anchor.sleeve.x, it.anchor.sleeve.y, 10, true) + '</g>';
    const b = textBlock(it.anchor.chest.x, it.anchor.chest.y, 14.5, false);
    if (pos === 'both'){
      return b + '<g opacity=".4"><text x="200" y="' + (it.anchor.chest.y + 46) + '" text-anchor="middle" fill="' + ink2 + '" font-size="9.5" font-family="Pretendard,sans-serif">+ 등판 대형 인쇄</text></g>';
    }
    return b;
  }

  /* ---------- 렌더: 품목 ---------- */
  function iconSVG(k){
    const it = ITEMS[k];
    const base = it.cap
      ? '<path d="' + CAP + '" fill="#E2EBF9" stroke="#20406F" stroke-width="9" stroke-linejoin="round"/>' +
        '<path d="' + CAP_BRIM + '" fill="#CFDDF1" stroke="#20406F" stroke-width="9" stroke-linejoin="round"/>' +
        '<path d="M104 282 C148 263 252 263 296 282" stroke="#20406F" stroke-width="4" fill="none"/>' +
        '<path d="M200 142 C197 180 199 220 200 256" stroke="#20406F" stroke-width="4" fill="none"/>' +
        '<path d="M197 143 C186 182 166 220 156 250" stroke="#20406F" stroke-width="4" fill="none" stroke-linecap="round" opacity=".4"/>' +
        '<path d="M203 143 C214 182 234 220 244 250" stroke="#20406F" stroke-width="4" fill="none" stroke-linecap="round" opacity=".4"/>' +
        '<circle cx="200" cy="136" r="7" fill="#20406F"/>'
      : '<path d="' + it.body + '" fill="#E2EBF9" stroke="#20406F" stroke-width="9" stroke-linejoin="round"/>';
    const extra = it.cap ? ''
      : (k === 'vest' ? '<path d="M200 58 L200 396" stroke="#20406F" stroke-width="7"/>'
      : (k === 'jumper' || k === 'jacket') ? '<path d="M200 82 L200 400" stroke="#20406F" stroke-width="7"/>'
      : (k === 'collar') ? '<path d="M163 57 L200 100 L237 57" stroke="#20406F" stroke-width="7" fill="none" stroke-linejoin="round"/>' : '');
    const stitch = it.cap ? '' : '<path d="M163 57 C174 78 226 78 237 57" stroke="#20406F" stroke-width="7" fill="none"/>';
    return base + extra + stitch;
  }

  function renderItems(){
    $('#itemGrid').innerHTML = Object.keys(ITEMS).map(k => {
      const it = ITEMS[k];
      return '<button class="item" type="button" data-item="' + k + '" aria-pressed="' + (state.item === k) + '">' +
        '<span class="tick">✓</span>' +
        '<svg viewBox="0 0 400 470" aria-hidden="true">' + iconSVG(k) + '</svg>' +
        '<span class="nm">' + it.name + '</span>' +
        '<span class="pr">' + won(it.base) + '~</span>' +
      '</button>';
    }).join('');
  }

  function renderColors(){
    $('#colorRow').innerHTML = Object.keys(COLORS).map(k => {
      const c = COLORS[k];
      return '<button class="sw" type="button" data-color="' + k + '" aria-pressed="' + (state.color === k) + '" aria-label="' + c.name + '" title="' + c.name + '" style="background:' + c.hex + '"><span class="nm">' + c.name + '</span></button>';
    }).join('');
    updateColorLabel();
  }
  function updateColorLabel(){
    const c = COLORS[state.color];
    if ($('#colorName')) $('#colorName').textContent = c.name;
    if ($('#colorName2')) $('#colorName2').textContent = c.name;
    if ($('#colorDot')) $('#colorDot').style.background = c.hex;
    if ($('#mkColor')) $('#mkColor').textContent = c.name;
  }

  function renderQty(){
    const presets = [10,30,50,100,200];
    $('#qtyChips').innerHTML = presets.map(n =>
      '<button class="chip" type="button" data-qty="' + n + '" aria-pressed="' + (state.qty === n) + '">' + n + '장</button>'
    ).join('') + '<button class="chip" type="button" data-qty="custom" aria-pressed="' + !presets.includes(state.qty) + '">직접입력</button>';
    $('#qtyInput').value = state.qty;
    $('#qtyRange').value = clamp(state.qty, 10, 300);
    syncQtyUI();
  }

  function syncQtyUI(){
    const presets = [10,30,50,100,200];
    $$('#qtyChips .chip').forEach(b => {
      const v = b.dataset.qty;
      b.setAttribute('aria-pressed', v === 'custom' ? !presets.includes(state.qty) : Number(v) === state.qty);
    });
    if (document.activeElement !== $('#qtyInput')) $('#qtyInput').value = state.qty;
    $('#qtyRange').value = clamp(state.qty, 10, 300);

    const next = TIERS.filter(t => t.min > state.qty).sort((a,b) => a.min - b.min)[0];
    const hint = $('#qtyHint');
    if (next){
      const cur = calc();
      const alt = priceOf(state.item, state.color, next.min, state.pos, state.method);
      const gap = Math.max(0, cur.unit - alt.unit);
      hint.innerHTML = '<span class="save">' + next.min + '장 주문 시</span> 장당 ' + won(alt.unit) + ' · 총 ' + won(alt.total);
      if (gap > 0) hint.innerHTML += ' <span style="color:#9AA6BA">(장당 ' + won(gap) + ' 절약)</span>';
    } else {
      hint.innerHTML = '<span class="save">최대 할인 구간</span> 적용 중 · 500장 이상은 추가 협의';
    }
  }

  function posIcon(p){
    const dot = {
      chest:'<circle cx="9" cy="14" r="2.4" fill="currentColor"/>',
      back:'<rect x="6" y="12" width="9" height="7" rx="1.4" fill="currentColor" opacity=".9"/>',
      both:'<circle cx="9" cy="13" r="2.1" fill="currentColor"/><rect x="14" y="12" width="5" height="6" rx="1.2" fill="currentColor" opacity=".55"/>',
      sleeve:'<rect x="2.5" y="12" width="4" height="6" rx="1.4" fill="currentColor"/>'
    }[p];
    return '<svg viewBox="0 0 24 30" aria-hidden="true" style="color:#1F5AE0"><path d="M9 3 5 5 2 12l3 1.4V27h14V13.4L22 12 19 5l-4-2c-1 2-5 2-6 0z" fill="none" stroke="#9DB0CC" stroke-width="1.4" stroke-linejoin="round"/>' + dot + '</svg>';
  }
  function renderPositions(){
    $('#posRow').innerHTML = Object.keys(POSITIONS).map(k => {
      const p = POSITIONS[k];
      return '<button class="pos" type="button" data-pos="' + k + '" aria-pressed="' + (state.pos === k) + '">' +
        posIcon(k) + '<span><span class="t">' + p.name + '</span><span class="s">' + (p.add ? '+' + won(p.add) + '~' : '기본') + '</span></span></button>';
    }).join('');
  }
  function renderMethods(){
    $('#methodRow').innerHTML = Object.keys(METHODS).map(k => {
      const m = METHODS[k];
      return '<button class="mth" type="button" data-method="' + k + '" aria-pressed="' + (state.method === k) + '"><span class="t">' + m.name + '</span><span class="s">' + m.note + '</span></button>';
    }).join('');
  }

  /* ---------- 렌더: 패널 ---------- */
  function renderMockup(){
    $('#mockupStage').innerHTML = garmentSVG(state.item, state.color, state.view, { guide: state.guide });
    $('#mkItem').textContent = ITEMS[state.item].name;
    $('#mkSize').textContent = ITEMS[state.item].size;
    $('#mkPrint').textContent = ITEMS[state.item].cap ? '앞면 중앙' : POSITIONS[state.pos].name;
    $('#viewFront').setAttribute('aria-pressed', String(state.view === 'front'));
    $('#viewBack').setAttribute('aria-pressed', String(state.view === 'back'));
    $('#guideBtn').setAttribute('aria-pressed', String(state.guide));
  }

  function renderPrice(){
    const r = calc();
    $('#pBase').textContent = won(r.base);
    $('#pTierName').textContent = r.tier.label;
    $('#pDisc').textContent = r.tier.rate ? '-' + won(r.base * r.tier.rate) : '0원';
    $('#pPrint').textContent = '+' + won(r.print);
    $('#pPrintName').textContent = '(' + POSITIONS[state.pos].name + ' · ' + METHODS[state.method].name + ')';
    $('#pUnit').textContent = won(r.unit);
    $('#pTotal').textContent = won(r.total);
    $('#pVat').textContent = 'VAT 별도 · VAT 포함 ' + won(r.totalWithVat);
    $('#sbUnit').textContent = won(r.unit);
    $('#sbQty').textContent = state.qty + '장';
    $('#sbTotal').textContent = won(r.total);
    syncQtyUI();
    highlightTable();
  }

  function renderAll(){
    renderMockup();
    renderPrice();
    updateColorLabel();
  }

  /* ---------- 단가표 ---------- */
  function renderPriceTable(){
    const tiers = TIERS.slice().sort((a,b) => a.min - b.min);
    const head = '<tr><th>품목 / 사양</th>' + tiers.map(t => '<th>' + t.min + '장' + (t.rate ? '<br><span style="font-weight:600;color:#8A97AD">-' + Math.round(t.rate*100) + '%</span>' : '') + '</th>').join('') + '</tr>';
    const body = Object.keys(ITEMS).map(k => {
      const it = ITEMS[k];
      const cells = tiers.map(t => {
        const unit = Math.round((it.base * (1 - t.rate)) / 10) * 10;
        return '<td class="cell" data-item="' + k + '" data-qty="' + t.min + '">' + unit.toLocaleString('ko-KR') + '</td>';
      }).join('');
      return '<tr><td><span class="nm">' + it.name + '</span><span class="sp">' + it.spec + '</span></td>' + cells + '</tr>';
    }).join('');
    $('#priceTable').innerHTML = '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
    highlightTable();
  }
  function highlightTable(){
    const q = state.qty;
    const tier = tierFor(q);
    $$('#priceTable td.cell').forEach(td => {
      td.classList.toggle('on', td.dataset.item === state.item && Number(td.dataset.qty) === tier.min);
    });
  }

  function renderPrintTable(){
    const pos = ['chest','back','both','sleeve'];
    const cols = [10,50,100,200];
    let html = '<div class="grow head"><div>인쇄 위치</div>' + cols.map(c => '<div>' + c + '장~</div>').join('') + '</div>';
    pos.forEach(p => {
      html += '<div class="grow"><div class="k">' + POSITIONS[p].name + '</div>' +
        cols.map(c => {
          const v = Math.max(1200, POSITIONS[p].add - PRINT_DISC(c));
          return '<div>' + v.toLocaleString('ko-KR') + '원</div>';
        }).join('') + '</div>';
    });
    $('#printTbl').innerHTML = html;
  }

  /* ---------- 업종별 · 사례 ---------- */
  const INDUSTRIES = [
    {key:'factory', item:'vest', color:'safety', qty:100, pos:'both', method:'dye', company:'한빛정밀', slogan:'안전제일',
     title:'공장 · 건설현장', desc:'망사·작업조끼에 등판 크게. 형광 원단으로 현장 식별까지.', conf:'단체조끼 형광 100장 · 가슴+등판 나염'},
    {key:'cafe', item:'collar', color:'black', qty:30, pos:'chest', method:'emb', company:'카페 온도', slogan:'BARISTA',
     title:'식당 · 카페', desc:'카라티·앞치마에 자수 로고. 세탁에도 오래 가는 마감.', conf:'카라티 블랙 30장 · 왼가슴 자수'},
    {key:'school', item:'round', color:'white', qty:50, pos:'back', method:'dtf', company:'한빛학원', slogan:'2026 수학캠프',
     title:'학원 · 행사', desc:'행사 단체티는 등판 풀컬러가 한눈에 잘 보입니다.', conf:'라운드티 화이트 50장 · 등판 DTF'},
    {key:'team', item:'mtm', color:'royal', qty:45, pos:'both', method:'dye', company:'FC 한강', slogan:'2026 시즌',
     title:'동호회 · 팀', desc:'맨투맨·과잠에 등번호와 팀명. 개인별 이름도 가능.', conf:'맨투맨 로얄블루 45장 · 가슴+등판'}
  ];

  function renderIndustries(){
    $('#indGrid').innerHTML = INDUSTRIES.map(ind => {
      const r = priceOf(ind.item, ind.color, ind.qty, ind.pos, ind.method);
      return '<div class="ind">' +
        '<div class="ia">' + garmentSVG(ind.item, ind.color, 'front', {company:ind.company, slogan:ind.slogan, pos:ind.pos === 'both' ? 'chest' : ind.pos}) + '</div>' +
        '<div class="ib">' +
          '<h4>' + ind.title + '</h4>' +
          '<p class="idesc">' + ind.desc + '</p>' +
          '<div class="iconf"><b>' + ind.conf + '</b></div>' +
          '<div class="iprice"><span>장당 예상</span><b>' + won(r.unit) + '</b></div>' +
          '<button class="iapply" type="button" data-ind="' + ind.key + '">이 구성으로 견적 →</button>' +
        '</div></div>';
    }).join('');
  }

  const CASES = [
    {item:'round', color:'navy', company:'한빛정밀', slogan:'SAFETY FIRST', cap:'시화공단 · 정밀가공', qty:'120장'},
    {item:'collar', color:'black', company:'카페 온도', slogan:'BARISTA', cap:'카페 · 서비스', qty:'30장'},
    {item:'vest', color:'safety', company:'반월물류', slogan:'물류센터', cap:'물류 · 현장', qty:'80장'},
    {item:'mtm', color:'royal', company:'FC 한강', slogan:'2026 시즌', cap:'동호회 · 축구팀', qty:'45장'},
    {item:'cool', color:'sky', company:'그린클린', slogan:'CLEAN SERVICE', cap:'청소 · 용역', qty:'60장'},
    {item:'cap', color:'black', company:'베이커리 봄', slogan:'SINCE 2019', cap:'매장 · 굿즈', qty:'50장'}
  ];
  function renderCases(){
    $('#caseGrid').innerHTML = CASES.map(c =>
      '<figure class="case"><div class="ca">' + garmentSVG(c.item, c.color, 'front', {company:c.company, slogan:c.slogan, pos:'chest'}) + '</div>' +
      '<figcaption class="cb"><div><b>' + c.company + '</b><span>' + c.cap + '</span></div><span class="tag">' + ITEMS[c.item].name + ' ' + c.qty + '</span></figcaption></figure>'
    ).join('');
  }

  function renderAiSamples(){
    const s = [
      {logo:'wordmark', item:'round', color:'white', label:'1안 · 워드마크'},
      {logo:'emblem', item:'collar', color:'navy', label:'2안 · 엠블럼'},
      {logo:'shield', item:'vest', color:'black', label:'3안 · 안전 마크'}
    ];
    $('#aiSamples').innerHTML = s.map(x =>
      '<div class="ba-item"><div class="balbl"><b>' + x.label + '</b><span>AI</span></div>' +
      garmentSVG(x.item, x.color, 'front', {company:'한빛정밀', slogan:'', pos:'chest', logo:x.logo}) + '</div>'
    ).join('');
  }

  function renderGuideItems(){
    $('#guideGrid').innerHTML = Object.keys(ITEMS).map(k => {
      const it = ITEMS[k];
      return '<div class="guide"><span class="gi"><svg viewBox="0 0 400 470" aria-hidden="true">' + iconSVG(k) + '</svg></span>' +
        '<div><h4>' + it.name + '</h4><div class="spec">' + it.spec + '<br>사이즈 ' + it.size + ' · 최소 10장</div>' +
        '<div class="from">' + won(it.base) + '~</div></div></div>';
    }).join('');
  }

  function renderHero(){
    $('#heroMockup').innerHTML = garmentSVG('round','navy','back',{company:'한빛정밀', slogan:'안전제일', pos:'back'});
    $('#heroUnit').textContent = won(Math.round(priceOf('round','navy',30,'chest','dye').baseDisc / 10) * 10);
  }

  /* ---------- 인터랙션 ---------- */
  function setQty(q){
    q = Math.round(Number(q));
    if (!isFinite(q)) q = 10;
    state.qty = clamp(q, 10, 2000);
    renderPrice();
  }

  document.addEventListener('click', function (e) {
    const item = e.target.closest('[data-item]');
    if (item && !item.classList.contains('cell')){ state.item = item.dataset.item; renderItems(); renderAll(); return; }
    const cell = e.target.closest('td.cell');
    if (cell){
      state.item = cell.dataset.item; state.qty = Number(cell.dataset.qty);
      renderItems(); renderAll();
      document.getElementById('quote').scrollIntoView({behavior:'smooth', block:'start'});
      toast(ITEMS[state.item].name + ' ' + state.qty + '장 기준으로 견적을 맞췄습니다');
      return;
    }
    const ind = e.target.closest('[data-ind]');
    if (ind){
      applyIndustry(ind.dataset.ind);
      return;
    }
    const col = e.target.closest('[data-color]');
    if (col){ state.color = col.dataset.color; renderColors(); renderAll(); return; }
    const qb = e.target.closest('[data-qty]');
    if (qb){
      if (qb.dataset.qty === 'custom'){ $('#qtyInput').focus(); $('#qtyInput').select(); return; }
      setQty(qb.dataset.qty); return;
    }
    const pb = e.target.closest('[data-pos]');
    if (pb){
      state.pos = pb.dataset.pos;
      if (state.pos === 'back') state.view = 'back';
      if (state.pos === 'chest' || state.pos === 'sleeve') state.view = 'front';
      renderPositions(); renderAll(); return;
    }
    const mb = e.target.closest('[data-method]');
    if (mb){ state.method = mb.dataset.method; renderMethods(); renderPrice(); return; }
    const pre = e.target.closest('[data-preset]');
    if (pre){ applyIndustry(pre.dataset.preset); return; }
    const cl = e.target.closest('[data-close]');
    if (cl){ closeModal(cl.dataset.close); return; }
    if (e.target.classList && e.target.classList.contains('modal')) closeModal(e.target.id);
  });

  function applyIndustry(key){
    const ind = INDUSTRIES.filter(i => i.key === key)[0];
    if (!ind) return;
    state.item = ind.item; state.color = ind.color; state.qty = ind.qty;
    state.pos = ind.pos; state.method = ind.method;
    state.company = ind.company; state.slogan = ind.slogan;
    state.view = ind.pos === 'back' ? 'back' : 'front';
    $('#companyInput').value = state.company;
    $('#sloganInput').value = state.slogan;
    renderItems(); renderColors(); renderQty(); renderPositions(); renderMethods(); renderAll();
    document.getElementById('quote').scrollIntoView({behavior:'smooth', block:'start'});
    toast(ind.title + ' 추천 구성으로 견적을 맞췄습니다');
  }

  function bind(){
    $('#qtyInput').addEventListener('input', function (e) {
      const v = parseInt(e.target.value, 10);
      if (!isNaN(v)){ state.qty = clamp(v, 10, 2000); renderPrice(); }
    });
    $('#qtyInput').addEventListener('blur', function (e) { setQty(e.target.value); $('#qtyInput').value = state.qty; });
    $('#qtyRange').addEventListener('input', function (e) { setQty(e.target.value); });
    $('#companyInput').addEventListener('input', function (e) { state.company = e.target.value; renderMockup(); });
    $('#sloganInput').addEventListener('input', function (e) { state.slogan = e.target.value; renderMockup(); });
    $('#viewFront').addEventListener('click', function () { state.view = 'front'; renderMockup(); });
    $('#viewBack').addEventListener('click', function () { state.view = 'back'; renderMockup(); });
    $('#guideBtn').addEventListener('click', function () { state.guide = !state.guide; renderMockup(); });

    $('#menuBtn').addEventListener('click', function () {
      const m = $('#mobileMenu');
      const open = m.classList.toggle('open');
      $('#menuBtn').setAttribute('aria-expanded', String(open));
    });
    $$('#mobileMenu a').forEach(function (a) {
      a.addEventListener('click', function () {
        $('#mobileMenu').classList.remove('open');
        $('#menuBtn').setAttribute('aria-expanded', 'false');
      });
    });

    $('#toAiBtn').addEventListener('click', function () {
      $('#fCompany').value = state.company || '';
      if (!$('#fMsg').value.trim()){
        $('#fMsg').value = ITEMS[state.item].name + ' ' + state.qty + '장(' + COLORS[state.color].name + ')으로 ' +
          POSITIONS[state.pos].name + '에 넣을 시안 부탁드립니다.';
      }
      document.getElementById('ai').scrollIntoView({behavior:'smooth', block:'start'});
      setTimeout(function () { $('#fCompany').focus({preventScroll:true}); }, 420);
    });

    $('#docBtn').addEventListener('click', function () { openDoc(); });
    $('#doneDocBtn').addEventListener('click', function () { setTimeout(function () { openDoc(); }, 0); });
    $('#printBtn').addEventListener('click', function () { window.print(); });

    $('#fFile').addEventListener('change', function (e) {
      const f = e.target.files && e.target.files[0];
      const box = $('#fileName');
      if (f) box.innerHTML = '<b>' + esc(f.name) + '</b>' + Math.max(1, Math.round(f.size/1024)) + 'KB · 다른 파일 선택';
      else box.innerHTML = '<b>파일 선택</b>없으면 AI가 새로 잡아드려요';
    });

    $('#aiForm').addEventListener('submit', onSubmit);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape'){
        $$('.modal.open').forEach(function (m) { closeModal(m.id); });
        $('#mobileMenu').classList.remove('open');
      }
    });

    const sticky = $('#stickyBuy');
    const quoteSec = document.getElementById('quote');
    function onScroll(){
      if (window.innerWidth >= 1000){ sticky.classList.remove('show'); return; }
      if (!quoteSec) return;
      const r = quoteSec.getBoundingClientRect();
      sticky.classList.toggle('show', r.top < 0 && r.bottom > 120);
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    setTimeout(onScroll, 60);

    ['#quote','#pricing','#print-guide','#industries','#cases','#ai'].forEach(function (id) {
      const sec = document.querySelector(id);
      if (!sec) return;
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          $$('.nav-links a').forEach(function (a) {
            a.classList.toggle('on', a.getAttribute('href') === id);
          });
        });
      }, {rootMargin:'-45% 0px -50% 0px'}).observe(sec);
    });

    /* 납기 계산기 */
    const due = $('#dueDate');
    if (due){
      const t = new Date();
      t.setDate(t.getDate() + 21);
      due.value = t.toISOString().slice(0,10);
      due.min = new Date().toISOString().slice(0,10);
      due.addEventListener('change', updateDue);
      updateDue();
    }
  }

  /* ---------- 납기 역산 ---------- */
  function addBiz(date, n){
    const d = new Date(date.getTime());
    let step = n > 0 ? 1 : -1;
    let left = Math.abs(n);
    while (left > 0){
      d.setDate(d.getDate() + step);
      const w = d.getDay();
      if (w !== 0 && w !== 6) left--;
    }
    return d;
  }
  function fmtDate(d){
    const w = ['일','월','화','수','목','금','토'][d.getDay()];
    return (d.getMonth()+1) + '월 ' + d.getDate() + '일 (' + w + ')';
  }
  function updateDue(){
    const v = $('#dueDate').value;
    if (!v){ $('#dueRes').innerHTML = '<div class="due-row"><span>행사일을 선택해 주세요</span></div>'; return; }
    const E = new Date(v + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const order = addBiz(E, -13);
    const confirm = addBiz(E, -10);
    const ship = addBiz(E, -3);
    const late = order < today;
    const tight = !late && order.getTime() - today.getTime() < 3*86400000;

    $('#dueRes').innerHTML =
      '<div class="due-row key"><span>늦어도 주문·시안 요청</span><b>' + fmtDate(order) + '</b></div>' +
      '<div class="due-row"><span>시안 확정 마감</span><b>' + fmtDate(confirm) + '</b></div>' +
      '<div class="due-row"><span>출고 예정</span><b>' + fmtDate(ship) + '</b></div>' +
      '<div class="due-row' + (late ? ' warn' : '') + '"><span>' + (late ? '권장 주문일이 지났습니다' : (tight ? '일정이 빠듯합니다' : '여유 있게 진행 가능')) + '</span><b>' + (late || tight ? '급행 상담' : '정상 제작') + '</b></div>';

    $('#dueNote').innerHTML = late
      ? '오늘 기준으로는 <b style="color:#C4363C">급행 제작</b>만 가능합니다. 수량과 품목에 따라 조정되니 먼저 상담해 주세요.'
      : '영업일 기준(주말 제외) 계산입니다. 성수기(설·추석 전)에는 2~3일 더 여유를 두세요.';
  }

  /* ---------- 모달 ---------- */
  let lastFocus = null;
  function openModal(id){
    lastFocus = document.activeElement;
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    document.body.classList.add('lock');
    const btn = m.querySelector('button, [href]');
    if (btn) setTimeout(function () { btn.focus(); }, 10);
  }
  function closeModal(id){
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('open');
    if (!$('.modal.open')) document.body.classList.remove('lock');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (err) {} }
  }

  let toastTimer = null;
  function toast(msg){
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  /* ---------- 폼 ---------- */
  function mark(id, bad){
    const el = document.getElementById(id);
    if (el) el.classList.toggle('invalid', !!bad);
  }
  function onSubmit(e){
    e.preventDefault();
    const name = $('#fCompany').value.trim();
    const phone = $('#fPhone').value.trim();
    const biz = $('#fBusiness').value.trim();
    const msg = $('#fMsg').value.trim();
    const agree = $('#fAgree').checked;
    const phoneOk = /^[0-9+\-\s()]{9,20}$/.test(phone) && phone.replace(/\D/g,'').length >= 9;

    mark('fName', !name);
    mark('fContact', !phoneOk);
    $('#fAgreeErr').style.display = agree ? 'none' : 'block';

    if (!name || !phoneOk || !agree){
      const bad = document.querySelector('.field.invalid input, .field.invalid textarea');
      if (bad) bad.focus();
      else if (!agree) $('#fAgree').focus();
      toast('입력하지 않은 항목이 있습니다');
      return;
    }

    const r = calc();
    const d = new Date();
    const no = 'TM-' + d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0') + '-' + String(Math.floor(Math.random()*9000)+1000);
    $('#doneReceipt').innerHTML = [
      ['접수번호', no],
      ['업체명', esc(name)],
      ['연락처', esc(phone)],
      ['업종', biz ? esc(biz) : '—'],
      ['요청 구성', ITEMS[state.item].name + ' · ' + COLORS[state.color].name + ' · ' + state.qty + '장'],
      ['인쇄', POSITIONS[state.pos].name + ' · ' + METHODS[state.method].name],
      ['예상 금액', won(r.total) + ' <span style="color:#8A97AD;font-weight:600">(VAT 별도)</span>'],
      ['첨부', $('#fFile').files && $('#fFile').files[0] ? esc($('#fFile').files[0].name) : '없음']
    ].map(function (row) { return '<div class="rr"><span>' + row[0] + '</span><b>' + row[1] + '</b></div>'; }).join('');
    openModal('doneModal');
    if (msg) $('#fMsg').value = msg;
  }

  /* ---------- 견적서 ---------- */
  const BRAND_MARK = '<span class="brand-mark" style="width:30px;height:30px;border-radius:9px"><svg viewBox="0 0 48 48" width="18" height="18"><path d="M24 12c-4.4 0-7.6 1.6-9.8 3.2l-4.4 3.3 3.3 5.4 4.3-2.2V37h13.2V21.7l4.3 2.2 3.3-5.4-4.4-3.3C31.6 13.6 28.4 12 24 12z" fill="#fff"/></svg></span>';

  function docHeader(){
    const today = new Date();
    const ymd = today.getFullYear() + '.' + String(today.getMonth()+1).padStart(2,'0') + '.' + String(today.getDate()).padStart(2,'0');
    const valid = new Date(today.getTime() + 7*86400000);
    const vymd = valid.getFullYear() + '.' + String(valid.getMonth()+1).padStart(2,'0') + '.' + String(valid.getDate()).padStart(2,'0');
    return '<div class="doc-head"><div class="dh-b">' + BRAND_MARK +
      '<div><div style="font-size:15px;font-weight:800;letter-spacing:-.04em;color:#102A56">티메이트</div>' +
      '<div style="font-size:9px;letter-spacing:.14em;color:#8A97AD;font-weight:700">TEEMATE</div></div></div>' +
      '<div class="dh-m">견적일 ' + ymd + '<br>유효기간 ' + vymd + '<br>담당 김티메 · 0000-0000<br>사업자 000-00-00000</div></div>';
  }
  function docNote(){
    return '<div class="doc-note">' +
      '· 본 견적은 예상 금액이며, 원단 재고·사이즈 구성·배송지에 따라 최종 금액이 조정될 수 있습니다.<br>' +
      '· 납기 : 시안 확정 및 결제 후 평균 7영업일 (성수기 별도 안내) · 배송비 별도, 20만원 이상 무료<br>' +
      '· 결제 : 세금계산서 발행 / 카드 / 계좌이체 · 시안 수정 2회 무료 · 100장 이상 소형 1도 나염 무료<br>' +
      '· 본 문서는 데모 페이지에서 생성된 예시이며 법적 효력이 없습니다.' +
    '</div>';
  }
  function docSign(){
    return '<div class="doc-foot"><div>위 금액으로 견적합니다.<br>2026년 · 티메이트 드림</div>' +
      '<div class="doc-sign">(주)티메이트 대표이사<div class="stamp">직인</div></div></div>';
  }

  function singleDoc(){
    const r = calc();
    const target = ($('#fCompany').value || state.company || '고객사').trim();
    const unitDisc = r.base - r.baseDisc;
    return docHeader() +
      '<div class="doc-title">단체복 제작 견적서</div>' +
      '<div class="doc-to">수신 : ' + esc(target) + ' 귀중</div>' +
      '<table class="doc-t"><thead><tr><th style="width:30%">품목 / 사양</th><th>색상</th><th>수량</th><th style="width:22%">인쇄</th><th style="text-align:right">장당</th><th style="text-align:right">금액</th></tr></thead><tbody>' +
      '<tr><td>' + r.it.name + '<br><span style="color:#8A97AD;font-size:9.5px">' + r.it.spec + '</span></td>' +
      '<td>' + COLORS[state.color].name + '</td><td>' + state.qty + '장</td>' +
      '<td>' + POSITIONS[state.pos].name + '<br><span style="color:#8A97AD;font-size:9.5px">' + METHODS[state.method].name + '</span></td>' +
      '<td class="n">' + won(r.unit) + '</td><td class="n">' + won(r.total) + '</td></tr>' +
      '<tr><td colspan="5">수량 할인 (' + r.tier.label + ') · 무지 단가 ' + won(r.base) + ' → ' + won(r.baseDisc) + '</td><td class="n">-' + won(r.saveBase) + '</td></tr>' +
      '<tr><td colspan="5">인쇄비 (장당 ' + won(r.print) + ', 수량 할인 -' + won(r.printDisc) + ' 반영)</td><td class="n">포함</td></tr>' +
      '</tbody></table>' +
      '<div class="doc-tot"><span>공급가액</span><b>' + won(r.total) + '</b></div>' +
      '<div class="doc-tot"><span>부가세 (10%)</span><b>' + won(r.vat) + '</b></div>' +
      '<div class="doc-tot" style="background:#EEF4FF"><span>합계 금액 (VAT 포함)</span><b style="color:#1F5AE0;font-size:13.5px">' + won(r.totalWithVat) + '</b></div>' +
      docNote() + docSign();
  }

  function openDoc(){
    $('#docBody').innerHTML = singleDoc();
    openModal('printModal');
  }

  /* ---------- 시작 ---------- */
  function init(){
    renderItems();
    renderColors();
    renderQty();
    renderPositions();
    renderMethods();
    renderGuideItems();
    renderIndustries();
    renderCases();
    renderAiSamples();
    renderPriceTable();
    renderPrintTable();
    renderHero();
    renderAll();
    bind();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
