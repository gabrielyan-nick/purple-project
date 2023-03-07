export function getSocialNetwork(domain) {
  switch (domain) {
    case "facebook.com":
    case "uk-ua.facebook.com":
      return "Facebook";
    case "twitter.com":
      return "Twitter";
    case "www.instagram.com":
      return "Instagram";
    case "linkedin.com":
    case "ua.linkedin.com":
    case "www.linkedin.com":
      return "LinkedIn";
    case "tiktok.com":
    case "www.tiktok.com":
      return "TikTok";
    case "pinterest.com":
    case "ru.pinterest.com":
      return "Pinterest";
    case "youtube.com":
    case "www.youtube.com":
      return "YouTube";
    case "tumblr.com":
      return "Tumblr";
    case "snapchat.com":
    case "www.snapchat.com":
      return "Snapchat";
    case "reddit.com":
    case "www.reddit.com":
      return "Reddit";
    case "discord.com":
      return "Discord";
    case "github.com":
      return "GitHub";
    default:
      return getDomain(domain);
  }
}

export function fixUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

export function getDomain(url) {
  if (url.startsWith("www.")) {
    url = url.substring(4);
  }
  return url.split(".")[0];
}

export function fixEditedUrl(urlString) {
  const urls = urlString.split("https://");
  if (urls.length === 3) {
    return `https://${urls[2]}`;
  } else {
    return urlString;
  }
}

export function isUrlTest(str) {
  if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(str)) {
    return true;
  } else return false;
}
