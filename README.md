<div align="center">
  <img src="extension/icons/128.png" width="80" alt="flowix logo">
  <h1>flowix</h1>
  <p>Меньше преград. Больше идей.</p>
  <p>Независимый экспериментальный помощник для Google Flow</p>
  <p><a href="https://github.com/skamcore/flowix/releases/latest">Скачать</a> · <a href="#установка">Установка</a> · <a href="docs/privacy.md">Приватность</a> · <a href="#english">English</a></p>
  <img src="https://github.com/skamcore/flowix/actions/workflows/check.yml/badge.svg" alt="Tests">
  <img src="https://img.shields.io/badge/Manifest-V3-7960d3" alt="Manifest V3">
  <img src="https://img.shields.io/badge/license-MIT-7960d3" alt="MIT license">
  <br><br>
  <img src="docs/assets/store-preview.jpg" width="900" alt="Светлый интерфейс flowix: переключатель, язык и диагностика. Демонстрационные данные.">
</div>

## Что внутри

- **Простой интерфейс.** Один переключатель, русский и английский, экспорт диагностики.
- **Спокойное оформление.** Лавандовая палитра, мягкие тени и четыре сменяющиеся фразы. Учитывается настройка уменьшения движения.
- **Локальная логика.** Никаких серверов разработчика, аналитики, рекламы или загружаемого кода.
- **Узкая область действия.** Обрабатывается один признак региональной доступности в конкретном ответе конфигурации Flow через Fetch или XHR. При неизвестном формате исходный ответ сохраняется.

## Установка

1. Скачайте **flowix-0.2.0-beta.1.zip** из [Releases](https://github.com/skamcore/flowix/releases/latest) и распакуйте.
2. Откройте `chrome://extensions` и включите **Режим разработчика**.
3. Нажмите **Загрузить распакованное расширение** и выберите распакованную папку с `manifest.json`.
4. Отключите другие расширения, изменяющие ответы Flow, и откройте [Google Flow](https://flow.google.com/).

При установке из исходников выбирайте папку `extension`. При обновлении замените файлы и нажмите ↻ на карточке flowix. Переключение расширения перезагружает открытые вкладки Flow — сохраните текущую работу.

## Что означает «Включено»

Это состояние расширения, а не подтверждение доступа к Google Flow. flowix локально изменяет один признак региональной доступности. Он **не меняет IP, страну аккаунта, подписку или решения серверов Google**. Доступ к сервису и генерации не гарантируется.

Версия **0.2.0-beta.1** экспериментальная. Формат конфигурации Flow может измениться. Диагностика `applied` означает обработку локального ответа; данные диагностики поступают со страницы и не являются проверкой безопасности. Авторизованная сквозная проверка этой сборки в Flow пока не выполнена.

## Приватность и разрешения

| Разрешение | Назначение |
| --- | --- |
| `storage` | Сохранение языка и состояния на устройстве |
| `scripting` | Включение и выключение локального обработчика |
| `https://flow.google.com/*` | Работа только на домене Flow |

Ответ конфигурации обрабатывается в памяти и не сохраняется или отправляется разработчику. Диагностический JSON содержит версию, состояние и счётчики — без URL, запросов пользователя, cookies и токенов. [Политика конфиденциальности](docs/privacy.md).

## Разработка

Node.js 20+, без внешних npm-зависимостей.

```sh
npm test
npm run check
npm run icons
```

19 автоматических тестов проверяют обработку ответов, UTF-8, Fetch/XHR, несовместимые схемы, параллельные команды и закрытие вкладки во время переключения. CI запускает тесты и проверку Manifest/JavaScript на каждом push и pull request. Интерфейс проверяется отдельно на демонстрационных данных.

Нашли ошибку? [Создайте issue](https://github.com/skamcore/flowix/issues/new/choose) с версией Chrome, шагами и диагностикой. Не прикладывайте токены, cookies, ссылки на подписки VPN или личные проекты.

## English

flowix is an independent Chrome extension that locally adjusts a regional-availability flag in a specific Google Flow configuration response. It has a Russian/English interface, local settings and a small diagnostic export. It does not change your IP, account country, subscription or Google's server-side decisions. Access is not guaranteed. Unknown response formats are left unchanged.

Download the extension ZIP from [Releases](https://github.com/skamcore/flowix/releases/latest), extract it, then use **Load unpacked** in `chrome://extensions` with Developer mode enabled. Select the folder containing `manifest.json`. Disable other response-modifying Flow extensions. Toggling reloads existing Flow tabs. This beta is tested with synthetic data; authenticated end-to-end access remains unverified.

## Проект

**by skam** · [MIT](LICENSE) · [История изменений](CHANGELOG.md)

Не связан с Google и не одобрен Google. В Chrome Web Store пока не опубликован.

Проблема раннего запроса была обнаружена при диагностике AI Flow Bypasser 1.0.0. flowix содержит самостоятельную реализацию, собственные тексты, оформление и иконки. Файлы исходного расширения не включены; MIT относится только к flowix.
