# GrammY Telegraph Plugin

## Installing

```ts
import { longMessages, longMessagesFlavor } from "@grammyjs/telegraph";

type MyContext = Context & longMessagesFlavor;

const bot = new Bot<MyContext>("BOT_TOKEN");
bot.use(longMessages());
```

It's strongly recommend to install using a fixed access token to prevent creating a publisher on every action, you can create a publisher as specified [here](https://telegra.ph/api#createAccount):

```ts
bot.use(longMessages({ accessToken: "myAccessToken", short_name: "Me" }));
```

## Usage

Default parse method is Markdown. A `mediaUpload` helper function it's provided for embedding images on the post

```ts
bot.command("example1", async (c) => {
    await c.replyWithLongMessage(veryLongMarkdown);
});

bot.command("example2", async (c) => {
    await c.replyWithLongMessage(veryLongHTML, {
        pageParseMode: "HTML",
        pageTitle: "My Title",
    });
});

bot.command("example3", async (c) => {
    const superLongMarkdown = `# My Super Long Message
    ![My Image](${await mediaUpload("./file.jpg")})`;
    await c.replyWithLongMessage(msg);
});

bot.command("example4", async (c) => {
    const superLongHTML = `<h1>¡YES!</h1><br>
    <img src="${await mediaUpload("./no.jpg")}">`;
    await c.replyWithLongMessage(msg);
});
```
