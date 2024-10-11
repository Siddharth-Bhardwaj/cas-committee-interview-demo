import localFont from "next/font/local";

const perstare = localFont({
  src: [
    {
      path: "./NYUPerstare-VF.woff2",
      style: "normal",
    },
    {
      path: "./NYUPerstare-Italic-VF.woff2",
      style: "italic",
    },
  ],
});

export default perstare;
