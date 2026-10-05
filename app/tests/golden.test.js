import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { T0, stable, sha, loadRaw, installFakes } from './helpers.js';

// Regressão do motor: o resultado do motor modular tem de ser idêntico ao do original.
describe('golden master: temporada turbo (8 dias)', () => {
  it('reproduz os checkpoints do motor original', async () => {
    const golden = JSON.parse(fs.readFileSync(new URL('./golden/season-turbo.json', import.meta.url), 'utf8'));
    const st = installFakes();
    const { WORLD: Wd, SEASON: SE } = await import('../src/engine/index.js');
    Wd.init(loadRaw());
    const S = Wd.newWorld({ now: T0, seed: 424242, mode: 'turbo' });
    SE.setupSeason(S); S.lastT = S.seasonStart;
    S.divA.slice(0, 3).forEach((c, i) => Wd.addDesk(S, 'tok' + i, { name: 'Tec' + i }, c));
    Wd.bindDesks(S);
    const got = [];
    const total = golden.checkpoints.at(-1).i;
    for (let i = 1; i <= total; i++) {
      st.clock = T0 + i * 30 * 60000;
      SE.process(S, 200);
      if (i % 48 === 0 || i === total) { const j = stable(S); got.push({ i, day: i / 48, slot: S.slot, season: S.season, size: j.length, sha: sha(j) }); }
    }
    expect(got).toEqual(golden.checkpoints);
  });
});
