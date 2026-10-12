# FAQ и диагностика / Troubleshooting

[Русский README](../README.md) · [English README](../README.en.md) · [Установка / Install](installation.md)

## Частые вопросы

**Flow всё ещё пишет «недоступно в вашей стране».** Состояние «Включено» относится к расширению. Локальное изменение ответа не меняет серверные ограничения Google. Сохраните работу, обновите расширение и вкладку, отключите конфликтующие расширения и скачайте диагностику. Не публикуйте cookies или токены.

**Это VPN?** Нет. IP, геолокация, страна аккаунта и подписка не меняются.

**Почему нет кнопки установки из магазина?** Расширение пока не опубликовано в Chrome Web Store. Доступна ручная установка экспериментальной сборки.

**Chrome не находит manifest.json.** Выберите папку с самим файлом: корень распакованного release ZIP или `extension/` внутри исходников.

**Иконка или интерфейс старые.** Замените файлы именно в папке установленного расширения, нажмите ↻ в `chrome://extensions` и заново откройте popup.

**Почему вкладки обновляются?** Это нужно, чтобы применить включение или отключение обработчика на странице. Сохраните работу перед переключением.

**Где данные диагностики?** Только в скачанном файле. Нажатие кнопки не отправляет его разработчику.

## Diagnostic states / Коды состояния

| Code | Русский | English |
| --- | --- | --- |
| `no_tab` | Не найдена вкладка Flow | No Flow tab found |
| `not_loaded` | Обработчик или отчёт ещё не доступен; обновите вкладку | Script/report unavailable; reload the tab |
| `waiting` | Ожидание целевого ответа | Waiting for the target response |
| `applied` | Локальный признак изменён; доступ не подтверждён | Local flag changed; access is not confirmed |
| `already_allowed` | Признак уже равен true | Flag was already true |
| `schema_changed` | Формат не подошёл; ответ оставлен исходным | Unexpected schema; response unchanged |
| `invalid_frame` | Некорректная длина фрейма | Invalid frame length |
| `response_not_found` | Целевая запись отсутствует или неоднозначна | Missing or ambiguous target record |
| `unsupported_response` | Ответ слишком большой или не текстовый | Response too large or not text |
| `read_error` | Ошибка чтения Fetch-ответа | Fetch response could not be read |

`matched` and `modified` count observed and modified responses in the page; `registered` reports script registration; `blockedPage` reports the refusal-page URL. These values come from the page and are not a security attestation.

## English FAQ

**Still seeing an unsupported-country message?** Enabled reports extension state, not Google eligibility. Save work, reload the extension and Flow tab, disable conflicting response modifiers, then export diagnostics. Server-side access is not guaranteed.

**Is this a VPN or subscription unlock?** No. It does not change IP, geolocation, account country, subscription or credits.

**Missing manifest?** Select the folder directly containing `manifest.json`: the release ZIP root or the source repository's `extension/` folder.

**Old icon or popup?** Replace files in the actual installed folder and click Reload in `chrome://extensions`, then reopen the popup.

**Are reports uploaded?** No. Diagnostics only downloads a local file. The user chooses whether to share it.

## Сообщить об ошибке / Report a bug

[Open an issue](https://github.com/skamcore/flowix/issues/new/choose) with your Chrome/flowix versions, reproduction steps and expected behavior. Optional diagnostic JSON helps distinguish a changed response format from a missing script. Do not include credentials or private project content.
