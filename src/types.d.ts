import { TelegraphOptions, CreatePageOptions } from "./deps.deno.ts";

export interface longMessageOpts {
    pageParseMode?: "HTML" | "Markdown";
    pageTitle?: CreatePageOptions["title"],
    // accompanyMsg?: {
    //     text: string;
    //     opts: Record<string, never>;
    // };
}
export type TelegraphOpts =
    Required<Pick<TelegraphOptions, "short_name">>
    & Omit<TelegraphOptions, 'apiRoot'>
