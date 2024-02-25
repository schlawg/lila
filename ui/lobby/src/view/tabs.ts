import { h } from 'snabbdom';
import { bind, MaybeVNodes } from 'common/snabbdom';
import LobbyController from '../ctrl';
import { Tab } from '../interfaces';

function tab(ctrl: LobbyController, key: Tab, active: Tab, content: MaybeVNodes) {
  return h(
    'span',
    {
      attrs: { role: 'tab' },
      class: { active: key === active, glowing: key !== active && key === 'pools' && !!ctrl.poolMember },
      hook: bind('mousedown', _ => ctrl.setTab(key), ctrl.redraw),
    },
    content,
  );
}

export default function (ctrl: LobbyController) {
  const nbPlaying = ctrl.data.nbNowPlaying,
    myTurnPovsNb = ctrl.data.nowPlaying.filter(p => p.isMyTurn).length,
    active = ctrl.tab,
    isBot = ctrl.me?.isBot;
  return [
    h('div.tabs-horiz', { attrs: { role: 'tablist' } }, [
      isBot ? undefined : tab(ctrl, 'pools', ctrl.tab, ['Quick']),
      isBot ? undefined : tab(ctrl, 'lobby', ctrl.tab, [ctrl.trans.noarg('Lobby')]),
      isBot ? undefined : tab(ctrl, 'events', ctrl.tab, ['Events']),
      ctrl.tab === 'games' || nbPlaying || isBot
        ? tab(ctrl, 'games', ctrl.tab, [
            'Games',
            myTurnPovsNb > 0 ? h('i.unread', myTurnPovsNb >= 9 ? '9+' : myTurnPovsNb) : null,
          ])
        : null,
    ]),
    ctrl.tab === 'lobby'
      ? h('div.tabs-horiz.secondary-tabs', { attrs: { role: 'tablist' } }, [
          tab(ctrl, 'real_time', ctrl.lobbyTab, ['Real time']),
          tab(ctrl, 'variant', active, [ctrl.trans.noarg('Variant')]),
          tab(ctrl, 'correspondence', ctrl.lobbyTab, ['Correspondence']),
        ])
      : null,
  ];
}
