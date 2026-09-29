# Project Structure

The source for the hosted API at `https://beanapi.mizucode.qzz.io`.

```
bean/
  src/
    index.js  -- Express server entry point and health check
    bot.js    -- Discord client and presence cache
    api.js    -- REST routes for presence data
  test/
    set-presence.js -- Sets a real rich presence using a second bot
  .env.example
  .gitignore
  package.json
  README.md
```
