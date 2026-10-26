import "./style.css";

const apiKey = "M5TXMYXW3QAU8MU2TMXK6LXA5";
let usingMetric = false;

let thisData;
const formElement = document.querySelector("form");
formElement?.addEventListener("submit", (e) => {
  e.preventDefault();
  thisData = Object.fromEntries(new FormData(formElement));
  // data = {city: "London", region: "UK"}
  renderAll();
});

async function getFormJSON() {
  // data in JSON
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${thisData.city},${thisData.region}?key=${apiKey}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (e) {
    console.error(`Weather fetch failed with error ${e}`);
    return null;
  }
}

async function renderAll() {
  const dataJSON = await getFormJSON();
  console.log(dataJSON);

  // Delete all old City & Weather Info
  document.querySelector(".weather-info").innerHTML = "";

  // All of City Information
  document.querySelector(".latitude").innerHTML =
    `Latitude: <b>${dataJSON.latitude}</b>`;
  document.querySelector(".longitude").innerHTML =
    `Longitude: <b>${dataJSON.longitude}</b>`;
  document.querySelector(".address").innerHTML =
    `Address: <b>${dataJSON.resolvedAddress}</b>`;
  document.querySelector(".timezone").innerHTML =
    `Time zone: <b>${dataJSON.timezone}</b>`;
  document.querySelector(".utc-offset").innerHTML =
    `UTC offset: <b>${dataJSON.tzoffset}</b>`;

  document.querySelector(".city-info").style.display = "flex";

  // All of City Days
  for (const day of dataJSON.days) {
    const weatherTempClone = document
      .getElementById("initial-template")
      ?.content.cloneNode(true);

    weatherTempClone.querySelector(".datetime").innerHTML = `${day.datetime}`;
    weatherTempClone.querySelector(".tempmin").innerHTML =
      `Min: <b>${usingMetric ? (((day.tempmin - 32) * 5) / 9).toFixed(3) : day.tempmin} ${usingMetric ? "C" : "F"}</b>`;
    weatherTempClone.querySelector(".temp").innerHTML =
      `Mean: <b>${usingMetric ? (((day.temp - 32) * 5) / 9).toFixed(3) : day.temp} ${usingMetric ? "C" : "F"}</b>`;
    weatherTempClone.querySelector(".tempmax").innerHTML =
      `Max: <b>${usingMetric ? (((day.tempmax - 32) * 5) / 9).toFixed(3) : day.tempmax} ${usingMetric ? "C" : "F"}</b>`;
    weatherTempClone.querySelector(".sunrise").innerHTML =
      `Sunrise: <b>${day.sunrise}</b>`;
    weatherTempClone.querySelector(".sunset").innerHTML =
      `Sunset: <b>${day.sunset}</b>`;
    weatherTempClone.querySelector(".humidity").innerHTML =
      `Humidity: <b>${day.humidity}%</b>`;
    weatherTempClone.querySelector(".precip").innerHTML =
      `Precipitation: <b>${usingMetric ? day.precip * 25.4 : day.precip} ${usingMetric ? "mm" : "in"}</b>`;
    weatherTempClone.querySelector(".windspeed").innerHTML =
      `Windspeed: <b>${usingMetric ? (day.windspeed * 1.60934).toFixed(3) : day.windspeed} ${usingMetric ? "kph" : "mph"}</b>`;
    weatherTempClone.querySelector(".pressure").innerHTML =
      `Pressure: <b>${day.pressure} hPa</b>`;
    weatherTempClone.querySelector(".cloudcover").innerHTML =
      `Cloudcover: <b>${day.cloudcover}%</b>`;
    weatherTempClone.querySelector(".conditions").innerHTML =
      `Conditions: <b>${day.conditions}</b>`;

    document.querySelector(".weather-info")?.appendChild(weatherTempClone);
  }
}

document.querySelector(".use-metric")?.addEventListener("change", () => {
  usingMetric = !usingMetric;
  renderAll();
});
