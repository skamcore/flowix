# flowix — политика конфиденциальности / Privacy policy

Обновлено: 12 октября 2026. Версия: 0.2.0-beta.1.

## Русский

flowix — независимое расширение для локального изменения одного признака региональной доступности в конфигурационном ответе Google Flow. Доступ к сервису не гарантируется.

Расширение работает только на `https://flow.google.com/`. Для этой функции оно обрабатывает в памяти браузера один предназначенный странице ответ конфигурации. Ответ может содержать сведения аккаунта; расширение не извлекает их для отдельного использования, не сохраняет и не передаёт его содержимое. Изменяется только определённое логическое поле. Остальные запросы и ответы не обрабатываются этой функцией.

flowix не собирает cookies, токены, пароли, историю браузера, точную геолокацию, prompts, изображения и видео для хранения или передачи. Серверов разработчика и аналитики нет. Никакой удалённый код или конфигурация не загружаются. Обычные запросы самой страницы Flow к Google происходят независимо от расширения.

В `chrome.storage.local` хранятся только язык интерфейса и состояние включения. Удаление расширения удаляет эти настройки стандартным механизмом Chrome.

Диагностический JSON создаётся только по нажатию пользователя и скачивается на его устройство. Он содержит название и версию расширения, ревизию конфигурации, состояние включения и регистрации скрипта, тип транспорта XHR/Fetch, код состояния, счётчики и логический признак страницы отказа. В нём нет адреса страницы, имени/ID аккаунта, IP, содержимого ответов, cookies или токенов. Сохранённый файл пользователь удаляет самостоятельно.

Диагностика отображает данные страницы и не является доказательством безопасности или разрешения доступа Google.

Данные не продаются и не передаются разработчику. Использование информации, полученной через Google APIs, соответствует ограничениям Chrome Web Store User Data Policy, включая Limited Use.

Вопросы по конфиденциальности: через Issues в репозитории flowix. Не публикуйте там секреты или личные данные.

## English

flowix is an independent extension that locally adjusts one regional-availability flag in a Google Flow configuration response. Service access is not guaranteed.

It runs only on `https://flow.google.com/`. The designated configuration response is processed transiently in page memory. It may contain account-related information; flowix does not extract that information for separate use, persist the response, or transmit it. Only the specified boolean field is adjusted. Unrelated requests and responses are not processed by this feature.

The extension does not collect cookies, tokens, passwords, browsing history, precise location, prompts, images or video for storage or transmission. There are no developer servers, analytics, remote code, or remote configuration. Google's page continues making its own ordinary network requests independently of flowix.

Only the interface language and enabled setting are stored in `chrome.storage.local`. Uninstalling removes these settings through Chrome's normal mechanism.

Diagnostics are downloaded to the user's device only on request. They contain product/version, configuration revision, enabled/registered state, XHR/Fetch transport, fixed status codes, counters, and a boolean refusal-page indicator. They exclude URLs, account names/IDs, IP addresses, response bodies, cookies and tokens. The user manages any downloaded file.

Status is read from the page and is not a security attestation or proof of Google service access. No data is sold or transmitted to the developer. Use of information received from Google APIs adheres to the Chrome Web Store User Data Policy, including its Limited Use requirements.

Privacy questions: use the repository's Issues without including personal data or secrets.
