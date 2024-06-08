import { parseHtml, parseMarkdown, Telegraph } from './deps.deno.ts';
import { Context, Message, NextFunction } from './deps.deno.ts';
import { postsOpts, TelegraphOpts } from './types.d.ts';
import { endsInWhitespace } from './utils.ts';

export interface PostsFlavor<C extends Context = Context> extends Context {
    /**
     * Reply with a Telegraph post url
     *
     * @param text The string to be converted to a post.
     * @param options define parse method for the post, specify an accompany msg and its own options
     * @returns
     */
    replyWithPost: (
        text: string,
        options?: postsOpts<C>,
    ) => Promise<Message.TextMessage>;
}

/**
 * Installs the Posts flavor into the context.
 *
 * [!IMPORTANT]
 * it's recommended to provide an accessToken to avoid creating a publisher on every action.
 *
 * @param publisher Telegraph account from which the post would be publish, if not provided it would be automatically assign. Provide a `publisherOpts.accessToken` to access an existing account
 * @see https://github.com/dcdunkan/telegraph?tab=readme-ov-file#usage
 * @see https://telegra.ph/api#createAccount
 */
export function posts<C extends Context>(
    publisher?: TelegraphOpts,
) {
    publisher = { short_name: 'Anonymous', ...publisher };
    const tph = new Telegraph(publisher);

    return (ctx: PostsFlavor<C>, next: NextFunction) => {
        ctx.replyWithPost = async (
            text: string,
            opts?: postsOpts<C>,
        ) => {
            if (!ctx.chat) {
                throw new Error(
                    'Cannot reply if the `chat` property does not exist on the update',
                );
            }
            if (!tph.token.length) {
                tph.token = (await tph.createAccount(publisher)).access_token;
                throw new Error
                    (`No access token was provided.\nHere is one created for you: ${tph.token}`)
            }

            const pageParseMode = opts?.postParseMode || 'Markdown';

            const content = pageParseMode === 'Markdown'
                ? parseMarkdown(text)
                : parseHtml(text);

            if (!content) {
                throw new Error(
                    'Content is empty',
                );
            }

            // this will throw if you pass an invalid telegraph access token
            const page = await tph
                ?.create({
                    title: `${opts?.postTitle}`,
                    content,
                    ...publisher,
                });

            const msg = opts?.message?.text;
            const message = msg
                ? (endsInWhitespace(msg) ? msg : msg + ' ') + page.url
                : page.url;

            return await ctx.reply(message, opts?.message?.other);
        };
        return next();
    };
}
