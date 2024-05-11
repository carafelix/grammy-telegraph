export interface longMessageOpts {
    pageParseMode?: "HTML" | "Markdown";
    pageTitle?: string,
    // accompanyMsg?: {
    //     text: string;
    //     opts: Record<string, never>;
    // };
}

export interface TelegraphOptions {
    accessToken?: string;
    short_name: string;
    author_name?: string;
    author_url?: string;
}
