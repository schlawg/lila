import { init as initBoard } from 'common/miniBoard';

requestAnimationFrame(() => {
  $('main.lobby').each(function (this: HTMLElement) {
    // fake tv for debugging layout, ui/build with -d flag
    if (site.debug && !this.querySelector('.lobby__tv')) {
      const ds = document.body.dataset;
      const tv = $as<HTMLElement>(
        `
        <div class="lobby__tv">
            <a href="/tv" class="mini-game mini-game-abcd1234 standard is2d">
                <span class="mini-game__player"><span class="mini-game__user"><span class="utitle" title="Candidate Master">CM</span>&nbsp;Tester1<img class="uflair" src="${ds.assetUrl}/assets/______2/flair/img/activity.lichess-horsey.webp"><span class="rating">2649</span></span><span class="mini-game__clock mini-game__clock--black clock--run" data-time="60">0:26</span></span>
                <span id="fake-tv" data-state="3R1r1k/pp4p1/2n1Q1bp/1Bp5/PqN4P/2b2NP1/1P4P1/2K4R,black,d1d8"></span>
                <span class="mini-game__player"><span class="mini-game__user"><span class="utitle" title="FIDE Master">FM</span>&nbsp;tester2<img class="uflair" src="${ds.assetUrl}/assets/______2/flair/img/activity.lichess-berserk.webp"><span class="rating">2760</span></span><span class="mini-game__clock mini-game__clock--white" data-time="60">0:19</span></span>
            </a>
        </div>`.trim(),
      );
      initBoard(tv.querySelector('#fake-tv')!);
      this.append(tv);
      if (Number(window.getComputedStyle(this).getPropertyValue('--cols')) == 4) {
        const tv2 = $as<HTMLElement>(
          `
          <div class="lobby__leaderboard">
              <a href="/tv" class="mini-game mini-game-abcd1234 standard is2d">
                  <span class="mini-game__player"><span class="mini-game__user"><span class="utitle" title="Grandmaster">GM</span>&nbsp;Joe - Candidates Round 2<span class="rating">2756</span></span><span class="mini-game__clock mini-game__clock--black clock--run" data-time="60">0:26</span></span>
                  <span class="fake-tv2" data-state="r4r1k/1pp3p1/1p1p3p/4p3/1PB1K2n/P1PP4/7N/6R1,black"></span>
                  <span class="mini-game__player"><span class="mini-game__user"><span class="utitle" title="Grandmaster">GM</span>&nbsp;Bob - Candidates Round 2<span class="rating">2712</span></span><span class="mini-game__clock mini-game__clock--white" data-time="60">0:19</span></span>
              </a>
          </div>`.trim(),
        );
        initBoard(tv2.querySelector('.fake-tv2')!);
        this.append(tv2);
        const tv3 = $as<HTMLElement>(
          `
        <div class="lobby__winners">
              <a href="/tv" class="mini-game mini-game-abcd1234 standard is2d">
                  <span class="mini-game__player"><span class="mini-game__user"><span class="utitle" title="Women's Grandmaster">WGM</span>&nbsp;Mei - Candidates Round 2<span class="rating">2723</span></span><span class="mini-game__clock mini-game__clock--black clock--run" data-time="60">0:26</span></span>
                  <span class="fake-tv3" data-state="4r1k1/pq1b1ppp/2p2n2/2bp2B1/8/1PPB1P2/P2Q2PP/5R1K,white"></span>
                  <span class="mini-game__player"><span class="mini-game__user"><span class="utitle" title="Women's Grandmaster">WGM</span>&nbsp;Ana - Candidates Round 2<span class="rating">2744</span></span><span class="mini-game__clock mini-game__clock--white" data-time="60">0:19</span></span>
              </a>
        </div>`.trim(),
        );
        initBoard(tv3.querySelector('.fake-tv3')!);
        this.append(tv3);
      }
    }
  });
});
