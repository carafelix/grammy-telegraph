import { parseHtml, parseMarkdown, Telegraph } from "./deps.deno.ts";
import { Context, Message, NextFunction } from "./deps.deno.ts";
import { postsOpts, TelegraphOpts } from "./types.d.ts";

export interface PostsFlavor<C extends Context = Context>
    extends Context {
    /**
     * Reply with an Telegraph post url
     *
     * @param text The string to be converted to an post.
     * @param opts define parse method for the post, specify an accompany msg and its own options
     * @returns
     */
    replyWithPost: (
        text: string,
        opts?: postsOpts,
    ) => Promise<Message.TextMessage>;

}

/**
 * Installs the Posts flavor into the context.
 *
 * it's STRONGLY recommended to provide an accessToken to avoid creating a publisher on every action.
 *
 * @param publisher Telegraph account from which the post would be publish, if not provided it would be automatically assign. Provide a publisherOpts.accessToken to access an existing account
 * @see https://github.com/dcdunkan/telegraph?tab=readme-ov-file#usage
 * @see https://telegra.ph/api#createAccount
 */
export function posts<C extends Context>(
    publisher?: TelegraphOpts,
) {
    publisher = { short_name: "Anonymous", ...publisher };
    const tph = new Telegraph(publisher);

    return (ctx: PostsFlavor<C>, next: NextFunction) => {

        ctx.replyWithPost = async (
            longMessage: string,
            opts?: postsOpts,
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
