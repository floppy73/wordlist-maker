// JavaScript Document
(function() {
  'use strict';
  const leftTextInput = document.getElementById('left-text');
  const rightTextInput = document.getElementById('right-text');
  const allWords = document.getElementById('allWordsTable');
  const add = document.getElementById('add');
  const wordGroup = document.getElementById('wordsGroup');
  const addScbtn = document.getElementById('add_shortcut');
  const scbtnText = document.getElementById('scbtn_text');
  const scbtnInput = document.getElementById('scbtn_input');
  const csvExport = document.getElementById('csv_export');
  let keyStatus = {};
  let isCommandKey;
  const downloadlink = document.getElementById('download');

 /**
  * ショートカットキー
  * 押されたときの処理
  */
  document.onkeydown = (event) => {
    // 左矢印で左、右矢印で右のテキストボックスにフォーカス
    if (event.keyCode === 39) {
      rightTextInput.focus();
    } else if (event.keyCode === 37) {
      leftTextInput.focus();
    };

    // ⌘と同時押し系
    keyStatus[event.keyCode] = true;

    // コマンドキーが押されているか判定
    if (keyStatus[91] === true || keyStatus[93] === true) {
      isCommandKey = true;
    };


    // ⌘+Enter同時押しで追加
    if (isCommandKey === true && keyStatus[13] === true) {
      add.onclick();
    };
  };

  // 離されたときの処理
  document.onkeyup = (event) => {
    keyStatus[event.keyCode] = false;

    if (keyStatus[91] === false || keyStatus[93] === false) {
      isCommandKey = false;
    }
  };

  //追加時の処理
  add.onclick = () => {
    //文を取得
    const leftText = leftTextInput.value;
    const rightText = rightTextInput.value;
    const leftTextEncoded = leftText.replace(/\n/g, '<br>');
    const rightTextEncoded = rightText.replace(/\n/g, '<br>');

    //どちらかのテキストエリアが空なら処理を終了
    if (leftText.length === 0 || rightText.length === 0) {
      return;
    }

    // tableに追加
    const setText = '<tr class ="word"><td class="left">' + leftTextEncoded + '</td><td class="right">' + rightTextEncoded + '</td><td><button class="delete" onclick="deleteTr(this)"><img src="./img/iconmonstr-x-mark-13-240.png" class="trash"></button></td></tr>';
    allWords.insertAdjacentHTML('beforeend', setText);

    //テキストエリアを空にする
    leftTextInput.value = "";
    rightTextInput.value = "";

    // 左のテキストエリアにフォーカス、表を一番下までスクロール
    leftTextInput.focus();
    const scrollh = document.getElementById('allWordsArea').scrollHeight;
    document.getElementById('allWordsArea').scrollTop = scrollh;
  };

  //ショートカットボタン
  wordGroup.addEventListener('click', function(event) {
    //文を取得
    const leftText = leftTextInput.value;

    //ボタンの文字を取得
    const buttonValue = event.target.innerHTML;

    //ボタン以外の場所のクリックを無効化
    if (buttonValue.length > 20) {
      return;
    };

    //Inputの値書き換え
    leftTextInput.value = leftText + buttonValue;

    // カーソルを左のテキストエリアへ
    leftTextInput.focus();
  }, false);
  

  // ショートカットの追加
  // テキストエリアを用意
  addScbtn.onclick = () => {
    scbtnText.style.display = "none";
    scbtnInput.style.display = "inline";
    scbtnInput.focus();
  };


  // ボタン内のテキストエリアにフォーカス中にエンターが押されたとき追加
  scbtnInput.onkeydown = (event) => {
    if(event.keyCode === 13) {
      const setScText = scbtnInput.value;
      const setText = '<button type="button" class="wordOfGroup">' + setScText + '</button>';
      wordGroup.insertAdjacentHTML('beforeend', setText);
      scbtnInput.value = "";
    }
  };

  // フォーカスが外れた時もとに戻す
  scbtnInput.onblur = () => {
    scbtnText.style.display = "inline";
    scbtnInput.style.display = "none";
  }

  // csvダウンロード
  downloadlink.onclick = () => {
    if (allWords.childElementCount === 0) {
      return;
    }
    const csvArray = getTable();
    const csvFile = (convertCsv(csvArray));
    downloadfunction(csvFile);
  };

  // csvコピー
  csvExport.onclick = () => {
    const csvArray = getTable;
    const copyResult = copyfunction(csvArray);
    console.log(copyResult ? 'コピー成功' : 'コピー失敗');
  }


  //tableの内容を配列に入れる関数
  function getTable(){
    // tableの一、二列目の内容を取得
    const array = [];
    const allWords = document.getElementById('allWordsTable');
    const rows = allWords.rows;
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < 2; j++) {
        const tr = rows[i].cells[j].innerHTML;
        // 改行部分をエンコードして配列に入れる
        const encodedTr = tr.replace('<br>', '\n');
        array.push(encodedTr);
      }
    };
    return array;
  }

  /**
   * 配列をcsvに変換する関数
   * @param {array} arrayForCsv tableの内容の配列
   * @return {string} csv形式の文字列
   */
  function convertCsv(array) {
    let csvString = '';
    // 配列の項目の前後にダブルクオーテーションを挿入
    for (let i = 0; i < array.length; i++) {
      const content = array[i];
      let changedContent = '"' + content +  '",';
      // ２つごとに改行
      if (i % 2 === 1) {
        changedContent += '\n';
      }
      // 内容を変数に代入
      csvString += changedContent;
    }
    return csvString;
  };



  /**
   * 渡されたデータをクリップボードにコピーする関数
   * @param {String} csvFile 元データ
   * @return {Boolean} 成功したか 
   */
  function copyfunction(string) {
    // テキストエリアを作成しvalueに引数をセット
    const copyarea = document.createElement('textarea');
    copyarea.value = string;

    // テキストエリアを追加、選択、コピー
    document.body.appendChild(copyarea);
    copyarea.select();
    let result = document.execCommand('copy');

     // テキストエリアを削除
    document.body.removeChild(copyarea);

    // 結果を返す
    return result;
  }


  // ダウンロード用関数
  function downloadfunction(string) {
    const blob = new Blob([string], {"type":"text/csv"});
    downloadlink.href = window.URL.createObjectURL(blob);
  }
})();

// tableの行削除処理
function deleteTr(object) {
  objTr = object.parentNode.parentNode;
  objTr.parentNode.deleteRow(objTr.sectionRowIndex);
};
