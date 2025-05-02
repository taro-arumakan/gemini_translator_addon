function get_description_prompt(product_title, korean_description) {
  return `翻訳して自然な文章にまとめ、${product_title}という商品のページに載せる紹介文にして下さい:
  ${korean_description}

  作文にあたっては、箇条書きではなく自然な構文で上記の特徴を盛り込み、余分なヘッダなどは追加しないようにしてください。
  `;
}

function translate_description(product_title, korean_description) {
  const prompt = get_description_prompt(product_title, korean_description);
  const output = callGemini(prompt);
  return output;
}

function get_size_text_prompt(size_text) {
  return `商品のサイズ表および注意書きを日本語に翻訳して下さい。
  ${size_text}

  余分なコメントやヘッダ、アスタリスクなどは追加しないようにしてください。
  原文のスペースを保持して韓国語のみ日本語と置き換えて下さい。
  `;
}

function translate_size_text(size_text) {
  const prompt = get_size_text_prompt(size_text);
  return callGemini(prompt);
}

function get_general_prompt(text) {
  return `翻訳して自然な文章にまとめて下さい
  ${text}

  余分なコメントやヘッダなどは追加しないようにしてください。
  `;
}

function translate_general(text) {
  const prompt = get_general_prompt(text);
  return callGemini(prompt);
}


// Column indexes, 0 base
const columnIndexes = {
  title: 5,                 // Column B
  korean_description: 8,    // Column I
  japanese_description: 9,  // Column J

  korean_material: 12,      // Column M
  japanese_material: 13,    // Column N

  korean_size_text: 14,     // Column O
  japanese_size_text: 15,   // Column P
};

function processSheet(sourceSheetName, headerRowsToSkip, sourceColumn, destinationColumn) {
  Logger.log(`${new Date(new Date().getTime()).toISOString()} starting to process ${sourceSheetName}`);
  const sourceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sourceSheetName);
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert('Source sheet not found.');
    return;
  }

  const data = sourceSheet.getDataRange().getValues();

  for (let i = headerRowsToSkip; i < data.length; i++) {
    const row = data[i];
    const title = row[columnIndexes.title];
    console.log(`${title}`);
    const korean_description = row[columnIndexes.korean_description];
    const korean_size_text = row[columnIndexes.korean_size_text];
    const korean_material = row[columnIndexes.korean_material];

    if (title) {
      if (korean_description){
        console.log(`translating ${title}`);
        const translated_description = translate_description(title, korean_description);
        console.log(translated_description);
        console.log(`row: ${i}`);
        console.log(`column: ${columnIndexes.japanese_description}`);
        // getRange row and column index is 1 base
        sourceSheet.getRange(i + 1, columnIndexes.japanese_description + 1).setValue(translated_description);
      }
      if (korean_size_text) {
        const translated_size_text = translate_size_text(korean_size_text);
        // getRange row and column index is 1 base
        sourceSheet.getRange(i + 1, columnIndexes.japanese_size_text + 1).setValue(translated_size_text);
      }
      if (korean_material) {
        const translated_material = translate_general(korean_material);
        // getRange row and column index is 1 base
        sourceSheet.getRange(i + 1, columnIndexes.japanese_material + 1).setValue(translated_material);
      }
    }
  }
}

function testProcessSheet(){
  processSheet('Products Master', 128);
}