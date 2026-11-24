export default async (request, context) => {
  const ua = request.headers.get("user-agent") || "";
  const isBot = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot/i.test(ua);
  if (!isBot) {
    return context.next();
  }
  const url = new URL(request.url);
  const slug = url.searchParams.get("post");
  if (!slug) {
    return context.next();
  }
  try {
    const res = await fetch(`https://985680751.online/wp-json/wp/v2/posts?slug=${slug}&_embed=1`);
    const posts = await res.json();
    const post = posts[0];
    if (!post) return context.next();
    const title = post.title.rendered.replace(/<[^>]*>/g, "");
    const desc = post.excerpt.rendered.replace(/<[^>]*>/g, "").slice(0, 150);
    const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://roshi-fruity1.netlify.app/og-image.jpg";
    const pageUrl = url.href;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><meta property="og:type" content="article" /><meta property="og:url" content="${pageUrl}" /><meta property="og:title" content="${title}" /><meta property="og:description" content="${desc}" /><meta property="og:image" content="${image}" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${title}" /><meta name="twitter:description" content="${desc}" /><meta name="twitter:image" content="${image}" /></head><body><h1>${title}</h1><p>Loading...</p><script>window.location.href="${pageUrl}";</script></body></html>`;
    return new Response(html, { headers: { "content-type": "text/html" } });
  } catch (e) {
    return context.next();
  }
};
export const config = { path: "/*" };
