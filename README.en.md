<div align="center">
  <img src="extension/icons/128.png" width="80" alt="flowix lavender logo">
  <h1>flowix — Google Flow Chrome extension</h1>
  <p>Fewer barriers. More ideas.</p>
  <p>Local regional-availability response handling · RU / EN · Manifest V3</p>
  <p><a href="https://github.com/skamcore/flowix/releases/tag/v0.2.0-beta.1">Download beta</a> · <a href="README.md">Русский</a> · <a href="docs/privacy.md">Privacy</a></p>
  <img src="https://github.com/skamcore/flowix/actions/workflows/check.yml/badge.svg" alt="Validation">
  <br><br>
  <img src="docs/assets/store-preview.jpg" width="900" alt="flowix popup: lavender design, language button, enable switch and diagnostics. Demonstration data.">
</div>

**English** · [Русский](README.md)

flowix is an independent, experimental Chrome extension for Google Flow. It locally adjusts a regional-availability flag in a specific configuration response, supports Fetch and XMLHttpRequest, and offers a Russian/English popup with downloadable diagnostics.

## Features

- One enable switch, a language button and a diagnostic download.
- Local settings and bundled code; no developer servers, analytics or remote configuration.
- A narrow response matcher; unknown formats are returned unchanged.
- Lightweight phrase transitions with reduced-motion support and no background phrase timer while the popup is hidden.
- Only `storage`, `scripting` and access to `https://flow.google.com/*`.

## Install

1. Download **flowix-0.2.0-beta.1.zip** from the [beta release](https://github.com/skamcore/flowix/releases/tag/v0.2.0-beta.1). Select the extension asset, not GitHub's source-code archive.
2. Extract it to a permanent folder.
3. Open `chrome://extensions`, enable **Developer mode**, select **Load unpacked**, then choose the folder containing `manifest.json`.
4. Disable other extensions that modify Flow responses. Open [Google Flow](https://flow.google.com/).

For a source checkout, select `extension/`. To update, replace files in the same folder and click Reload on the extension card. Save work before toggling: existing Flow tabs are reloaded.

[Installation, updates and removal](docs/installation.md) · [Troubleshooting and FAQ](docs/troubleshooting.md)

## Limitations

**Enabled means the extension is enabled, not that Google has granted access.** flowix does not change your IP, account country, subscription, credits or server-side eligibility. Access and generation are not guaranteed. The configuration format may change.

Version **0.2.0-beta.1** is experimental. Automated tests use synthetic responses and browser API mocks; authenticated end-to-end access for this build has not been verified. Chrome Web Store publication is pending. flowix is not affiliated with or endorsed by Google.

## Privacy

Only language and enable state are stored locally. The designated response is processed transiently in page memory and is not retained or sent to the developer. Diagnostic exports omit URLs, IP addresses, account identifiers, cookies, tokens and response bodies. See the [bilingual privacy policy](docs/privacy.md).

## Development

Node.js 20 or newer; no external npm dependencies.

```sh
git clone https://github.com/skamcore/flowix.git
cd flowix
npm test
npm run check
npm run icons
```

19 tests cover response framing, UTF-8, Fetch/XHR, unexpected schemas, concurrent controls and disappearing tabs. GitHub Actions runs validation on pushes and pull requests.

[Architecture](docs/architecture.md) · [Contributing](CONTRIBUTING.md) · [Report a bug](https://github.com/skamcore/flowix/issues/new/choose) · [Changelog](CHANGELOG.md)

## Credits and license

**by skam** · [MIT](LICENSE).

An early-request issue was identified while diagnosing AI Flow Bypasser 1.0.0. flowix is an independently authored implementation with its own code, copy, styling and icons. No original extension files are included. The MIT license applies to flowix only.
