// =====================
// グローバル変数
// =====================
let currentCharacterId = null;

// =====================
// 基本計算
// =====================

const species = {
  human: { str:3,con:3,pow:3,agi:2,dex:3,int:5,hp:0,sm:8,mp:0 },
  Warbeast: { str:4,con:4,pow:1,agi:5,dex:1,int:3,hp:0,sm:14,mp:0 },
  Hobbit: { str:1,con:1,pow:2,agi:4,dex:5,int:7,hp:0,sm:4,mp:0 },
  Elf: { str:2,con:2,pow:4,agi:3,dex:3,int:4,hp:0,sm:11,mp:0 },
  Dwarf: { str:5,con:4,pow:2,agi:1,dex:4,int:6,hp:0,sm:6,mp:0 },
  lizard:{ str:4,con:4,pow:4,agi:2,dex:2,int:2,hp:0,sm:10,mp:0 },
  fisher:{ str:3,con:3,pow:1,agi:2,dex:3,int:4,hp:0,sm:9,mp:0 }
};

const meinJobs ={
  warrior: {str:0,con:0,pow:0,agi:0,dex:0,int:0,mp:0,hp:12,sm:0,mp:0 },
  archer: { str:0,con:0,pow:0,agi:2,dex:0,int:0,mp:0,hp:0,sm:0,mp:0 },
  wizard: { str:0,con:0,pow:0,agi:0,dex:0,int:0,mp:0,hp:0,sm:8,mp:0 },
  supporter: { str:0,con:0,pow:0,agi:0,dex:0,int:0,mp:0,hp:0,sm:0,mp:6 },
  puroducer: { str:0,con:0,pow:0,agi:0,dex:2,int:0,mp:0,hp:0,sm:0,mp:0 },
  none: { str:0,con:0,pow:0,agi:0,dex:0,int:0,mp:0,hp:0,sm:0,mp:0 }
};

const subJobs ={
  warrior: { str:0,con:0,pow:0,agi:0,dex:0,int:0,mp:0,hp:7,sm:0,mp:0 },
  archer: { str:0,con:0,pow:0,agi:1,dex:0,int:0,mp:0,hp:0,sm:0,mp:0 },
  wizard: { str:0,con:0,pow:0,agi:0,dex:0,int:0,mp:0,hp:0,sm:6,mp:0 },
  supporter: { str:0,con:0,pow:0,agi:0,dex:0,int:0,mp:0,hp:0,sm:0,mp:3 },
  puroducer: { str:0,con:0,pow:0,agi:0,dex:1,int:0,mp:0,hp:0,sm:0,mp:0 },
  none:{ str:0,con:0,pow:0,agi:0,dex:0,int:0,mp:0,hp:0,sm:0,mp:0 }
};


//以下スキル用の表示関数

function effectTemplate(template, valueFn) {
  return {
    type: "template",
    template,
    valueFn
  };
}
function defineSkill(
  name,
  tags,
  [minLevel, maxLevel],
  [acquire, perLevel],
  effect
) {
  return {
    id: name,
    name,
    tags,
    minLevel,
    maxLevel,
    cost: { acquire, perLevel },
    effect
  };
}
function getEffectText(skill, level) {
  if (!skill.effect) return "";

  // テンプレート型
  if (skill.effect.type === "template") {
    const result = skill.effect.valueFn(level);

    // valueFn が数値を返す場合
    if (typeof result === "number") {
      return skill.effect.template.replace("{value}", result);
    }

    // valueFn がオブジェクトを返す場合
    let text = skill.effect.template;
    for (const key in result) {
      text = text.replace(`{${key}}`, result[key]);
    }
    return text;
  }

  // 旧形式（互換）
  return skill.effect[level] ?? "";
}






const skillMaster = [
//捕食者の爪  
defineSkill(
  // 名前・id
  "捕食者の爪",
  // 検索タグ
  ["ワービースト", "攻撃"],
  // レベル範囲 [min, max]
  [1, 10],
  // コスト [取得, レベル]
  [2, 2],
  // 効果（テンプレート式）
  effectTemplate(
    "近接ダメージ +{value}{suffix}",
    level => ({
      value: level,
      suffix: level === 10 ? "(最大レベル)" : ""
    })
  )
),

//野生の勘
defineSkill(
  // 名前・id
  "野生の勘",
  // 検索タグ
  ["ワービースト", "防御"],
  // レベル範囲 [min, max]
  [1, 10],
  // コスト [取得, レベル]
  [1, 1],
  // 効果（テンプレート式）
  effectTemplate(
    "回避成功値 +{value}{suffix}",
    level => ({
      value: level,
      suffix: level === 10 ? "(最大レベル)" : ""
    })
  )
),

//獣圧
defineSkill(
  // 名前・id
  "獣圧",
  // 検索タグ
  ["ワービースト", "デバフ"],
  // レベル範囲 [min, max]
  [1, 5],
  // コスト [取得, レベル]
  [4, 4],
  // 効果（テンプレート式）
  effectTemplate(
    "１つ前のターン中に自身が近接ダメージを与えた敵が、自身を攻撃範囲に含む攻撃をするとき、その攻撃のファンブル値を与えたダメージ分だけ下げる。ただし低下する値は{value}以上にならない{suffix}",
    level => {
    const map = {
      1: 1,
      2: 3,
      3: 5,
      4: 7,
      5: 10
    };
    return {
      value: map[level],
      suffix: level === 5 ? "(最大レベル)" : ""
    };
  }
    
  )
),

];


