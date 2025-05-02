function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Translator')
    .addItem('Configure Translation', 'showSidebar')
    .addToUi();
}

function saveAndStartTranslation(config) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headersToSkip = config.headersToSkip.split(',').map(Number);

  translateSheet(sheet, config)
}