import { Context } from './deps.deno.ts';
import { CreatePageOptions, TelegraphOptions } from './deps.deno.ts';

export interface postsOpts {
    postParseMode?: 'HTML' | 'Markdown';
    postTitle?: CreatePageOptions['title'];
    message?: {
        text?: Parameters<Context['reply']>[0];
        other?: Parameters<Context['reply']>[1];
    };
}

export type TelegraphOpts =
    & Required<Pick<TelegraphOptions, 'short_name'>>
    & Omit<TelegraphOptions, 'apiRoot'>;