// =====================
// ステータス計算
// =====================
function updateStatus() {

  const level = Number(document.getElementById("level").value);

  const str_daice = Number(document.getElementById("str-daice").value);
  const dex_daice = Number(document.getElementById("dex-daice").value);
  const int_daice = Number(document.getElementById("int-daice").value);
  const con_daice = Number(document.getElementById("con-daice").value);
  const pow_daice = Number(document.getElementById("pow-daice").value);
  const agi_daice = Number(document.getElementById("agi-daice").value);
  const mp_daice = Number(document.getElementById("mp-daice").value);
  const sm_daice = Number(document.getElementById("sm-daice").value);
  const luck_daice = Number(document.getElementById("luck-daice").value);
  const memory_daice = Number(document.getElementById("memory-daice").value);

 
  const str_quota = Number(document.getElementById("str-quota").value);
  const dex_quota = Number(document.getElementById("dex-quota").value);
  const int_quota = Number(document.getElementById("int-quota").value);
  const con_quota = Number(document.getElementById("con-quota").value);
  const pow_quota = Number(document.getElementById("pow-quota").value);
  const agi_quota = Number(document.getElementById("agi-quota").value);
  const hp_quota = Number(document.getElementById("hp-quota").value);
  const mp_quota = Number(document.getElementById("mp-quota").value);
  const sm_quota = Number(document.getElementById("sm-quota").value);
  const luck_quota = Number(document.getElementById("luck-quota").value);
  const memory_quota = Number(document.getElementById("memory-quota").value);

  const str_correction = Number(document.getElementById("str-correction").value);
  const con_correction = Number(document.getElementById("con-correction").value);
  const pow_correction = Number(document.getElementById("pow-correction").value);
  const agi_correction = Number(document.getElementById("agi-correction").value);
  const dex_correction = Number(document.getElementById("dex-correction").value);
  const int_correction = Number(document.getElementById("int-correction").value);
  const hp_correction = Number(document.getElementById("hp-correction").value);
  const mp_correction = Number(document.getElementById("mp-correction").value);
  const sm_correction = Number(document.getElementById("sm-correction").value);
  const luck_correction = Number(document.getElementById("luck-correction").value);
  const memory_correction = Number(document.getElementById("memory-correction").value);


  const specie = document.getElementById("specie").value;
  const meinJob = document.getElementById("mein-job").value;
  const subJob = document.getElementById("sub-job").value;


  const base = species[specie];
  const meinJobBonus = meinJobs[meinJob];
  const subJobBonus = subJobs[subJob];


  const str_true = str_daice+str_quota+base.str+str_correction;
  const dex_true = dex_daice+dex_quota+base.dex+dex_correction+meinJobBonus.dex+subJobBonus.dex;
  const int_true = int_daice+int_quota+base.int+int_correction;
  const con_true = con_daice+con_quota+base.con+con_correction;
  const pow_true = pow_daice+pow_quota+base.pow+pow_correction;
  const agi_true = agi_daice+agi_quota+base.agi+agi_correction+meinJobBonus.agi+subJobBonus.agi;

  

  document.getElementById("str-race").textContent = base.str+meinJobBonus.str+subJobBonus.str;
  document.getElementById("dex-race").textContent = base.dex+meinJobBonus.dex+subJobBonus.dex;
  document.getElementById("int-race").textContent = base.int+meinJobBonus.int+subJobBonus.int;
  document.getElementById("con-race").textContent = base.con+meinJobBonus.con+subJobBonus.con;
  document.getElementById("pow-race").textContent = base.pow+meinJobBonus.pow+subJobBonus.pow;
  document.getElementById("agi-race").textContent = base.agi+meinJobBonus.agi+subJobBonus.agi;


  document.getElementById("str-true").textContent = str_true;
  document.getElementById("dex-true").textContent = dex_true;
  document.getElementById("int-true").textContent = int_true;
  document.getElementById("con-true").textContent = con_true;
  document.getElementById("pow-true").textContent = pow_true;
  document.getElementById("agi-true").textContent = agi_true;


  



  const hp_race = base.hp +(con_daice+base.con)*2+ meinJobBonus.hp + subJobBonus.hp;
  const mp_race =Math.ceil((pow_daice+base.pow)/ 2) + meinJobBonus.mp + subJobBonus.mp;
  const sm_race = base.sm + meinJobBonus.sm + subJobBonus.sm;

  const hp_true = hp_race + hp_quota+ hp_correction;
  const mp_true = mp_race + mp_daice + mp_quota+ mp_correction; 
  const sm_true = sm_race + sm_daice + sm_quota+ sm_correction;
  const luck_true = luck_daice + luck_quota + luck_correction;
  const memory_true = memory_daice + memory_quota + memory_correction;


  document.getElementById("hp-race").textContent = hp_race;
  document.getElementById("mp-race").textContent = mp_race;
  document.getElementById("sm-race").textContent = sm_race;

  document.getElementById("hp-true").textContent = hp_true;
  document.getElementById("mp-true").textContent = mp_true;
  document.getElementById("sm-true").textContent = sm_true;
  document.getElementById("luck-true").textContent = luck_true;
  document.getElementById("memory-true").textContent = memory_true;


  const quotas = {
  str: str_quota,
  dex: dex_quota,
  int: int_quota,
  con: con_quota,
  pow: pow_quota,
  agi: agi_quota,
  hp: hp_quota,
  mp: mp_quota,
  sm: sm_quota,
  luck: luck_quota,
  memory: memory_quota
};
  setLevelBonus(level);
  useAllocationPoints(quotas);
  getRemainingPoints();
  recalcSkillPoints();
  updateSkillPointBar();

}

