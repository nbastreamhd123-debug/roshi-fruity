exports.handler = async (event) => {
  const slug = event.queryStringParameters.post || "";
  const WP = "https://985680751.online/wp-json/wp/v2/posts?slug=" + slug + "&_embed";
  let title = slug.replace(/-/g, " ") + " | Roshi Fruity";
  let desc = slug.replace(/-/g, " ");
  let image = "";
  try {
    const res = await fetch(WP, { headers: { "User-Agent": "Mozilla/5.0" } });
    const data = await res.json();
    if (data && data[0]) {
      const p = data[0];
      title = p.title.rendered.replace(/<[^>]*>/g, "").replace(/"/g, "") + " | Roshi Fruity";
      desc = (p.excerpt.rendered || "").replace(/<[^>]*>/g, "").replace(/"/g, "").substring(0, 150);
      const feat = p._embedded && p._embedded["wp:featuredmedia"] && p._embedded["wp:featuredmedia"][0];
      if (feat && feat.source_url) image = feat.source_url;
    }
  } catch (e) {}
  const target = "https://roshi-fruity1.netlify.app/?post=" + slug;
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + title + '</title><meta property="og:title" content="' + title + '"><meta property="og:description" content="' + desc + '"><meta property="og:image" content="' + image + '"><meta http-equiv="refresh" content="0;url=' + target + '"></head><body></body></html>';
  return { statusCode: 200, headers: { "Content-Type": "text/html" }, body: html };
};
