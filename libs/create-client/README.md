# `create-client`

This library implements the connection with the discord server, through the discord.js library, and also adds another layer of abstraction to help the user create bots.

In the implementation of this, a Composition pattern was used. Thus, every functionality of the main function that creates clients comes from a Composer function, that takes the state of the object and implements only that functionality.
<!-- TODO: expand more on this, and add code snippets and type definitions for clarity -->

## Usage

```typescript
import discordConnection from 'create-client'

// TODO: DEMONSTRATE API
```

## Env
When you use the lib, remember to add a LOG_LEVEL env var, that should be either:

  - none
  - error
  - warning
  - info
  - debug