//====================
//割り振りポイント管理
//====================
let allocation = {
  base: 0,        // 初期ランダム
  levelBonus: 0,  // レベル由来
  used: 0         // 使用済み
};

function getTotalPoints() {
  return allocation.base + allocation.levelBonus;
}

function getRemainingPoints() {
  return getTotalPoints() - allocation.used;
}


function setLevelBonus(level) {
  allocation.levelBonus = level * 2; // 仮ルール
  updateAllocationBar();
}

function useAllocationPoints(quotas) {
  allocation.used = Object.values(quotas)
    .reduce((sum, v) => sum + v, 0);

  updateAllocationBar();
}


function updateAllocationBar() {
  const el = document.getElementById("point-summary");
  if (!el) return;

  const remaining = getRemainingPoints();
  const total = getTotalPoints();

  el.textContent =
    `割り振り：${remaining} / ${total} `
    + `(初期:${allocation.base} + Lv:${allocation.levelBonus} - 使用:${allocation.used})`;

  // 赤文字にする処理
  if (remaining < 0) {
    el.classList.add("negative");
  } else {
    el.classList.remove("negative");
  }
  
  recalcSkillPoints();
  updateSkillPointBar();
}

function confirmAllocationByChoice() {
  const message =
     "現在の初期割り振りポイント値は失われますが、よろしいですか？";

  if (!confirm(message)) return;

  initAllocationByChoice();
}


function initAllocationByChoice() {
  const selected = document.querySelector(
    'input[name="alloc-init"]:checked'
  )?.value;


  if (selected === "fixed") {
    allocation.base = 5;
  } else {
    allocation.base = rollDice(0, 10);
  }

  updateAllocationBar();
}

function lockAllocationInit() {
  document
    .querySelectorAll('input[name="alloc-init"]')
    .forEach(r => r.disabled = true);
}

//======================
//職業ポイント管理
//======================

let skillPoints = {
  base: 5,        // 初期値
  levelBonus: 0,  // 将来用
  used: 0         // 使用済み
};

function getTotalSkillPoints() {
  return skillPoints.base + skillPoints.levelBonus;
}

function getRemainingSkillPoints() {
  return getTotalSkillPoints() - skillPoints.used;
}

function recalcSkillPoints() {
  skillPoints.levelBonus =
    allocation.base + allocation.levelBonus - allocation.used;
}

function updateSkillPointBar() {
  const el = document.getElementById("skill-point-summary");
  if (!el) return;

  const remain = getRemainingSkillPoints();
  const total = getTotalSkillPoints();

  el.textContent =
    `スキルP：${remain} / ${total} `
    + `(使用可能:${total} - 使用:${skillPoints.used})`;

  if (remain < 0) {
    el.classList.add("negative");
  } else {
    el.classList.remove("negative");
  }
}


