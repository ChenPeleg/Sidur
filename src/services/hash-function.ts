export const hashFunction = function (str: string) {
    for (var i = 0, h = 0xdeadbeef; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 2654435761);
    }
    return (h ^ h >>> 16) >>> 0;
}
