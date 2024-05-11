import { parseHtml, parseMarkdown, Telegraph } from "./deps.deno.ts";
import { Context, Message, NextFunction } from "./deps.deno.ts";
import { longMessageOpts, TelegraphOptions } from "./types.d.ts";

export interface longMessagesFlavor<C extends Context = Context>
    extends Context {
    /**
     * Reply with an Telegraph article url
     *
     * @param text The string to be converted to an article.
     * @param opts define parse method for the article, specify an accompany msg and its own options
     * @returns
     */
    replyWithLongMessage: (
        text: string,
        opts?: longMessageOpts,
    ) => Promise<Message.TextMessage>;

}

/**
 * Installs the longMessage flavor into the context.
 *
 * it's STRONGLY recommended to provide an accessToken to avoid creating a publisher on every action.
 *
 * @param publisher Telegraph account from which the article would be publish, if not provided it would be automatically assign. Provide a publisherOpts.accessToken to access an existing account
 * @see https://github.com/dcdunkan/telegraph?tab=readme-ov-file#usage
 * @see https://telegra.ph/api#createAccount
 */
export function longMessages<C extends Context>(
    publisher?: TelegraphOptions,
) {
    publisher = { short_name: "Anonymous", ...publisher };
    const tph = new Telegraph(publisher);

    return (ctx: longMessagesFlavor<C>, next: NextFunction) => {

        ctx.replyWithLongMessage = async (
            longMessage: string,
            opts?: longMessageOpts,
        ) => {
            if (!ctx.chat) {
                throw new Error(
                    "Cannot reply if the `chat` property does not exist on the update",
                );
            }

            const pageParseMode = opts?.pageParseMode || "Markdown";

            const content = pageParseMode === "Markdown"
                ? parseMarkdown(longMessage)
                : parseHtml(longMessage);

            if (!content) {
                throw new Error(
                    "Content should not be undefined",
                );
            }
            if (!tph.token.length) {
                tph.token = (await tph.createAccount(publisher)).access_token;
            }
            const page =
                await tph
                    .create({
                        title: `${opts?.pageTitle}`,
                        content,
                        ...publisher,
                    });

            return await ctx.reply(page.url);
        };

        return next();
    };
}
