export function endsInWhitespace(msg: string) {
    return /\s/.test(msg[msg.length - 1]);
}
