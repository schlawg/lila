package lila.forum

import scalatags.Text.all.{ Frag, raw }

import lila.common.RawHtml
import lila.core.config.NetDomain

final class ForumTextExpand(askEmbed: lila.core.ask.AskEmbed)(using Executor, Scheduler):

  private def one(post: ForumPost)(using NetDomain): Fu[ForumPost.WithFrag] =
    lila.common.Bus
      .ask("lpv")(lila.core.misc.lpv.LpvLinkRenderFromText(post.text, _))
      .map: linkRender =>
        raw:
          RawHtml.nl2br {
            RawHtml.addLinks(post.text, expandImg = true, linkRender = linkRender.some).value
          }.value
      .zip(askEmbed.repo.preload(post.text))
      .map: (body, _) =>
        ForumPost.WithFrag(post, body)

  def manyPosts(posts: Seq[ForumPost])(using NetDomain): Fu[Seq[ForumPost.WithFrag]] = posts.traverse(one)
  // posts.view
  //   .map(_.text)
  //   .toList
  //   .sequentially(one)
  //   .map:
  //     _.zip(posts).map: (body, post) =>
  //       ForumPost.WithFrag(post, body)
