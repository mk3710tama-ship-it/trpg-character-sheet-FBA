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
  fighter: { hp: 10, mp: 0 },
  wizard: { hp: 6, mp: 10 },
  rogue: { hp: 8, mp: 4 }
};

// =====================
// ステータス計算
// =====================
function updateStatus() {
  const str = Number(document.getElementById("str").value);
  const dex = Number(document.getElementById("dex").value);
  const intv = Number(document.getElementById("int").value);
  const con = Number(document.getElementById("con").value);

  const level = Number(document.getElementById("level").value);
  const job = document.getElementById("job").value;

  const strMod = calcMod(str);
  const dexMod = calcMod(dex);
  const intMod = calcMod(intv);
  const conMod = calcMod(con);

  document.getElementById("strMod").textContent = strMod;
  document.getElementById("dexMod").textContent = dexMod;
  document.getElementById("intMod").textContent = intMod;
  document.getElementById("conMod").textContent = conMod;

  const base = jobs[job];
  const hp = base.hp + conMod * level;
  const mp = base.mp + intMod * level;

  document.getElementById("hp").textContent = hp;
  document.getElementById("mp").textContent = mp;
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
    str: document.getElementById("str").value,
    dex: document.getElementById("dex").value,
    int: document.getElementById("int").value,
    con: document.getElementById("con").value,
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
  document.getElementById("str").value = character.str;
  document.getElementById("dex").value = character.dex;
  document.getElementById("int").value = character.int;
  document.getElementById("con").value = character.con;
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