// =====================
// ダイスロール
// =====================
function rollDice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const diceRules = {
  "1d3": () => rollDice(1, 3),
  "1d4": () => rollDice(1, 4),
  "1d6": () => rollDice(1, 6),
  "3d8": () => rollDice(1, 8) + rollDice(1, 8) + rollDice(1, 8),
  "1d6-1": () => rollDice(1, 6) - 1,
  "1d6+2": () => rollDice(1, 6) + 2,
  "1d11-1": () => rollDice(1,11) - 1,
  "1d7-1": () => rollDice(1,7)-1,
  "1d2-1": () => rollDice(1,2)-1,
  "1d3-1": () => rollDice(1,3)-1,
  "0":()=>0
};

const raceDiceMap = {
  human: {
    luck: "1d11-1",
    mp: "1d7-1"
  },
  Warbeast: {
  luck: "0",
  mp:"1d2-1"
  },
  Hobbit: {
    luck: "0",
    mp:"1d3"
  },
  Elf: {
    luck: "0",
    mp:"1d6+2"
  },
  Dwarf: {
    luck: "0",
    mp:"1d3-1"
  },
  lizard:{
    luck: "0",
    mp:"1d4-1"
  },
  fisher:{
    luck: "0",
    mp:"0"
  }

};



function rollStat(inputId, rollFunc) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.value = rollFunc();
  updateStatus();
}
 
function roll_MP_Luck(statKey) {
  const race = document.getElementById("specie").value;
  const raceRule = raceDiceMap[race];
  if (!raceRule) return;

  const ruleKey = raceRule[statKey];
  const rollFunc = diceRules[ruleKey];
  if (!rollFunc) return;

  const input = document.getElementById(`${statKey}-daice`);
  input.value = rollFunc();

  updateStatus();
}

function confirmRollAllStats(type) {
  const message =
    "すべてのステータスを一括でロールします。\n"
    + "現在の値は失われますが、よろしいですか？";

  if (!confirm(message)) return;

  if (type === "basic") {
    basic_rollAllStats();
  } else if (type === "additional") {
    add_rollAllStats();
  }
}


function basic_rollAllStats() {
  rollStat("str-daice", diceRules["1d6"]);
  rollStat("dex-daice", diceRules["1d6-1"]);
  rollStat("int-daice", diceRules["1d6-1"]);
  rollStat("con-daice", diceRules["1d6"]);
  rollStat("pow-daice", diceRules["1d6"]);
  rollStat("agi-daice", diceRules["1d6"]);
}

function add_rollAllStats() {
  rollStat("sm-daice", diceRules["3d8"]);
  rollStat("memory-daice", diceRules["1d4"]);
  roll_MP_Luck("mp");
  roll_MP_Luck("luck");
}

//=====================
//スキル管理
//=====================


let characterSkills = [];
const nameInput = document.getElementById("skill-search");



function renderSkillSelect() {
  const select = document.getElementById("skill-select");
  select.innerHTML = '<option value="">スキルを選択</option>';

  skillMaster.forEach(skill => {
    const opt = document.createElement("option");
    opt.value = skill.id;
    opt.textContent = skill.name;
    select.appendChild(opt);
  });
}

function addSkill() {
  const id = document.getElementById("skill-select").value;
  if (!id) return;

  if (characterSkills.some(s => s.id === id)) {
    alert("すでに取得しています");
    return;
  }

  characterSkills.push({ id, level: 1 });
  recalcSkillPointUsed();
  renderSkillList();
}

function renderSkillList() {
  const ul = document.getElementById("skill-list");
  ul.innerHTML = "";

  characterSkills.forEach(skillData => {
    const master = skillMaster.find(s => s.id === skillData.id);
    if (!master) return;

    const li = document.createElement("li");
    li.className = "skill-table";

    /* 上段 */
    const header = document.createElement("div");
    header.className = "skill-row skill-header";

    const name = document.createElement("div");
    name.textContent = master.name;

    const down = document.createElement("button");
    down.textContent = "−";
    down.className = "skill-btn";
    down.onclick = () => changeSkillLevel(skillData.id, -1);

    const level = document.createElement("div");
    level.className = "skill-level";
    level.textContent = `Lv.${skillData.level}`;

    const up = document.createElement("button");
    up.textContent = "＋";
    up.className = "skill-btn";
    up.onclick = () => changeSkillLevel(skillData.id, 1);

    header.append(name, down, level, up);

    /* 下段 */
    const footer = document.createElement("div");
    footer.className = "skill-row skill-footer";

    const effect = document.createElement("div");
    effect.className = "skill-effect";
    effect.textContent = getSkillEffectText(skillData, master);

    const del = document.createElement("button");
    del.className = "skill-delete-btn";
    del.textContent = "削除";
    del.onclick = () => removeSkill(skillData.id);

    footer.append(effect, del);

    li.append(header, footer);
    ul.appendChild(li);
  });
}



