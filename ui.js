function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Translator')
    .addItem('Configure Translation', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Translation Configuration');
  SpreadsheetApp.getUi().showSidebar(html);
}

function saveAndStartTranslation(config) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  console.log(`starting to translate ${sheet}, ${config}`);
  translateSheet(sheet, config)
}