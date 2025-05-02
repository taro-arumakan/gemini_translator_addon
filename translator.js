function columnToIndex(column) {
  const index = column.trim().toUpperCase().charCodeAt(0) - 64;
  return index - 1;   // adjust to zero-based index
}

function translate_text(prompt_template, replacements) {
  let prompt = prompt_template;
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = `{{${key}}}`;
    prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
  }
  return callGemini(prompt);
}

function translateSheet(sheet, config) {
  Logger.log(`${new Date(new Date().getTime()).toISOString()} starting to process ${sheet}`);
  const data = sheet.getDataRange().getValues();

  for (let i = config.headerRowsToSkip; i < data.length; i++) {
    const row = data[i];
    const title = row[columnToIndex(config.titleCol)];
    console.log(`${title}`);
    const korean_description = config.descriptionSrc ? row[columnToIndex(config.descriptionSrc)] : false;
    const korean_size_text = config.sizeSrc ? row[columnToIndex(config.sizeSrc)] : false;
    const korean_material = config.materialSrc ? row[columnToIndex(config.materialSrc)]: false;

    if (title) {
      if (korean_description){
        console.log(`translating ${title}`);
        const translated_description = translate_text(config.descriptionPrompt, {
          product_title: title, korean_description: korean_description
        });
        console.log(translated_description);
        console.log(`row: ${i}`);
        console.log(`column: ${columnIndexes.japanese_description}`);
        // getRange row and column index is 1 base
        sheet.getRange(i + 1, columnToIndex(config.descriptionDest) + 1).setValue(translated_description);
      }
      if (korean_size_text) {
        const translated_size_text = translate_text(config.sizeTextPrompt, { size_text: korean_size_text });
        // getRange row and column index is 1 base
        sheet.getRange(i + 1, columnToIndex(config.sizeDest) + 1).setValue(translated_size_text);
      }
      if (korean_material) {
        const translated_material = translate_text(config.generalPrompt, { text: korean_material });
        // getRange row and column index is 1 base
        sheet.getRange(i + 1, columnToIndex(config.materialDest) + 1).setValue(translated_material);
      }
      SpreadsheetApp.flush();
    }
  }
}