function changeSkillLevel(skillId, diff) {
  const skill = characterSkills.find(s => s.id === skillId);
  const master = skillMaster.find(s => s.id === skillId);
  if (!skill || !master) return;

  const next = skill.level + diff;
  if (next < master.minLevel || next > master.maxLevel) return;

  skill.level = next;
  recalcSkillPointUsed();
  renderSkillList();
}

function calcSkillCost(skillData, master) {
  if (!master.cost) return 0;

  if (skillData.level <= 0) return 0;

  return (
    master.cost.acquire +
    (skillData.level - 1) * master.cost.perLevel
  );
}

function recalcSkillPointUsed() {
  skillPoints.used = characterSkills.reduce((sum, skill) => {
    const master = skillMaster.find(s => s.id === skill.id);
    if (!master) return sum;

    return sum + calcSkillCost(skill, master);
  }, 0);

  updateSkillPointBar();
}


function removeSkill(skillId) {
  const skill = characterSkills.find(s => s.id === skillId);
  const master = skillMaster.find(s => s.id === skillId);
  if (!skill || !master) return;

  const message =
    `スキル「${master.name}」を削除します。\n` 
  if (!confirm(message)) return;

  characterSkills = characterSkills.filter(s => s.id !== skillId);

  recalcSkillPointUsed();
  renderSkillList();
}

function getSkillEffectText(skillData, master) {
  return getEffectText(master, skillData.level);
}



let selectedSkillId = null;

const searchInput = document.getElementById("skill-search");
const searchList = document.getElementById("skill-search-list");

nameInput.addEventListener("input", renderSkillSearchList);


function renderSkillSearchList() {
  searchList.innerHTML = "";
  selectedSkillId = null;

  const nameKeyword = nameInput.value.trim().toLowerCase();
  const mode = getTagMode();

  skillMaster
    .filter(skill => {

      // 名前検索
      if (
        nameKeyword &&
        !skill.name.toLowerCase().includes(nameKeyword)
      ) {
        return false;
      }

      // タグ検索（option選択式）
      if (selectedTags.length > 0) {
        if (!skill.tags) return false;

        if (mode === "and") {
          return selectedTags.every(tag =>
            skill.tags.includes(tag)
          );
        } else {
          return selectedTags.some(tag =>
            skill.tags.includes(tag)
          );
        }
      }

      return true;
    })
    .forEach(renderSkillRow);
}



function addSkillFromSearch() {
  if (!selectedSkillId) {
    alert("スキルを選択してください");
    return;
  }

  if (characterSkills.some(s => s.id === selectedSkillId)) {
    alert("すでに取得しています");
    return;
  }

  characterSkills.push({ id: selectedSkillId, level: 1 });
  recalcSkillPointUsed();
  renderSkillList();

  // 入力リセット
  searchInput.value = "";
  searchList.innerHTML = "";
  selectedSkillId = null;
}
const tagSelect = document.getElementById("tag-select");



function initTagOptions() {
  const tags = new Set();

  skillMaster.forEach(skill => {
    (skill.tags || []).forEach(tag => tags.add(tag));
  });

  tags.forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagSelect.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTagOptions();
});
let selectedTags = [];

document.getElementById("add-tag-btn")
  .addEventListener("click", () => {

    const tag = tagSelect.value;
    if (!tag) return;
    if (selectedTags.includes(tag)) return;

    selectedTags.push(tag);
    tagSelect.value = "";

    renderSelectedTags();
    renderSkillSearchList();
  });

  function renderSelectedTags() {
  const area = document.getElementById("selected-tags");
  area.innerHTML = "";

  selectedTags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    span.className = "selected-tag";

    span.onclick = () => {
      selectedTags = selectedTags.filter(t => t !== tag);
      renderSelectedTags();
      renderSkillSearchList();
    };

    area.appendChild(span);
  });
}

function getTagMode() {
  return document.querySelector(
    'input[name="tag-mode"]:checked'
  ).value;
}

document.querySelectorAll('input[name="tag-mode"]')
  .forEach(radio => {
    radio.addEventListener("change", renderSkillSearchList);
  });

function renderSkillRow(skill) {
  const li = document.createElement("li");
  li.className = "skill-search-row";

  li.textContent = `${skill.name}（${skill.tags?.join(" / ") || ""}）`;

  li.onclick = () => {
    document
      .querySelectorAll(".skill-search-row")
      .forEach(el => el.classList.remove("selected"));

    li.classList.add("selected");
    selectedSkillId = skill.id;
  };

  searchList.appendChild(li);
}


