# Установка / Installation

[Русский README](../README.md) · [English README](../README.en.md) · [FAQ](troubleshooting.md)

## Русский

### Требования

Google Chrome 111+ (минимум в Manifest), доступ к странице Google Flow и возможность включить режим разработчика. На управляемом рабочем браузере установку может ограничивать администратор. Другие Chromium-браузеры отдельно не проверялись.

### Из релиза

1. Откройте [релиз 0.2.0-beta.1](https://github.com/skamcore/flowix/releases/tag/v0.2.0-beta.1).
2. В Assets скачайте **flowix-0.2.0-beta.1.zip**, а не Source code.
3. Распакуйте ZIP в постоянную папку. Не удаляйте её после установки.
4. Откройте `chrome://extensions` → **Режим разработчика** → **Загрузить распакованное расширение**.
5. Выберите папку, в которой сразу виден `manifest.json`.
6. Отключите другие расширения, изменяющие ответы Flow. Откройте Flow заново.

### Из исходников

Скачайте исходники или клонируйте репозиторий. При загрузке выберите вложенную папку **extension**, а не корень проекта. Node.js для установки расширения не нужен.

### Обновление

Сохраните работу во вкладках Flow. Замените содержимое установленной папки файлами новой сборки, нажмите ↻ на карточке flowix и обновите Flow. Распакованные расширения не обновляются автоматически из GitHub. Версия отображается на карточке расширения.

### Управление и удаление

Кнопка RU/EN меняет язык; переключатель включает обработчик и перезагружает вкладки Flow. Кнопка «Диагностика» сохраняет JSON на устройство. Для удаления нажмите «Удалить» в Chrome; ранее скачанные JSON остаются в папке загрузок.

## English

Requires Chrome 111+ and permission to load unpacked extensions. Managed browsers may prohibit installation. Other Chromium browsers have not been separately tested.

Download **flowix-0.2.0-beta.1.zip** from the [beta release](https://github.com/skamcore/flowix/releases/tag/v0.2.0-beta.1), extract to a permanent folder, then open `chrome://extensions` → **Developer mode** → **Load unpacked**. Select the folder directly containing `manifest.json`. For a source checkout, select the **extension** subfolder. Node.js is not required to install.

Disable other Flow response-modifying extensions. Save work before toggling flowix because existing Flow tabs reload. RU/EN changes language; Diagnostics downloads a local JSON report.

For updates, replace files in the same installation folder, click Reload on the extension card, then reload Flow. GitHub does not automatically update unpacked extensions. To uninstall, use Remove in Chrome; downloaded diagnostic files remain on your device.
