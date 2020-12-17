# `logging`

> TODO: description

## Usage

```typescript
import console from '@discord-bot/logging'

console.err("Something really bad happened!")
console.warn("Something bad happened, but not catastrophic")
console.info("just normal stuff happening. coulda used console.log also")
console.debug(`really minuscious stuff here. lot's of details and shit. like "got to this if" kind of logs, y'know?`)
```

## Env
When you use the lib, remember to add a LOG_LEVEL env var, that should be either:

  - `"none"`
  - `"error"`
  - `"warning"`
  - `"info"`
  - `"debug"`
