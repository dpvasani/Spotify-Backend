const puppeteer = require("puppeteer");
const axios = require("axios");
const Song = require("../models/Song");

let browser;

exports.getSongThumbnails = async (req, res) => {
  try {
    const { songId } = req.query;

    let songObj;
    let returned = false;

    await Song.findById(songId).then((song) => {
      if (!song) {
        returned = true;
        return axiosImage(
          "https://www.digitalmesh.com/blog/wp-content/uploads/2020/05/404-error.jpg",
          res
        );
      }

      if (song.image_url) {
        returned = true;
        if (!res.headersSent) return axiosImage(song.image_url, res);
      }
      if (!song?.preview_url) {
        returned = true;
        return axiosImage(
          "https://www.digitalmesh.com/blog/wp-content/uploads/2020/05/404-error.jpg",
          res
        );
      }

      songObj = song;
    });

    if (returned) return;

    if (!browser) {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
    const thumbnail = await getThumbnail(songObj.preview_url, browser);
    if (!thumbnail) {
      if (!res.headersSent)
        return res.status(404).json({ message: "Thumbnail not found" });
    }

    if (songId) {
      Song.findByIdAndUpdate(
        songId,
        {
          image_url: thumbnail,
        },
        function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        }
      );
    }

    await axiosImage(thumbnail, res);
  } catch (err) {
    if (!res.headersSent)
      axiosImage(
        "https://www.digitalmesh.com/blog/wp-content/uploads/2020/05/404-error.jpg",
        res
      );
    console.log(err);
  }
};

async function axiosImage(thumbnail, res) {
  const image = await axios.get(thumbnail, { responseType: "arraybuffer" });
  res.set("Content-Type", "image/jpeg");
  res.send(Buffer.from(image.data, "binary"));
}

async function getThumbnail(url, browserInstance) {
  try {
    const page = await browserInstance.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const thumbnail = await page.evaluate(() => {
      const img = document.querySelector(".js-video-preview-playlink img");
      return img ? img.getAttribute("src") : null;
    });
    await page.close();
    return thumbnail;
  } catch (err) {
    if (
      err.name === "Error" &&
      err.message.startsWith("Error: net::ERR_NAME_NOT_RESOLVED")
    ) {
      throw new Error("Invalid URL provided");
    } else {
      throw err;
    }
  }
}

exports.cleanup = async () => {
  if (browser) {
    await browser.close();
  }
};
