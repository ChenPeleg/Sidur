export const hashFunction = function (str: string) {
    let h = 0xdeadbeef;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 2654435761);
    }
    return (((h ^ h) >>> 16) >>> 0);
}
