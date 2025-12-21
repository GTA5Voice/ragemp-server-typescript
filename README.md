## GTA5Voice Server Integration (Typescript) for [RAGE Multiplayer](https://rage.mp)
For more information, visit our website: https://gta5voice.com<br>
We are not in any way affiliated, associated, authorized, endorsed by, or connected with Rockstar Games or Take-Two Interactive.

## Links
- The latest plugin version can be found here: https://gta5voice.com/downloads
- The documentation can be found here: https://docs.gta5voice.com
- Join our Discord for more information: https://gta5voice.com/discord

## Notes
- It is recommended to keep the code up to date to avoid security vulnerabilities and ensure compatibility. All updates are announced on our [Discord server](https://gta5voice.com/discord), including detailed changelogs and more.

## Quick setup
1. Download the [source code from here](https://github.com/GTA5Voice/ragemp-server-typescript).
2. Install the development dependencies:
```bash
npm install --save-dev
```
3. Build the project:
```bash
npm run build
```
4. After building, you will find the generated folder:
```
build/gta5voice
```
5. Copy the **gta5voice** folder into your `packages` directory.
6. Add the following line to your packages `index.js`:
```js
require('gta5voice');
```

## Configuration
1. Configure servers **conf.json** according to your needs:
```json
{
  "VirtualServerUID": "YOUR_VIRTUAL_SERVER_UID_HERE",
  "IngameChannelId": INGAME_CHANNEL_ID_HERE,
  "FallbackChannelId": FALLBACK_CHANNEL_ID_HERE,
  "IngameChannelPassword": "INGAME_CHANNEL_PASSWORD_HERE",
  "DebuggingEnabled": false,
  "Language": "en",
  "CalculationInterval": 250,
  "VoiceRanges": "[2, 5, 8, 15]",
  "ExcludedChannels": "[100, 200, 300]"
}
```
2. Make sure your Virtual Server UID is registered at [https://gta5voice.com](https://gta5voice.com).
