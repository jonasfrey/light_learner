const f_wait = ms => new Promise(r => setTimeout(r, ms));

let f_n_random = (n_max)=>{return parseInt(Math.random()*n_max)}

function f_light(n_index, n_color) {
    let row = Math.floor(n_index / 9);
    let col = n_index % 9;
    let note = (row + 1) * 10 + (col + 1);
    output.send([0x90, note, n_color]);
}

// --- Clear all pads ---
function f_clear() {
    for (let i = 0; i < 81; i++) f_light(i, 0);
}

f_clear() 

f_light(0,7)
await f_wait(1000)

f_light(1,7)
await f_wait(1000)

f_light(2,7)
await f_wait(1000)

f_light(3,7)
await f_wait(1000)

f_light(4,7)
await f_wait(1000)

f_clear()
await f_wait(500)


let n_color_max=105
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))
f_light(f_n_random(80),f_n_random(n_color_max))