// =====================
// アイテム管理
// =====================
let currentItems = [];


function renderItemList() {
  const tbody = document.getElementById("item-list");
  tbody.innerHTML = "";

  currentItems.forEach((item, index) => {
    const tr = document.createElement("tr");

    // アイテム名
    const nameTd = document.createElement("td");
    nameTd.textContent = item.name;
    tr.appendChild(nameTd);

    // 個数（編集可）
    const qtyTd = document.createElement("td");
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.value = item.quantity;
    qtyInput.min = 0;

    qtyInput.onchange = () => {
      item.quantity = Number(qtyInput.value) || 0;
    };

    qtyTd.appendChild(qtyInput);
    tr.appendChild(qtyTd);

    // 備考
    const noteTd = document.createElement("td");
    noteTd.textContent = item.note || "";
    tr.appendChild(noteTd);

    // 削除
    const delTd = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.onclick = () => {
      currentItems.splice(index, 1);
      renderItemList();
    };

    delTd.appendChild(delBtn);
    tr.appendChild(delTd);

    tbody.appendChild(tr);
  });
}


document.getElementById("add-item").addEventListener("click", () => {
  const nameEl = document.getElementById("item-name");
  const qtyEl = document.getElementById("item-qty");
  const noteEl = document.getElementById("item-note");

  const name = nameEl.value.trim();
  if (!name) return;

  currentItems.push({
    name: name,
    quantity: Number(qtyEl.value) || 1,
    note: noteEl.value
  });

  renderItemList();

  // 入力欄クリア（任意）
  nameEl.value = "";
  noteEl.value = "";
});







// =====================
// イベント：閲覧モード切替
// =====================
let currentScreen = "edit"; // edit / view / list
function showScreen(screen) {
  currentScreen = screen;
  toggleBottomBar(screen)

  document.getElementById("edit-area").style.display =
    screen === "edit" ? "block" : "none";

  document.getElementById("view-area").style.display =
    screen === "view" ? "block" : "none";

  document.getElementById("list-area").style.display =
    screen === "list" ? "block" : "none";

  document.body.classList.toggle("view-mode", screen !== "edit");

  if (screen === "view") {
    updateView();
    renderViewItemList();
  }

  if (screen === "list") {
    renderCharacterList();
  }
}
document.getElementById("btn-edit").addEventListener("click", () => {
  showScreen("edit");
});

document.getElementById("btn-view").addEventListener("click", () => {
  showScreen("view");
});

document.getElementById("btn-list").addEventListener("click", () => {
  showScreen("list");
});


// =====================
// 閲覧エリア更新
// =====================

function updateView() {
  document.getElementById("view-char-name").textContent =
    document.getElementById("charName").value || "（未命名）";

  document.getElementById("str-view").textContent =
    document.getElementById("str-true").textContent;
  document.getElementById("con-view").textContent =
    document.getElementById("con-true").textContent;
  document.getElementById("pow-view").textContent =
    document.getElementById("pow-true").textContent;
  document.getElementById("agi-view").textContent =
    document.getElementById("agi-true").textContent;
  document.getElementById("dex-view").textContent =
    document.getElementById("dex-true").textContent;
  document.getElementById("int-view").textContent =
    document.getElementById("int-true").textContent;


  document.getElementById("hp-view").textContent =
    document.getElementById("hp-true").textContent;
  document.getElementById("mp-view").textContent =
    document.getElementById("mp-true").textContent;
  document.getElementById("sm-view").textContent =
    document.getElementById("sm-true").textContent;
  document.getElementById("luck-view").textContent =
    document.getElementById("luck-true").textContent;
  document.getElementById("memory-view").textContent =
    document.getElementById("memory-true").textContent;

    const raceSelect = document.getElementById("specie");
  const raceName = raceSelect.options[raceSelect.selectedIndex].text;
  document.getElementById("view-race").textContent = raceName;

}

function renderViewItemList() {
  const tbody = document.getElementById("view-item-list");
  tbody.innerHTML = "";

  currentItems.forEach(item => {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = item.name;
    tr.appendChild(nameTd);

    const qtyTd = document.createElement("td");
    qtyTd.textContent = item.quantity;
    tr.appendChild(qtyTd);

    const noteTd = document.createElement("td");
    noteTd.textContent = item.note || "";
    tr.appendChild(noteTd);

    tbody.appendChild(tr);
  });
}






// =====================
// localStorage 操作
// =====================
function getCharacters() {
  return JSON.parse(localStorage.getItem("trpgCharacters")) || [];
}

