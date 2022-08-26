const fs = require("fs");
const puppeteer = require("puppeteer");

let link = "https://krisha.kz/prodazha/kvartiry/astana-esilskij/?page=";

(async () => {
  let flag = true;
  let res = [];
  let counter = 1;

  try {
    let browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
      devtools: true,
    });

    let page = await browser.newPage();
    await page.setViewport({
      width: 1400,
      height: 900,
    });
    while (flag) {
      await page.goto(`${link}${counter}`, { timeout: 0 });
      console.log(counter);

      let html = await page.evaluate(async () => {
        let page = [];

        try {
          let divs = document.querySelectorAll("div.a-card__inc");

          divs.forEach((div) => {
            let a = div.querySelector("a.a-card__title");
            let subtitle = div.querySelector("div.a-card__subtitle");

            let obj = {
              // title : a !== null
              // ? a.innerText
              // : 'NO-TITLE',
              link: a.href,
              address: subtitle !== null ? subtitle.innerText : null,
              price:
                div.querySelector("div.a-card__price") !== null
                  ? div.querySelector("div.a-card__price").innerText
                  : "NO-PRICE",
            };

            page.push(obj);
          });
        } catch (e) {
          console.log(e);
        }
        return page;
      });

      await res.push(html);

      for (let i in res) {
        if (res[i].length === 0) flag = false;
        if (counter === 150) flag = false;
      }
      counter++;

      for (let i = 0; i < html.length; i++) {
        await page.goto(html[i].link, { timeout: 0 });
        await page
          .waitForSelector("div.offer__advert-info")
          .catch((e) => console.log(e));
        await page
          .waitForSelector("div.offer__parameters")
          .catch((e) => console.log(e));
        console.log(i);
        let city = await page.evaluate(async () => {
          let city;
          try {
            city = document.querySelector(
              "div.offer__location span"
            ).textContent;
            if (
              document
                .querySelector("div.offer__location span")
                .textContent.includes(",")
            ) {
              let citySplit = city.split(",");
              city = citySplit[0];
            } else {
              city = document.querySelector(
                "div.offer__location span"
              ).innerText;
            }
          } catch (e) {
            city = null;
          }

          return city;
        });

        let title = await page.evaluate(async () => {
          let title;
          try {
            title = document.querySelector(
              "div.offer__advert-title h1"
            ).innerText;
            if (
              document
                .querySelector("div.offer__advert-title h1")
                .textContent.includes(",")
            ) {
              let split = title.split(",");
              title = split[0];
            } else {
              title = document.querySelector(
                "div.offer__advert-title h1"
              ).innerText;
            }
          } catch (e) {
            title = null;
          }
          return title;
        });

        let houseType = await page.evaluate(async () => {
          let houseType;
          try {
            houseType = document.querySelector(
              "div.offer__info-item[data-name='flat.building'] div.offer__advert-short-info"
            ).textContent;
            if (
              document
                .querySelector(
                  "div.offer__info-item[data-name='flat.building'] div.offer__advert-short-info"
                )
                .textContent.includes(",")
            ) {
              let houseSplit = houseType.split(",");
              houseType = houseSplit[0];
            } else {
              houseType = null;
            }
          } catch (e) {
            houseType = null;
          }
          return houseType;
        });

        let year = await page.evaluate(async () => {
          let year;
          try {
            year = document.querySelector(
              "div.offer__info-item[data-name='flat.building'] div.offer__advert-short-info"
            ).innerText;
            let num = year.replace(/[^0-9]/g, "");
            year = num;
          } catch (e) {
            year = null;
          }
          return year;
        });

        let area = await page.evaluate(async () => {
          let area;
          try {
            area = document.querySelector(
              "div.offer__info-item[data-name='live.square'] div.offer__advert-short-info"
            ).innerText;
            if (
              document
                .querySelector(
                  "div.offer__info-item[data-name='live.square'] div.offer__advert-short-info"
                )
                .textContent.includes(",")
            ) {
              let split = area.split(",");
              area = split[0];
            } else {
              area = document.querySelector(
                "div.offer__info-item[data-name='live.square'] div.offer__advert-short-info"
              ).innerText;
            }
          } catch (e) {
            area = null;
          }
          return area;
        });

        let residentialComplex = await page.evaluate(async () => {
          let residentialComplex;
          try {
            residentialComplex = document.querySelector(
              "div.offer__info-item[data-name='map.complex'] div.offer__advert-short-info a"
            ).innerText;
          } catch (e) {
            residentialComplex = null;
          }
          return residentialComplex;
        });

        let floor = await page.evaluate(async () => {
          let floor;
          try {
            floor = document.querySelector(
              "div.offer__info-item[data-name='flat.floor'] div.offer__advert-short-info"
            ).innerText;
            if (
              document
                .querySelector(
                  "div.offer__info-item[data-name='flat.floor'] div.offer__advert-short-info"
                )
                .textContent.includes("из")
            ) {
              let floorSplit = floor.split(" ");
              floor = floorSplit[0];
            } else {
              floor = document.querySelector(
                "div.offer__info-item[data-name='flat.floor'] div.offer__advert-short-info"
              ).innerText;
            }
          } catch (e) {
            floor = null;
          }
          return floor;
        });
        let totalFloor = await page.evaluate(async () => {
          let totalFloor;
          try {
            totalFloor = document.querySelector(
              "div.offer__info-item[data-name='flat.floor'] div.offer__advert-short-info"
            ).innerText;
            if (
              document
                .querySelector(
                  "div.offer__info-item[data-name='flat.floor'] div.offer__advert-short-info"
                )
                .textContent.includes("из")
            ) {
              let floorSplit = totalFloor.split(" ");
              totalFloor = floorSplit[floorSplit.length - 1];
            } else {
              totalFloor = null;
            }
          } catch (e) {
            totalFloor = null;
          }
          return totalFloor;
        });

        let toilet = await page.evaluate(async () => {
          let toilet;
          try {
            toilet = document.querySelector(
              "div.offer__info-item[data-name='flat.toilet'] div.offer__advert-short-info"
            ).innerText;
          } catch (e) {
            toilet = null;
          }
          return toilet;
        });

        let ceiling = await page.evaluate(async () => {
          let ceiling;
          try {
            ceiling = document.querySelector(
              "div.offer__info-item[data-name='ceiling'] div.offer__advert-short-info"
            ).innerText;
          } catch (e) {
            ceiling = null;
          }
          return ceiling;
        });

        let balcony = await page.evaluate(async () => {
          let balcony;
          try {
            balcony = document.querySelector(
              "div.offer__info-item[data-name='flat.balcony'] div.offer__advert-short-info"
            ).innerText;
          } catch (e) {
            balcony = null;
          }
          return balcony;
        });
        let isBalconyGlazed = await page.evaluate(async () => {
          let isBalconyGlazed;
          try {
            isBalconyGlazed = document.querySelector(
              "div.offer__info-item[data-name='balcony_g'] div.offer__advert-short-info"
            ).innerText;
          } catch (e) {
            isBalconyGlazed = null;
          }
          return isBalconyGlazed;
        });

        let flatRenovation = await page.evaluate(async () => {
          let flatRenovation;
          try {
            flatRenovation = document.querySelector(
              "div.offer__info-item[data-name='flat.renovation'] div.offer__advert-short-info"
            ).innerText;
          } catch (e) {
            flatRenovation = null;
          }
          return flatRenovation;
        });

        let OwnersName = await page.evaluate(async () => {
          let OwnersName;
          try {
            OwnersName =
              document.querySelector(
                "div.offer__sidebar-contacts div.owners__name"
              ).innerText != "Хозяин недвижимости"
                ? document.querySelector(
                    "div.offer__sidebar-contacts div.owners__name"
                  ).innerText
                : null;
          } catch (e) {
            OwnersName = null;
          }
          return OwnersName;
        });

        let isRealtor = await page.evaluate(async () => {
          let isRealtor;
          try {
            isRealtor =
              document.querySelector(
                "div.offer__sidebar-contacts div.owners__name"
              ).innerText != "Хозяин недвижимости"
                ? true
                : false;
          } catch (e) {
            isRealtor = null;
          }
          return isRealtor;
        });

        html[i]["city"] = city;
        html[i]["title"] = title;
        html[i]["isBalconyGlazed"] = isBalconyGlazed;
        html[i]["ceiling"] = ceiling;
        html[i]["flatRenovation"] = flatRenovation;
        html[i]["houseType"] = houseType;
        html[i]["year"] = year;
        html[i]["balcony"] = balcony;
        html[i]["toilet"] = toilet;
        html[i]["residentialComplex"] = residentialComplex;
        html[i]["floor"] = floor;
        html[i]["totalFloor"] = totalFloor;
        html[i]["area"] = area;
        html[i]["owner"] = OwnersName;
        html[i]["isRealtor"] = isRealtor;
      }
    }

    await browser.close();

    res = res.flat();

    fs.writeFile("data.json", JSON.stringify({ data: res }), (err) => {
      if (err) throw err;
    });
  } catch (e) {
    console.log(e);
    await browser.close();
  }
})();
