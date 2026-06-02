/**
 * Bitroot pixel placeholder generator.
 *
 * Produces a deterministic, on-brand pixel-art pattern for blog posts that
 * have no image/video. Same seed (post slug) always yields the same pattern,
 * so a given post looks stable across loads while every post looks distinct.
 *
 * Returns an SVG data URI usable directly as an <img src> or background-image.
 *   window.bitrootPixelPlaceholder('my-post-slug') -> 'data:image/svg+xml,...'
 */
(function () {
    // xmur3-style string hash -> 32-bit seed.
    function hashStr(str) {
        var h = 1779033703 ^ str.length;
        for (var i = 0; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
            h = (h << 13) | (h >>> 19);
        }
        return h >>> 0;
    }

    // mulberry32 seeded PRNG -> deterministic stream of floats in [0, 1).
    function mulberry32(a) {
        return function () {
            a |= 0;
            a = (a + 0x6d2b79f5) | 0;
            var t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    // Brand ramps (dark blue -> blue -> violet -> pink -> peach -> cream).
    // Built around the Bitroot palette: primary blue #1f76f9, pink #fbcfd9,
    // light blue #e8f1fe, dark blue #161d24.
    var RAMPS = [
        ['#1746c8', '#1f76f9', '#5b8cf5', '#a98be8', '#f48fb1', '#fbcfd9', '#fbe6d4'],
        ['#161d24', '#1f76f9', '#4a9aff', '#a98be8', '#fbcfd9', '#fde4ec', '#fbe6d4'],
        ['#1f76f9', '#5b8cf5', '#8f86ee', '#c97fcf', '#f48fb1', '#fbcfd9', '#e8f1fe'],
        ['#1746c8', '#3a6fe0', '#7d7cea', '#c081d6', '#f48fb1', '#fbcfd9', '#fdeede']
    ];

    var GRIDS = [
        { cols: 14, rows: 8 },
        { cols: 16, rows: 9 },
        { cols: 18, rows: 10 }
    ];

    function build(seed) {
        var rnd = mulberry32(hashStr(String(seed || 'bitroot')));

        var grid = GRIDS[Math.floor(rnd() * GRIDS.length)];
        var cols = grid.cols;
        var rows = grid.rows;
        var ramp = RAMPS[Math.floor(rnd() * RAMPS.length)];

        // Seeded focal corner — concentric "nested square" bands emanate from it
        // (Chebyshev distance gives the blocky, pixel-art ring look).
        var fx = rnd() < 0.5 ? 0 : cols - 1;
        var fy = rnd() < 0.5 ? 0 : rows - 1;
        var span = Math.max(cols, rows) - 1;

        // Mostly lightest-at-focal; occasionally invert for variety.
        var invert = rnd() < 0.3;

        var rects = '';
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                var d = Math.max(Math.abs(x - fx), Math.abs(y - fy)) / span; // 0..1
                var t = invert ? d : 1 - d;
                var jitter = (rnd() - 0.5) * 0.16;
                var idx = Math.round((t + jitter) * (ramp.length - 1));
                if (idx < 0) idx = 0;
                if (idx > ramp.length - 1) idx = ramp.length - 1;
                // 1.02 size overlaps cell seams so no hairline gaps appear.
                rects += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + ramp[idx] + '"/>';
            }
        }

        var svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="' + cols + '" height="' + rows +
            '" viewBox="0 0 ' + cols + ' ' + rows +
            '" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid slice">' +
            rects + '</svg>';

        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    }

    window.bitrootPixelPlaceholder = build;
})();
