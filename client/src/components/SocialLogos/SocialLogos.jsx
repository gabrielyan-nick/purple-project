import React from "react";
import "./styles.scss";

const SocialLogos = ({ name }) => {
  switch (name) {
    case "Facebook":
      return (
        <svg
          height="30px"
          style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinejoin: "round",
            strokeMiterlimit: 2,
          }}
          version="1.1"
          viewBox="0 0 512 512"
          width="30px"
          xmlSpace="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsserif="http://www.serif.com/"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <path
              className="fb1"
              d="M512,256c0,-141.385 -114.615,-256 -256,-256c-141.385,0 -256,114.615 -256,256c0,127.777 93.616,233.685 216,252.89l0,-178.89l-65,0l0,-74l65,0l0,-56.4c0,-64.16 38.219,-99.6 96.695,-99.6c28.009,0 57.305,5 57.305,5l0,63l-32.281,0c-31.801,0 -41.719,19.733 -41.719,39.978l0,48.022l71,0l-11.35,74l-59.65,0l0,178.89c122.385,-19.205 216,-125.113 216,-252.89Z"
              // style={{ fill: "#0000008a", fillRule: "nonzero" }}
            />
            <path
              className="fb2"
              d="M355.65,330l11.35,-74l-71,0l0,-48.022c0,-20.245 9.917,-39.978 41.719,-39.978l32.281,0l0,-63c0,0 -29.297,-5 -57.305,-5c-58.476,0 -96.695,35.44 -96.695,99.6l0,56.4l-65,0l0,74l65,0l0,178.89c13.033,2.045 26.392,3.11 40,3.11c13.608,0 26.966,-1.065 40,-3.11l0,-178.89l59.65,0Z"
              // style={{ fill: "#fff", fillRule: "nonzero", fillOpacity: 0 }}
            />
          </g>
        </svg>
      );
    case "Twitter":
      return "Twitter";
    case "Instagram":
      return "Instagram";
    case "linkedin.com":
      return "LinkedIn";
    case "tiktok.com":
      return "TikTok";
    case "pinterest.com":
      return "Pinterest";
    case "youtube.com":
      return "YouTube";
    case "tumblr.com":
      return "Tumblr";
    case "snapchat.com":
      return "Snapchat";
    case "reddit.com":
      return "Reddit";
    case "discord.com":
      return "Discord";
    case "github.com":
      return "GitHub";
    default:
      return "Social link";
  }
};

export default SocialLogos;