function saveCharacters(list) {
  localStorage.setItem("trpgCharacters", JSON.stringify(list));
}

// =====================
// キャラ保存
// =====================

function saveCharacter() {
  const name = document.getElementById("charName").value.trim();
  if (!name) {
    alert("キャラ名を入力してください");
    return;
  }

  const characters = getCharacters();

  // 既存キャラID（編集中のキャラ）
  let characterId = currentCharacterId || crypto.randomUUID();

  const character = {
    id: characterId,
    name,

    str_daice: document.getElementById("str-daice").value,
    dex_daice: document.getElementById("dex-daice").value,
    int_daice: document.getElementById("int-daice").value,
    con_daice: document.getElementById("con-daice").value,
    pow_daice: document.getElementById("pow-daice").value,
    agi_daice: document.getElementById("agi-daice").value,
    mp_daice: document.getElementById("mp-daice").value,
    sm_daice: document.getElementById("sm-daice").value,
    luck_daice: document.getElementById("luck-daice").value,
    memory_daice: document.getElementById("memory-daice").value,

    str_quota: document.getElementById("str-quota").value,
    dex_quota: document.getElementById("dex-quota").value,
    int_quota: document.getElementById("int-quota").value,
    con_quota: document.getElementById("con-quota").value,
    pow_quota: document.getElementById("pow-quota").value,
    agi_quota: document.getElementById("agi-quota").value,
    hp_quota: document.getElementById("hp-quota").value,
    mp_quota: document.getElementById("mp-quota").value,
    sm_quota: document.getElementById("sm-quota").value,
    luck_quota: document.getElementById("luck-quota").value,
    memory_quota: document.getElementById("memory-quota").value,

    str_correction: document.getElementById("str-correction").value,
    dex_correction: document.getElementById("dex-correction").value,
    int_correction: document.getElementById("int-correction").value,
    con_correction: document.getElementById("con-correction").value,
    pow_correction: document.getElementById("pow-correction").value,
    agi_correction: document.getElementById("agi-correction").value,
    hp_correction: document.getElementById("hp-correction").value,
    mp_correction: document.getElementById("mp-correction").value,
    sm_correction: document.getElementById("sm-correction").value,
    luck_correction: document.getElementById("luck-correction").value,
    memory_correction: document.getElementById("memory-correction").value,

    specie: document.getElementById("specie").value,
    meinJob: document.getElementById("mein-job").value,
    subJob: document.getElementById("sub-job").value,
    items: currentItems,
    allocation: allocation,
    skillPoints: skillPoints,
    skills: characterSkills


  };

  // IDで上書き判定
  const index = characters.findIndex(c => c.id === characterId);

  if (index >= 0) {
    characters[index] = character;
  } else {
    characters.push(character);
  }

  saveCharacters(characters);

  currentCharacterId = characterId;
  renderCharacterList();
  alert("保存しました");
}



// =====================
// キャラ読み込み
// =====================

function loadCharacterById(id) {
  const characters = getCharacters();
  const character = characters.find(c => c.id === id);
  if (!character) return;

  currentCharacterId = id;

  document.getElementById("charName").value = character.name;
  document.getElementById("str-daice").value = character.str_daice;
  document.getElementById("dex-daice").value = character.dex_daice;
  document.getElementById("int-daice").value = character.int_daice;
  document.getElementById("con-daice").value = character.con_daice;
  document.getElementById("pow-daice").value = character.pow_daice;
  document.getElementById("agi-daice").value = character.agi_daice;
  document.getElementById("mp-daice").value = character.mp_daice;
  document.getElementById("sm-daice").value = character.sm_daice;
  document.getElementById("luck-daice").value = character.luck_daice;
  document.getElementById("memory-daice").value = character.memory_daice;

  document.getElementById("str-quota").value = character.str_quota;
  document.getElementById("dex-quota").value = character.dex_quota;
  document.getElementById("int-quota").value = character.int_quota;
  document.getElementById("con-quota").value = character.con_quota;
  document.getElementById("pow-quota").value = character.pow_quota;
  document.getElementById("agi-quota").value = character.agi_quota;
  document.getElementById("hp-quota").value = character.hp_quota;
  document.getElementById("mp-quota").value = character.mp_quota;
  document.getElementById("sm-quota").value = character.sm_quota;
  document.getElementById("luck-quota").value = character.luck_quota;
  document.getElementById("memory-quota").value = character.memory_quota;

  document.getElementById("str-correction").value = character.str_correction;
  document.getElementById("dex-correction").value = character.dex_correction;
  document.getElementById("int-correction").value = character.int_correction;
  document.getElementById("con-correction").value = character.con_correction;
  document.getElementById("pow-correction").value = character.pow_correction;
  document.getElementById("agi-correction").value = character.agi_correction;
  document.getElementById("hp-correction").value = character.hp_correction;
  document.getElementById("mp-correction").value = character.mp_correction;
  document.getElementById("sm-correction").value = character.sm_correction;
  document.getElementById("luck-correction").value = character.luck_correction;
  document.getElementById("memory-correction").value = character.memory_correction;

  document.getElementById("specie").value = character.specie;
  document.getElementById("mein-job").value = character.meinJob;
  document.getElementById("sub-job").value = character.subJob;

  currentItems = (character.items || []).map(item => ({ ...item }));
  
  allocation = character.allocation || {
  base: 0,
  levelBonus: 0,
  used: 0
};

skillPoints = character.skillPoints || {
  base: 5,
  levelBonus: 0,
  used: 0
};

characterSkills = character.skills || [];
recalcSkillPointUsed();
renderSkillList();











  updateStatus();
  updateView();
  renderItemList();
  updateAllocationBar();
  updateSkillPointBar();

if (currentScreen === "view") {
  renderViewItemList();
}
  

}

