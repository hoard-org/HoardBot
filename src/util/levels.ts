// These numbers get insanely big but whatever who cares;
let lvls = [{xp: 1000, level: 1}]
for(let i = 0; i < 100; i++) {
    const lvl = lvls[i]
    lvls[i + 1] = {xp: Math.round(lvl.xp * 1.24), level: i + 2}
}


export const levels = lvls;