# Architecture / Архитектура

[README](../README.md) · [English](../README.en.md) · [Contributing](../CONTRIBUTING.md)

## Components

| File | Responsibility |
| --- | --- |
| `extension/background.js` | Persist settings, register MAIN-world scripts, serialize control commands, reload Flow tabs, gather diagnostic summaries |
| `extension/core.js` | Pure URL matcher and response transformer; no network APIs |
| `extension/page.js` | Wrap eligible Fetch/XHR responses in the page; publish a bounded diagnostic summary |
| `extension/report.js` | Read and validate the page summary from an isolated content script |
| `extension/popup/` | RU/EN controls, local diagnostic download, lightweight rotating phrases |
| `scripts/icons.mjs` | Generate the original monogram at four PNG sizes without dependencies |

## Data flow

The service worker registers bundled scripts at document start when enabled. The page wrapper matches POST requests to Flow's designated configuration RPC. The transformer accepts exactly one matching record, validates the field type and framing, and updates a false/null availability field to true. Incompatible payloads remain unchanged. Unrelated responses are not modified.

The popup requests a summary from the worker, which asks an isolated content script for whitelisted diagnostic values. The page can spoof those values: they are debugging information, never an authorization or security signal. Settings contain only language and enable state. Downloaded reports omit response contents and identifiers.

## Validation

Run `npm test` and `npm run check` from the repository root. Tests use synthetic payloads and mocked Chrome APIs; they do not prove authenticated Google Flow access. UI changes should also be checked in both languages, enabled/disabled states and reduced-motion mode.

## По-русски

Service worker управляет настройками и регистрацией обработчика. `core.js` проверяет адрес запроса и структуру ответа, `page.js` применяет обработку Fetch/XHR, `report.js` передаёт только проверенные поля диагностики. Интерфейс хранит язык и состояние локально. Неожиданные ответы остаются неизменными; диагностика не подтверждает доступ со стороны Google.
