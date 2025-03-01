import { looseH as h, onInsert } from 'common/snabbdom';
import type LobbyController from '../ctrl';
import type { NowPlaying } from '../interfaces';
import { initMiniBoard } from 'common/miniBoard';
import { timeago } from 'common/i18n';
import { myUsername } from 'common';

function timer(pov: NowPlaying) {
  const date = Date.now() + pov.secondsLeft! * 1000;
  return h('time.timeago', { hook: onInsert(el => el.setAttribute('datetime', '' + date)) }, timeago(date));
}

export default function (ctrl: LobbyController) {
  return h('div.now-playing', [
    ...ctrl.data.nowPlaying.map(pov =>
      h('a.' + pov.variant.key, { key: `${pov.gameId}${pov.lastMove}`, attrs: { href: '/' + pov.fullId } }, [
        h('span.mini-board.cg-wrap.is2d', {
          attrs: { 'data-state': `${pov.fen},${pov.orientation || pov.color},${pov.lastMove}` },
          hook: { insert: vnode => initMiniBoard(vnode.elm as HTMLElement) },
        }),
        h('span.meta', [
          pov.opponent.ai
            ? i18n.site.aiNameLevelAiLevel('Stockfish', pov.opponent.ai)
            : pov.opponent.username,
          h(
            'span.indicator',
            pov.isMyTurn
              ? pov.secondsLeft && pov.hasMoved
                ? timer(pov)
                : [i18n.site.yourTurn]
              : h('span', '\xa0'),
          ), // &nbsp;
        ]),
      ]),
    ),
    ...ctrl.localGames.map(g => {
      if (g.white && g.black) return; // bot v bot, ignore
      const img = ctrl.local.bot.imageUrl(g.white ?? g.black);

      return h('a.local', { key: g.id, attrs: { href: '/local#id=' + g.id } }, [
        h(
          'div.mini-board-wrapper',
          h('span.mini-board.cg-wrap.is2d', {
            attrs: { 'data-state': `${g.fen},${g.turn},${g.lastMove}` },
            hook: { insert: vnode => initMiniBoard(vnode.elm as HTMLElement) },
          }),
        ),
        h('span.meta', [
          g.white ? ctrl.local.nameOf(g.white) : g.black ? ctrl.local.nameOf(g.black) : myUsername(),
          h('span.indicator', !g[g.turn] ? [i18n.site.yourTurn] : h('span', '\xa0')),
        ]),
        img && h(`img.${g.white ? 'white' : 'black'}`, { attrs: { src: img } }),
        h('button', {
          hook: onInsert(el =>
            el.addEventListener('click', e => {
              e.preventDefault();
              ctrl.local.db.delete(g.id).then(() => {
                ctrl.localGames = ctrl.localGames.filter(lg => lg.id !== g.id);
                ctrl.redraw();
              });
            }),
          ),
        }),
      ]);
    }),
  ]);
}
