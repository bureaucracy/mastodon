# frozen_string_literal: true

require 'singleton'

class Formatter
  include Singleton
  include RoutingHelper

  include ActionView::Helpers::TextHelper
  include ActionView::Helpers::SanitizeHelper

  def format(status)
    return reformat(status.content) unless status.local?

    html = status.text
    html = encode(html)
    html = simple_format(html, {}, sanitize: false)
    html = html.gsub(/\n/, '')
    html = link_urls(html)
    html = link_mentions(html, status.mentions)
    html = link_hashtags(html)

    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def reformat(html)
    sanitize(html, tags: %w(a br p span), attributes: %w(href rel class))
  end

  def plaintext(status)
    return status.text if status.local?
    strip_tags(status.text)
  end

  def simplified_format(account)
    return reformat(account.note) unless account.local?

    html = encode(account.note)
    html = link_urls(html)
    html = link_accounts(html)
    html = link_hashtags(html)

    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  private

  def encode(html)
    HTMLEntities.new.encode(html)
  end

  def link_urls(html)
    Twitter::Autolink.auto_link_urls(html, url_target: '_blank',
                                           link_attribute_block: lambda { |_, a| a[:rel] << ' noopener' },
                                           link_text_block: lambda { |_, text| link_html(text) })
  end

  def link_mentions(html, mentions)
    html.gsub(Account::MENTION_RE) do |match|
      acct    = Account::MENTION_RE.match(match)[1]
      mention = mentions.find { |item| TagManager.instance.same_acct?(item.account.acct, acct) }

      mention.nil? ? match : mention_html(match, mention.account)
    end
  end

  def link_accounts(html)
    html.gsub(Account::MENTION_RE) do |match|
      acct = Account::MENTION_RE.match(match)[1]
      username, domain = acct.split('@')
      domain = nil if TagManager.instance.local_domain?(domain)
      account = Account.find_remote(username, domain)

      account.nil? ? match : mention_html(match, account)
    end
  end

  def link_hashtags(html)
    html.gsub(Tag::HASHTAG_RE) do |match|
      hashtag_html(match)
    end
  end

  def link_html(url)
    prefix = url.match(/\Ahttps?:\/\/(www\.)?/).to_s
    text   = url[prefix.length, 30]
    suffix = url[prefix.length + 30..-1]
    cutoff = url[prefix.length..-1].length > 30
    youtube = false
    img = false

    if text.match(/(youtu\.be|youtube\.com)\/?/i)
      youtube = url.split('v=')[1].to_s
    elsif url.match(/\.(jpg|gif|png|jpeg)/i)
      img = url
    end

    if youtube
      '<iframe class="vid" width="100%" height="215" src="https://www.youtube.com/embed/' + youtube + '" frameborder="0" allowfullscreen></iframe>'
    elsif img
      '<img src="' + img + '" class="image-link">'
    else
      "<span class=\"invisible\">#{prefix}</span><span class=\"#{cutoff ? 'ellipsis' : ''}\">#{text}</span><span class=\"invisible\">#{suffix}</span>"
    end
  end

  def hashtag_html(match)
    prefix, affix = match.split('#')
    "#{prefix}<a href=\"#{tag_url(affix.downcase)}\" class=\"mention hashtag\">#<span>#{affix}</span></a>"
  end

  def mention_html(match, account)
    "#{match.split('@').first}<a href=\"#{TagManager.instance.url_for(account)}\" class=\"h-card u-url p-nickname mention\">@<span>#{account.username}</span></a>"
  end
end
