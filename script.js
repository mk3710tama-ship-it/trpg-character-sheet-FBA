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
  warrior: {str:0,con:0,pow:0,agi:0,dex:0,mp:0,hp:12,sm:0,mp:0 },
  archer: { str:0,con:0,pow:0,agi:2,dex:0,mp:0,hp:0,sm:0,mp:0 },
  wizard: { str:0,con:0,pow:0,agi:0,dex:0,mp:0,hp:0,sm:12,mp:0 },
  supporter: { str:0,con:0,pow:0,agi:0,dex:0,mp:0,hp:0,sm:0,mp:6 },
  puroducer: { str:0,con:0,pow:0,agi:0,dex:2,mp:0,hp:0,sm:0,mp:0 },
  none: { str:0,con:0,pow:0,agi:0,dex:0,mp:0,hp:0,sm:0,mp:0 }
};

const subJobs ={
  warrior: { str:0,con:0,pow:0,agi:0,dex:0,mp:0,hp:7,sm:0,mp:0 },
  archer: { str:0,con:0,pow:0,agi:1,dex:0,mp:0,hp:0,sm:0,mp:0 },
  wizard: { str:0,con:0,pow:0,agi:0,dex:0,mp:0,hp:0,sm:6,mp:0 },
  supporter: { str:0,con:0,pow:0,agi:0,dex:0,mp:0,hp:0,sm:0,mp:3 },
  puroducer: { str:0,con:0,pow:0,agi:0,dex:1,mp:0,hp:0,sm:0,mp:0 },
  none:{ str:0,con:0,pow:0,agi:0,dex:0,mp:0,hp:0,sm:0,mp:0 }
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
  const agi_daice = Number(document.getElementById("agi-daice").value);;
  const mp_daice = Number(document.getElementById("mp-daice").value);
  const sm_daice = Number(document.getElementById("sm-daice").value);

 
  const str_quote = Number(document.getElementById("str-quota").value);
  const dex_quota = Number(document.getElementById("dex-quota").value);
  const int_quota = Number(document.getElementById("int-quota").value);
  const con_quota = Number(document.getElementById("con-quota").value);
  const pow_quota = Number(document.getElementById("pow-quota").value);
  const agi_quota = Number(document.getElementById("agi-quota").value);
  const hp_quota = Number(document.getElementById("hp-quota").value);
  const mp_quota = Number(document.getElementById("mp-quota").value);
  const sm_quota = Number(document.getElementById("sm-quota").value);

  const specie = document.getElementById("specie").value;
  const meinJob = document.getElementById("mein-job").value;
  const subJob = document.getElementById("sub-job").value;


  const base = species[specie];
  const meinJobBonus = meinJobs[meinJob];
  const subJobBonus = subJobs[subJob];


  const str_true = str_daice+str_quote+base.str;
  const dex_true = dex_daice+dex_quota+base.dex+meinJobBonus.dex+subJobBonus.dex;
  const int_true = int_daice+int_quota+base.int;
  const con_true = con_daice+con_quota+base.con;
  const pow_true = pow_daice+pow_quota+base.pow;
  const agi_true = agi_daice+agi_quota+base.agi+meinJobBonus.agi+subJobBonus.agi;


  

  document.getElementById("str-race").textContent = base.str;
  document.getElementById("dex-race").textContent = base.dex+meinJobBonus.dex+subJobBonus.dex;
  document.getElementById("int-race").textContent = base.int;
  document.getElementById("con-race").textContent = base.con;
  document.getElementById("pow-race").textContent = base.pow;
  document.getElementById("agi-race").textContent = base.agi+meinJobBonus.agi+subJobBonus.agi;


  document.getElementById("str-true").textContent = str_true;
  document.getElementById("dex-true").textContent = dex_true;
  document.getElementById("int-true").textContent = int_true;
  document.getElementById("con-true").textContent = con_true;
  document.getElementById("pow-true").textContent = pow_true;
  document.getElementById("agi-true").textContent = agi_true;


  



  const hp_race = base.hp +(con_daice+base.con)*2+ meinJobBonus.hp + subJobBonus.hp;
  const mp_race =Math.floor((pow_daice+base.pow)/ 2) + meinJobBonus.mp + subJobBonus.mp;
  const sm_race = base.sm + meinJobBonus.sm + subJobBonus.sm;

  const hp_true = hp_race + hp_quota;
  const mp_true = mp_race + mp_daice + mp_quota; 
  const sm_true = sm_race + sm_daice + sm_quota;


  document.getElementById("hp-race").textContent = hp_race;
  document.getElementById("mp-race").textContent = mp_race;
  document.getElementById("sm-race").textContent = sm_race;

  document.getElementById("hp-true").textContent = hp_true;
  document.getElementById("mp-true").textContent = mp_true;
  document.getElementById("sm-true").textContent = sm_true;

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

  document.getElementById("edit-area").style.display =
    screen === "edit" ? "block" : "none";

  document.getElementById("view-area").style.display =
    screen === "view" ? "block" : "none";

  document.getElementById("list-area").style.display =
    screen === "list" ? "block" : "none";

  document.body.classList.toggle("view-mode", screen !== "edit");

  if (screen === "view") {
    updateView();
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

    const raceSelect = document.getElementById("specie");
  const raceName = raceSelect.options[raceSelect.selectedIndex].text;
  document.getElementById("view-race").textContent = raceName;

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

    str_quota: document.getElementById("str-quota").value,
    dex_quota: document.getElementById("dex-quota").value,
    int_quota: document.getElementById("int-quota").value,
    con_quota: document.getElementById("con-quota").value,
    pow_quota: document.getElementById("pow-quota").value,
    agi_quota: document.getElementById("agi-quota").value,
    hp_quota: document.getElementById("hp-quota").value,
    mp_quota: document.getElementById("mp-quota").value,
    sm_quota: document.getElementById("sm-quota").value,

    specie: document.getElementById("specie").value,
    meinJob: document.getElementById("mein-job").value,
    subJob: document.getElementById("sub-job").value,
    items: currentItems
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

  document.getElementById("str-quota").value = character.str_quota;
  document.getElementById("dex-quota").value = character.dex_quota;
  document.getElementById("int-quota").value = character.int_quota;
  document.getElementById("con-quota").value = character.con_quota;
  document.getElementById("pow-quota").value = character.pow_quota;
  document.getElementById("agi-quota").value = character.agi_quota;
  document.getElementById("hp-quota").value = character.hp_quota;
  document.getElementById("mp-quota").value = character.mp_quota;
  document.getElementById("sm-quota").value = character.sm_quota;

  document.getElementById("specie").value = character.specie;
  document.getElementById("mein-job").value = character.meinJob;
  document.getElementById("sub-job").value = character.subJob;

  currentItems = character.items || [];



  updateStatus();
  updateView();
  renderItemList();

}

// =====================
// 一覧描画
// =====================

function renderCharacterList() {
  const list = document.getElementById("character-list");
  list.innerHTML = "";

  const characters = getCharacters();

  characters.forEach(character => {
    const li = document.createElement("li");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = character.name || "無名キャラ";

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "読み込み";
    loadBtn.onclick = () => {
      loadCharacterById(character.id);
      showScreen("edit");
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
  deleteBtn.onclick = () => {
  currentCharacterId = character.id;
  deleteCharacter();
};

    li.appendChild(nameSpan);
    li.appendChild(loadBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
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