// =====================
// 一覧描画
// =====================

function renderCharacterList() {
  const list = document.getElementById("character-list");
  list.innerHTML = "";

  const characters = getCharacters();

  characters.forEach(character => {
    const row = document.createElement("div");
    row.className = "character-row";

    const name = document.createElement("div");
    name.textContent = character.name || "無名キャラ";

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.onclick = () => {
      loadCharacterById(character.id);
      showScreen("edit");
    };

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "閲覧";
    viewBtn.onclick = () => {
      loadCharacterById(character.id);
      showScreen("view");
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.className = "delete";
    deleteBtn.onclick = () => {
      if (!confirm("このキャラクターを削除しますか？")) return;
      deleteCharacter(character.id);
      renderCharacterList();
    };

    row.append(name, editBtn, viewBtn, deleteBtn);
    list.appendChild(row);
  });
}




// =====================
// リネーム
// =====================

function renameCharacter() {
  if (!currentCharacterId) {
    alert("リネームするキャラを選択してください");
    return;
  }

  const newName = document.getElementById("charName").value.trim();
  if (!newName) {
    alert("新しいキャラ名を入力してください");
    return;
  }

  const characters = getCharacters();

  if (characters.some(c => c.name === newName && c.id !== currentCharacterId)) {
    alert("同名のキャラが存在します");
    return;
  }

  const character = characters.find(c => c.id === currentCharacterId);
  if (!character) return;

  character.name = newName;

  saveCharacters(characters);
  renderCharacterList();

  alert("キャラ名を変更しました");
}


// =====================
// 削除
// =====================

function deleteCharacter() {
  if (!currentCharacterId) {
    alert("削除するキャラを選択してください");
    return;
  }

  const characters = getCharacters();
  const target = characters.find(c => c.id === currentCharacterId);

  if (!target) {
    alert("削除対象のキャラが見つかりません");
    return;
  }

  const message =
    `以下のキャラクターを削除します。\n\n` +
    `キャラ名：${target.name}\n` +
    `種族：${target.specie}\n` +
    `メイン職：${target.meinJob}\n\n` +
    `この操作は取り消せません。本当に削除しますか？`;

  if (!confirm(message)) return;

  const filtered = characters.filter(c => c.id !== currentCharacterId);
  saveCharacters(filtered);

  currentCharacterId = null;

  document.getElementById("charName").value = "";
  renderCharacterList();

  alert("キャラクターを削除しました");
}

///==================
//下部のバー表示
//==================

function toggleBottomBar(screen) {
  const bar = document.getElementById("bottom-bar");
  bar.classList.toggle("hidden", screen === "list");
}




///====================
//id導入時の仕様変更
//====================
function migrateCharacters() {
  const characters = getCharacters();
  let changed = false;

  characters.forEach(c => {
    if (!c.id) {
      c.id = crypto.randomUUID();
      changed = true;
    }
  });

  if (changed) {
    saveCharacters(characters);
  }
}
migrateCharacters();




// =====================
// イベント登録 & 初期化
// =====================
document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", updateStatus);
});

document.getElementById("saveBtn").addEventListener("click", saveCharacter);
document.getElementById("renameBtn").addEventListener("click", renameCharacter);
document.getElementById("deleteBtn").addEventListener("click", deleteCharacter);

updateStatus();
updateView();
renderCharacterList();
updateAllocationBar();
updateSkillPointBar();
renderSkillSelect();
renderSkillList();
renderSkillSearchList();