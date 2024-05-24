import { Context } from './deps.deno.ts';
import { CreatePageOptions, TelegraphOptions } from './deps.deno.ts';

export interface postsOpts<C extends Context> {
    postParseMode?: 'HTML' | 'Markdown';
    postTitle?: CreatePageOptions['title'];
    message?: {
        text?: Parameters<C['reply']>[0];
        other?: Parameters<C['reply']>[1];
    };
}

export type TelegraphOpts =
    & Required<Pick<TelegraphOptions, 'short_name'>>
    & Omit<TelegraphOptions, 'apiRoot'>;
