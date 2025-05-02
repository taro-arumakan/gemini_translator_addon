function columnToIndex(column) {
  let index = 0;
  for (let i = 0; i < column.length; i++) {
    index = index * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return index - 1;
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
    const korean_description = config.descriptionSrc ? row[columnToIndex(config.descriptionSrc)] : false;
    const korean_size_text = config.sizeSrc ? row[columnToIndex(config.sizeSrc)] : false;
    const korean_material = config.materialSrc ? row[columnToIndex(config.materialSrc)]: false;

    if (title) {
      console.log(`translating ${title}`);
      if (korean_description){
        console.log(`translating description:\n${korean_description}`);
        const translated_description = translate_text(config.descriptionPrompt, {
          product_title: title, korean_description: korean_description
        });
        console.log(`translated:\n${translated_description}`);
        console.log(`Updating row ${i + 1}, column ${columnToIndex(config.descriptionDest)} + 1}`);
        sheet.getRange(`${config.descriptionDest}${i + 1}`).setValue(translated_description);

      }
      if (korean_size_text) {
        console.log(`translating size text\n${korean_size_text}`);
        const translated_size_text = translate_text(config.sizeTextPrompt, { size_text: korean_size_text });
        console.log(`translated:\n${translated_size_text}`);
        sheet.getRange(`${config.sizeDest}${i + 1}`).setValue(translated_size_text);
      }
      if (korean_material) {
        console.log(`translating material\n${korean_material}`);
        const translated_material = translate_text(config.generalPrompt, { text: korean_material });
        console.log(`translated:\n${translated_material}`);
        sheet.getRange(`${config.materialDest}${i + 1}`).setValue(translated_material);
      }
      SpreadsheetApp.flush();
    }
  }
}
