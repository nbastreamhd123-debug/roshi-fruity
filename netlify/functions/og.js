exports.handler = async (event) => {
  const slug = event.queryStringParameters.post || "";
  const WP = "https://985680751.online/wp-json/wp/v2/posts?slug=" + slug + "&_embed";
  let title = "Roshi Fruity - Healthy Fruits & Benefits";
  let desc = "Read full story on Roshi Fruity";
  let image = "https://roshi-fruity1.netlify.app/appel-2.jpg";
  try {
    const res = await fetch(WP);
    const data = await res.json();
    if (data && data[0]) {
      const p = data[0];
      title = p.title.rendered.replace(/<[^>]*>/g, "") + " | Roshi Fruity";
      desc = (p.excerpt.rendered || "").replace(/<[^>]*>/g, "").substring(0, 150);
      image = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || image;
    }
  } catch (e) {}
  const target = "https://roshi-fruity1.netlify.app/?post=" + slug;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:image" content="${image}"><meta property="og:url" content="${target}"><meta property="og:type" content="article"><meta http-equiv="refresh" content="0;url=${target}"></head><body><script>window.location.href="${target}"</script><a href="${target}">Click here</a></body></html>`;
  return { statusCode: 200, headers: { "Content-Type": "text/html" }, body: html };
};
