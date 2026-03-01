// Fragment shader for Launchpad
// Write f_fragment(col, row, t) and return a color (0-127).
// col: 0-8, row: 0-8, t: elapsed seconds
// The render loop calls it for every pad at ~15 fps.

// --- Enter Programmer mode (Launchpad Mini MK3) ---
output.send([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x0E, 0x01, 0xF7]);

function f_light(n_index, n_color) {
    let row = Math.floor(n_index / 9);
    let col = n_index % 9;
    let note = (row + 1) * 10 + (col + 1);
    output.send([0x90, note, n_color]);
}

function f_clear() {
    for (let i = 0; i < 81; i++) f_light(i, 0);
}

// --- Heart SDF (iq) ported to JS ---
function f_sd_heart(px, py) {
    px = Math.abs(px);
    if (py + px > 1.0) {
        let dx = px - 0.25, dy = py - 0.75;
        return Math.sqrt(dx*dx + dy*dy) - Math.SQRT2 / 4.0;
    }
    let dx1 = px, dy1 = py - 1.0;
    let d1 = dx1*dx1 + dy1*dy1;
    let s = Math.max(px + py, 0.0) * 0.5;
    let dx2 = px - s, dy2 = py - s;
    let d2 = dx2*dx2 + dy2*dy2;
    return Math.sqrt(Math.min(d1, d2)) * Math.sign(px - py);
}

// --- Your fragment shader --- edit this! ---
function f_fragment(col, row, t) {
    // map grid to -1..1 centered coords
    let px = (col - 4) / 4;
    let py = -(row - 7
    ) / 4;
    px = px*0.7;
    py = py*0.7;

    let d = f_sd_heart(px, py);
    let d_nor = d/(9*9);
    d_nor = 1.-d_nor;
    return d_nor *127;
}

// --- Render loop ---
let n_fps = 15;
let n_duration = 15; // seconds
let n_t0 = Date.now();

let n_interval = setInterval(() => {
    let t = (Date.now() - n_t0) / 1000;
    if (t > n_duration) {
        clearInterval(n_interval);
        f_clear();
        return;
    }
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let c = f_fragment(col, row, t);
            f_light(row * 9 + col, c);
        }
    }
}, 1000 / n_fps);