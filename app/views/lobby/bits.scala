package views.html.lobby

import controllers.routes

import lila.app.templating.Environment.{ *, given }
import lila.web.ui.ScalatagsTemplate.{ *, given }
import lila.rating.PerfType

object bits:

  val lobbyApp = div(cls := "lobby__app")(
    div(cls := "tabs-horiz")(span(nbsp)),
    div(cls := "lobby__app__content")
  )

  def tournaments(tours: List[lila.tournament.Tournament])(using ctx: Context) =
    div(cls := "lobby__tournaments lobby__box")(
      a(cls := "lobby__box__top", href := routes.Tournament.home)(
        h2(cls := "title text", dataIcon := Icon.Trophy)(trans.site.openTournaments()),
        span(cls := "more")(trans.site.more(), " »")
      ),
      div(cls := "enterable_list"):
        views.html.tournament.bits.enterable(tours)
    ) // TODO - move to views/tournament

  def simuls(simuls: List[lila.simul.Simul])(using ctx: Context) =
    div(cls := "lobby__simuls lobby__box")(
      a(cls := "lobby__box__top", href := routes.Simul.home)(
        h2(cls := "title text", dataIcon := Icon.Group)(trans.site.simultaneousExhibitions()),
        span(cls := "more")(trans.site.more(), " »")
      ),
      div(cls := "enterable_list"):
        views.html.simul.bits.allCreated(simuls, withName = false)
    ) // TODO - move to views/simul

  def underboards(
      tours: List[lila.tournament.Tournament],
      simuls: List[lila.simul.Simul],
      leaderboard: List[lila.core.user.LightPerf],
      tournamentWinners: List[lila.tournament.Winner]
  )(using ctx: Context) =
    frag(
      /*ctx.pref.showRatings.option(
        div(cls := "lobby__leaderboard lobby__box")(
          div(cls := "lobby__box__top")(
            h2(cls := "title text", dataIcon := Icon.CrownElite)(trans.site.leaderboard()),
            a(cls := "more", href := routes.User.list)(trans.site.more(), " »")
          ),
          div(cls := "lobby__box__content"):
            table:
              tbody:
                leaderboard.map: l =>
                  tr(
                    td(lightUserLink(l.user)),
                    td(cls := "text", dataIcon := PerfType(l.perfKey).icon)(l.rating),
                    td(ratingProgress(l.progress))
                  )
        )
      ),
      div(cls := s"lobby__box ${if ctx.pref.showRatings then "lobby__winners" else "lobby__wide-winners"}")(
        div(cls := "lobby__box__top")(
          h2(cls := "title text", dataIcon := Icon.Trophy)(trans.arena.tournamentWinners()),
          a(cls := "more", href := routes.Tournament.leaderboard)(trans.site.more(), " »")
        ),
        div(cls := "lobby__box__content"):
          table:
            tbody:
              tournamentWinners
                .take(10)
                .map: w =>
                  tr(
                    td(userIdLink(w.userId.some)),
                    td:
                      a(title := w.tourName, href := routes.Tournament.show(w.tourId)):
                        scheduledTournamentNameShortHtml(w.tourName)
                  )
      ),*/
      div(cls := "lobby__tournaments-simuls")(
        div(cls := "lobby__tournaments lobby__box")(
          a(cls := "lobby__box__top", href := routes.Tournament.home)(
            h2(cls := "title text", dataIcon := Icon.Trophy)(trans.site.openTournaments()),
            span(cls := "more")(trans.site.more(), " »")
          ),
          div(cls := "lobby__box__content"):
            views.html.tournament.bits.enterable(tours)
        ),
        simuls.nonEmpty.option(
          div(cls := "lobby__simuls lobby__box")(
            a(cls := "lobby__box__top", href := routes.Simul.home)(
              h2(cls := "title text", dataIcon := Icon.Group)(trans.site.simultaneousExhibitions()),
              span(cls := "more")(trans.site.more(), " »")
            ),
            div(cls := "lobby__box__content"):
              views.html.simul.bits.allCreated(simuls, withName = false)
          )
        )
      )
    )
  /*def lastPosts(
      lichess: Option[lila.blog.MiniPost],
      uposts: List[lila.ublog.UblogPost.PreviewPost]
  )(using ctx: Context): Frag =
    div(cls := "lobby__blog ublog-post-cards")(
      lichess.map: post =>
        val imgSize = UblogPost.thumbnail.Size.Small
        a(cls := "ublog-post-card ublog-post-card--link", href := routes.Blog.show(post.id, post.slug))(
          img(
            src     := post.image,
            cls     := "ublog-post-card__image",
            widthA  := imgSize.width,
            heightA := imgSize.height
          ),
          span(cls := "ublog-post-card__content")(
            h2(cls := "ublog-post-card__title")(post.title),
            semanticDate(post.date)(using ctx.lang)(cls := "ublog-post-card__over-image")
          )
        )
      ,
      ctx.kid.no option uposts
        .take(if lichess.isEmpty then 6 else 5)
        .map:
          views.html.ublog.post.card(_, showAuthor = views.html.ublog.post.ShowAt.bottom, showIntro = false)
    )*/

  def showUnreadLichessMessage(using Context) =
    nopeInfo(
      cls := "unread-lichess-message",
      p(trans.site.showUnreadLichessMessage()),
      p:
        a(cls := "button button-big", href := routes.Msg.convo(UserId.lichess)):
          trans.site.clickHereToReadIt()
    )

  def playbanInfo(ban: lila.playban.TempBan)(using Context) =
    nopeInfo(
      h1(trans.site.sorry()),
      p(trans.site.weHadToTimeYouOutForAWhile()),
      p(strong(timeRemaining(ban.endsAt))),
      h2(trans.site.why()),
      p(
        trans.site.pleasantChessExperience(),
        br,
        trans.site.goodPractice(),
        br,
        trans.site.potentialProblem()
      ),
      h2(trans.site.howToAvoidThis()),
      ul(
        li(trans.site.playEveryGame()),
        li(trans.site.tryToWin()),
        li(trans.site.resignLostGames())
      ),
      p(
        trans.site.temporaryInconvenience(),
        br,
        trans.site.wishYouGreatGames(),
        br,
        trans.site.thankYouForReading()
      )
    )

  def currentGameInfo(current: lila.app.mashup.Preload.CurrentGame)(using Context) =
    nopeInfo(
      h1(trans.site.hangOn()),
      p(trans.site.gameInProgress(strong(current.opponent))),
      br,
      br,
      a(
        cls      := "text button button-fat",
        dataIcon := Icon.PlayTriangle,
        href     := routes.Round.player(current.pov.fullId)
      )(
        trans.site.joinTheGame()
      ),
      br,
      br,
      "or",
      br,
      br,
      postForm(action := routes.Round.resign(current.pov.fullId))(
        button(cls := "text button button-red", dataIcon := Icon.X):
          if current.pov.game.abortableByUser then trans.site.abortTheGame() else trans.site.resignTheGame()
      ),
      br,
      p(trans.site.youCantStartNewGame())
    )

  def nopeInfo(content: Modifier*) =
    frag(
      div(cls := "lobby__app"),
      div(cls := "lobby__nope"):
        st.section(cls := "lobby__app__content")(content)
    )

  def spotlight(e: lila.event.Event)(using Context) =
    a(
      href := (if e.isNow || !e.countdown then e.url else routes.Event.show(e.id).url),
      cls := List(
        s"tour-spotlight event-spotlight id_${e.id}" -> true,
        "invert"                                     -> e.isNowOrSoon
      )
    )(
      views.html.event.iconOf(e),
      span(cls := "content")(
        span(cls := "name")(e.title),
        span(cls := "headline")(e.headline),
        span(cls := "more"):
          if e.isNow then trans.site.eventInProgress() else momentFromNow(e.startsAt)
      )
    )
