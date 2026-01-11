// =====================
// グローバル変数
// =====================
let currentCharacterName = null;

// =====================
// 基本計算
// =====================

const species = {
  human: { str:3,con:3,pow:3,agi:2,dex:3,int:5,hp:0,sm:8 },
  Warbeast: { str:2,con:1,pow:1,agi:1,dex:3,int:1,hp:6,sm:1 },
  Hobbit: { str:1,con:2,pow:2,agi:2,dex:2,int:5,hp:8,sm:1 }
};

const meinJobs ={
  warriror: { agi:0,dex:0,mp:0,hp:12,sm:0 },
  archer: { agi:2,dex:0,mp:0,hp:0,sm:0 },
  wizard: { agi:0,dex:0,mp:0,hp:0,sm:8 },
  supporter: { agi:0,dex:0,mp:6,hp:0,sm:0 },
  puroducer: { agi:0,dex:2,mp:0,hp:0,sm:0 }
};

const subJobs ={
  warriror: { agi:0,dex:0,mp:0,hp:7,sm:0 },
  archer: { agi:1,dex:0,mp:0,hp:0,sm:0 },
  wizard: { agi:0,dex:0,mp:0,hp:0,sm:6 },
  supporter: { agi:0,dex:0,mp:3,hp:0,sm:0 },
  puroducer: { agi:0,dex:1,mp:0,hp:0,sm:0 }
};

// =====================
// ステータス計算
// =====================
function updateStatus() {
  const str_daice = Number(document.getElementById("str-daice").value);
  const dex_daice = Number(document.getElementById("dex-daice").value);
  const int_daice = Number(document.getElementById("int-daice").value);
  const con_daice = Number(document.getElementById("con-daice").value);
  const pow_daice = Number(document.getElementById("pow-daice").value);
  const agi_daice = Number(document.getElementById("agi-daice").value);

 
  const str_quote = Number(document.getElementById("str-quota").value);
  const dex_quota = Number(document.getElementById("dex-quota").value);
  const int_quota = Number(document.getElementById("int-quota").value);
  const con_quota = Number(document.getElementById("con-quota").value);
  const pow_quota = Number(document.getElementById("pow-quota").value);
  const agi_quota = Number(document.getElementById("agi-quota").value);

  const specie = document.getElementById("specie").value;
  const meinJob = document.getElementById("mein-job").value;
  const subJob = document.getElementById("sub-job").value;


  const base = species[specie];

  const meinJobBonus = meinJobs[meinJob];
  const subJobBonus = subJobs[subJob];

    

  const str_true = str_daice+str_quote+base.str;
  const dex_true = dex_daice+dex_quota+base.dex;
  const int_true = int_daice+int_quota+base.int;
  const con_true = con_daice+con_quota+base.con;
  const pow_true = pow_daice+pow_quota+base.pow;
  const agi_true = agi_daice+agi_quota+base.agi;
  

  document.getElementById("str-race").textContent = base.str;
  document.getElementById("dex-race").textContent = base.dex;
  document.getElementById("int-race").textContent = base.int;
  document.getElementById("con-race").textContent = base.con;
  document.getElementById("pow-race").textContent = base.pow;
  document.getElementById("agi-race").textContent = base.agi;

  document.getElementById("str-true").textContent = str_true;
  document.getElementById("dex-true").textContent = dex_true;
  document.getElementById("int-true").textContent = int_true;
  document.getElementById("con-true").textContent = con_true;
  document.getElementById("pow-true").textContent = pow_true;
  document.getElementById("agi-true").textContent = agi_true;


  const hp = base.hp +(con_daice+base.con)*2;

  document.getElementById("hp").textContent = hp;
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

  const character = {
    name,
    str_daice: document.getElementById("str-daice").value,
    dex_daice: document.getElementById("dex-daice").value,
    int_daice: document.getElementById("int-daice").value,
    con_daice: document.getElementById("con-daice").value,
    pow_daice: document.getElementById("pow-daice").value,
    agi_daice: document.getElementById("agi-daice").value,

    str_quota: document.getElementById("str-quota").value,
    dex_quota: document.getElementById("dex-quota").value,
    int_quota: document.getElementById("int-quota").value,
    con_quota: document.getElementById("con-quota").value,
    pow_quota: document.getElementById("pow-quota").value,
    agi_quota: document.getElementById("agi-quota").value,

    specie: document.getElementById("specie").value,
    meinJob: document.getElementById("mein-job").value,
    subJob: document.getElementById("sub-job").value
  };

  const index = characters.findIndex(c => c.name === name);
  if (index >= 0) {
    characters[index] = character;
  } else {
    characters.push(character);
  }

  saveCharacters(characters);
  currentCharacterName = name;
  renderCharacterList();
  alert("保存しました");
}

// =====================
// キャラ読み込み
// =====================
function loadCharacter(name) {
  const characters = getCharacters();
  const character = characters.find(c => c.name === name);
  if (!character) return;

  currentCharacterName = name;

  document.getElementById("charName").value = character.name;
  document.getElementById("str-daice").value = character.str_daice;
  document.getElementById("dex-daice").value = character.dex_daice;
  document.getElementById("int-daice").value = character.int_daice;
  document.getElementById("con-daice").value = character.con_daice;
  document.getElementById("pow-daice").value = character.pow_daice;
  document.getElementById("agi-daice").value = character.agi_daice;

  document.getElementById("str-quota").value = character.str_quota;
  document.getElementById("dex-quota").value = character.dex_quota;
  document.getElementById("int-quota").value = character.int_quota;
  document.getElementById("con-quota").value = character.con_quota;
  document.getElementById("pow-quota").value = character.pow_quota;
  document.getElementById("agi-quota").value = character.agi_quota;

  document.getElementById("specie").value = character.specie;
  document.getElementById("mein-job").value = character.meinJob;
  document.getElementById("sub-job").value = character.subJob;

  updateStatus();
}

// =====================
// 一覧描画
// =====================
function renderCharacterList() {
  const list = document.getElementById("characterList");
  list.innerHTML = "";

  const characters = getCharacters();
  characters.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c.name;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => loadCharacter(c.name));
    list.appendChild(li);
  });
}

// =====================
// リネーム
// =====================
function renameCharacter() {
  if (!currentCharacterName) {
    alert("リネームするキャラを選択してください");
    return;
  }

  const newName = document.getElementById("charName").value.trim();
  if (!newName) {
    alert("新しいキャラ名を入力してください");
    return;
  }

  const characters = getCharacters();
  if (characters.some(c => c.name === newName)) {
    alert("同名のキャラが存在します");
    return;
  }

  const character = characters.find(c => c.name === currentCharacterName);
  character.name = newName;

  saveCharacters(characters);
  currentCharacterName = newName;
  renderCharacterList();
}

// =====================
// 削除
// =====================
function deleteCharacter() {
  if (!currentCharacterName) {
    alert("削除するキャラを選択してください");
    return;
  }

  if (!confirm(`「${currentCharacterName}」を削除しますか？`)) return;

  let characters = getCharacters();
  characters = characters.filter(c => c.name !== currentCharacterName);

  saveCharacters(characters);
  currentCharacterName = null;

  document.getElementById("charName").value = "";
  renderCharacterList();
}

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
renderCharacterList();