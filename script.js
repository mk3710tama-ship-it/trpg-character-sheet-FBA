// =====================
// グローバル変数
// =====================
let currentCharacterName = null;

// =====================
// 基本計算
// =====================
function calcMod(value) {
  return Math.floor((value - 10) / 2);
}

const jobs = {
  human: { str:3,con:3,pow:3,agi:2,dex:3,ida:5,hp:0,sm:8 },
  Warbeast: { str:2,con:1,pow:1,agi:1,dex:3,ida:1,hp:6,sm:1 },
  Hobbit: { str:1,con:2,pow:2,agi:2,dex:2,ida:5,hp:8,sm:1 }
};

// =====================
// ステータス計算
// =====================
function updateStatus() {
  const str_daice = Number(document.getElementById("str-daice").value);
  const dex_daice = Number(document.getElementById("dex-daice").value);
  const int_daice = Number(document.getElementById("int-daice").value);
  const con_daice = Number(document.getElementById("con-daice").value);
 
  const str_quote = Number(document.getElementById("str-quota").value);
  const dex_quota = Number(document.getElementById("dex-quota").value);
  const int_quota = Number(document.getElementById("int-quota").value);
  const con_quota = Number(document.getElementById("con-quota").value);

  const level = Number(document.getElementById("level").value);
  const job = document.getElementById("job").value;

  const base = jobs[job];

    

  const str_true = str_daice+str_quote;
  const dex_true = dex_daice+dex_quota;
  const int_true = int_daice+int_quota;
  const con_true = con_daice+con_quota;

  document.getElementById("str-true").textContent = str_true;
  document.getElementById("dex-true").textContent = dex_true;
  document.getElementById("int-true").textContent = int_true;
  document.getElementById("con-true").textContent = con_true;

  
  const hp = base.hp + con_true * level;

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
    str_quota: document.getElementById("str-quota").value,
    dex_quota: document.getElementById("dex-quota").value,
    int_quota: document.getElementById("int-quota").value,
    con_quota: document.getElementById("con-quota").value,
    job: document.getElementById("job").value,
    level: document.getElementById("level").value
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
  document.getElementById("str-quota").value = character.str_quota;
  document.getElementById("dex-quota").value = character.dex_quota;
  document.getElementById("int-quota").value = character.int_quota;
  document.getElementById("con-quota").value = character.con_quota;
  document.getElementById("job").value = character.job;
  document.getElementById("level").value = character.level;

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