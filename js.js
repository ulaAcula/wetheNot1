const form = document.querySelector(".find-forecast");
const api = "93b77cbddd23a0c336ed147fac179da8";

const getDate = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
function lack(a) {
  const hourAndTime = document.querySelector(".hourAndTime");
  if (a.length == 3) {
    hourAndTime.classList.add("lack2");
  } else if (a.length == 4) {
    hourAndTime.classList.add("lack1");
  } else if (a.length == 2) {
    hourAndTime.classList.add("lack3");
  } else if (a.length == 5) {
    hourAndTime.classList.add("lack");
  } else {
    hourAndTime.classList.remove("lack2");
    hourAndTime.classList.remove("lack1");
    hourAndTime.classList.remove("lack3");
    hourAndTime.classList.remove("lack");

    console.log("no");
  }
}
const getCard = async () => {
  const city = document.getElementById("fname").value;
  const historyUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api}&units=metric`;

  const Historydata = await getDate(historyUrl);

  const list = Historydata.list;
  const filterOfhistory = list.filter(
    (item) => item.dt_txt.slice(11, 13) == "21" && item
  );
  console.log(filterOfhistory);

  const cardOfWeek = document.querySelectorAll(".cardOfWeek");

  for (let i = 0; i < filterOfhistory.length; i++) {
    const situationWeather = filterOfhistory[i].weather[0].description;

    const splitted = situationWeather.split("");

    const first = splitted[0].toUpperCase();

    const rest = [...splitted];

    rest.splice(0, 1);

    const result = [first, ...rest].join("");

    cardOfWeek[i].innerHTML = `
  <h4>${getNextDayOfWeek(i)}</h4>
  <span>${showTomorrowDate(i + 1)}</span>
  <img class="cloudy" src="${determineW(
    filterOfhistory[i].weather[0].main
  )}" alt="">
  
  
  <span class="degree">${Math.floor(filterOfhistory[i].main.temp)}°C</span>
  <span class="warm">${result}</span>`;
  }
  // const cardOfWeek = document.querySelectorAll(".cardOfWeek");

  for (let i = 0; i < cardOfWeek.length; i++) {
    if (i > cardOfWeek.length) {
      i = 0;
    }
    cardOfWeek[i].addEventListener("click", () => {
      cardOfWeek.forEach((card) => {
        card.classList.remove("white");
      });

      setTimeout(() => {
        cardOfWeek[i].classList.add("white");
      }, 100);
    });
  }
  console.log(list);
  cardOfWeek.forEach((card) => {
    card.addEventListener("click", () => {
      const curentdata = card.children[1].textContent.slice(4, 6);
      console.log(card.children[1]);
      const endfilter = list
        .filter((item) => {
          const hour = item.dt_txt.slice(8, 10);
          return hour === curentdata;
        })
        .slice(2, 8);
      lack(endfilter);
      showIn(endfilter);
    });
  });
};

const info = async (e) => {
  const city = document.getElementById("fname").value;

  const findURl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
  const historyUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api}&units=metric`;

  const data = await getDate(findURl);
  const Historydata = await getDate(historyUrl);
  console.log(data);
  console.log(Historydata);
  console.log(Historydata.cod);
  if (Historydata.cod == "404") {
    const eroe = document.querySelector(".info-everything");
    eroe.classList.remove("flex");
    eroe.classList.add("none");
    console.log("yes");
    const E404 = document.querySelector(".E404");
    E404.classList.remove("none");
    E404.classList.add("flex");
  } else {
    const eroe = document.querySelector(".info-everything");
    eroe.classList.remove("none");
    eroe.classList.add("flex");
    const E404 = document.querySelector(".E404");
    E404.classList.remove("flex");
    E404.classList.add("none");
  }
  const randomCity = document.querySelector(".randomCity").children;
  const cityNames = [];

  async function getRandomCitiesWeather(i) {
    const lat = data.coord.lat + i + i;
    const lon = data.coord.lon + i + i + 9;
    const placer = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=metric`;

    const getState = await getDate(placer);

    return {
      name: getState.name,
      temperature: getState.main.temp,
      describe: getState.weather[0].main,
    };
  }

  const promises = [];

  for (let i = 0; i < randomCity.length; i++) {
    const promise = getRandomCitiesWeather(i)
      .then((name) => {
        cityNames.push(name);
      })
      .catch((error) => {
        console.log(error);
      });

    promises.push(promise);
  }

  Promise.all(promises)
    .then(() => {
      for (let i = 0; i < cityNames.length; i++) {
        const getCity = async () => {
          const cardOfCity = document.querySelectorAll(".cardOfCity");
          cardOfCity[i].innerHTML = `<span>${cityNames[i].name} </span>
    <div>
    <img class="cloudy" src="${determineW(cityNames[i].describe)}" alt="">
      <span class="digit">${Math.floor(cityNames[i].temperature)}°С</span>
    </div>`;
        };
        getCity();
      }
    })

    .catch((error) => {
      console.log(error);
    });

  console.log(cityNames);

  const list = Historydata.list;
  const filterOfhistory = list.filter(
    (item) => item.dt_txt.slice(8, 10) == todayDate() && item
  );
  const endfilter = filterOfhistory.filter((item) => {
    const hour = item.dt_txt.slice(11, 13);
    return (
      hour === "21" ||
      hour === "06" ||
      hour === "09" ||
      hour === "12" ||
      hour === "15" ||
      hour === "18"
    );
  });
  console.log(data);
  console.log(endfilter);
  const now = document.querySelector(".now");
  now.innerHTML = `<h2>Current-weather</h2>
<span class="data">${getdDate()}</span>`;
  const infoToday = document.querySelector(".info-today");
  infoToday.innerHTML = `<div class="curent-sit">
<img class="cloudy" src="${determineW(data.weather[0].main)}" alt="">
<span class="curent-dOn">${data.weather[0].main}</span>
</div>
<div class="temp">
<span class="real-temp">${Math.floor(data.main.temp)}°C</span>
<span class="feel-like">Real feel like ${Math.floor(
    data.main.feels_like
  )} </span>
</div>
<div class="rise-downSite">
<div class="comn Sunrise">
  <span>Sunrise:</span><span class="time">${convertTimeToDate(
    data.sys.sunrise
  )}</span
  ><span class="am">am</span>
</div>
<div class="comn Sunset">
  <span>Sunset:</span><span class="time">${convertTo12HourFormat(
    convertTimeToDate(data.sys.sunset)
  )}</span
  ><span class="am">pm</span>
</div>
<div class="comn Duration">
  <span>Duration:</span><span class="time">${convertTimeToDate(
    getDuration(data.sys.sunrise, data.sys.sunset)
  )}</span
  ><span class="am">hr</span>
</div>
</div>`;

  showIn(endfilter);
  getCard();
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    info();
  } catch (error) {
    const eroe = document.querySelector(".info-everything");
    eroe.classList.remove(".flex");
    eroe.classList.add(".none");

    const E404 = document.querySelector(".E404");
    E404.classList.remove(".none");
    E404.classList.add(".flex");
  }
});
window.onload = async function () {
  try {
    const findURl = `http://api.openweathermap.org/data/2.5/weather?q=${"samarkand"}&appid=${api}&units=metric`;
    const historyUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${"samarkand"}&appid=${api}&units=metric`;

    const data = await getDate(findURl);
    const Historydata = await getDate(historyUrl);
    const list = Historydata.list;
    const filterOfhistory = list.filter(
      (item) => item.dt_txt.slice(8, 10) == todayDate() && item
    );
    const endfilter = filterOfhistory.filter((item) => {
      const hour = item.dt_txt.slice(11, 13);
      return (
        hour === "21" ||
        hour === "06" ||
        hour === "09" ||
        hour === "12" ||
        hour === "15" ||
        hour === "18"
      );
    });
    console.log(data);
    console.log(endfilter);
    const now = document.querySelector(".now");
    now.innerHTML = `<h2>Current-weather</h2>
    <span class="data">${getdDate()}</span>`;
    const infoToday = document.querySelector(".info-today");
    infoToday.innerHTML = `<div class="curent-sit">
    <img class="cloudy" src="${determineW(data.weather[0].main)}" alt="">
    <span class="curent-dOn">${data.weather[0].main}</span>
    </div>
    <div class="temp">
    <span class="real-temp">${Math.floor(data.main.temp)}°C</span>
    <span class="feel-like">Real feel like ${Math.floor(
      data.main.feels_like
    )} </span>
    </div>
    <div class="rise-downSite">
    <div class="comn Sunrise">
      <span>Sunrise:</span><span class="time">${convertTimeToDate(
        data.sys.sunrise
      )}</span
      ><span class="am">am</span>
    </div>
    <div class="comn Sunset">
      <span>Sunset:</span><span class="time">${convertTo12HourFormat(
        convertTimeToDate(data.sys.sunset)
      )}</span
      ><span class="am">pm</span>
    </div>
    <div class="comn Duration">
      <span>Duration:</span><span class="time">${convertTimeToDate(
        getDuration(data.sys.sunrise, data.sys.sunset)
      )}</span
      ><span class="am">hr</span>
    </div>
    </div>`;
    showIn(endfilter);
    const randomCity = document.querySelector(".randomCity").children;
    const cityNames = [];

    async function getRandomCitiesWeather(i) {
      const lat = data.coord.lat + i + i;
      const lon = data.coord.lon + i + i + 9;
      const placer = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=metric`;

      const getState = await getDate(placer);

      return {
        name: getState.name,
        temperature: getState.main.temp,
        describe: getState.weather[0].main,
      };
    }

    const promises = [];

    for (let i = 0; i < randomCity.length; i++) {
      const promise = getRandomCitiesWeather(i)
        .then((name) => {
          cityNames.push(name);
        })
        .catch((error) => {
          console.log(error);
        });

      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        for (let i = 0; i < cityNames.length; i++) {
          const getCity = async () => {
            const cardOfCity = document.querySelectorAll(".cardOfCity");

            cardOfCity[i].innerHTML = `<span>${cityNames[i].name} </span>
        <div>
        <img class="cloudy" src="${determineW(cityNames[i].describe)}" alt="">
          <span class="digit">${Math.floor(cityNames[i].temperature)}°С</span>
        </div>`;
          };
          getCity();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    const eroe = document.querySelector(".info-everything");
    eroe.style.display = "none";
    const E404 = document.querySelector(".E404");
    E404.style.display = "flex";
  }
};

const switchtoday = document.querySelector(".switch-today");
const activated = document.querySelector(".activated");

activated.addEventListener("click", async (e) => {
  const hourAndTime = document.querySelector(".hourAndTime");
  const hourAndTimeExept = hourAndTime.classList[1];
  console.log(hourAndTimeExept);
  hourAndTime.classList.remove(hourAndTimeExept);
  const nowtoday = document.querySelector(".now-today");
  nowtoday.classList.remove("none");
  nowtoday.classList.add("flex");

  const switchbetweenday = document.querySelector(".switch-between-day");
  switchbetweenday.classList.remove("flex");
  switchbetweenday.classList.add("none");
  const activated = document.querySelector(".activated");
  const activated2 = document.querySelector(".activated2");
  activated2.classList.remove(`active`);
  activated.classList.add("active");
  const historyUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${"samarkand"}&appid=${api}&units=metric`;
  const Historydata = await getDate(historyUrl);
  const list = Historydata.list;
  const filterOfhistory = list.filter(
    (item) => item.dt_txt.slice(8, 10) == todayDate() && item
  );
  const endfilter = filterOfhistory.filter((item) => {
    const hour = item.dt_txt.slice(11, 13);
    return (
      hour === "21" ||
      hour === "06" ||
      hour === "09" ||
      hour === "12" ||
      hour === "15" ||
      hour === "18"
    );
  });

  info(endfilter);
});
const switchfiveDay = document.querySelector(".switch-fiveDay");
const activated2 = document.querySelector(".activated2");

activated2.addEventListener("click", async (e) => {
  const nowtoday = document.querySelector(".now-today");
  nowtoday.classList.remove("flex");
  nowtoday.classList.add("none");

  const switchbetweenday = document.querySelector(".switch-between-day");
  switchbetweenday.classList.remove("none");
  switchbetweenday.classList.add("flex");
  const activated = document.querySelector(".activated2");
  const activated2 = document.querySelector(".activated");
  activated2.classList.remove(`active`);
  activated.classList.add("active");

  getCard();
});
const cardOfCity = document.querySelectorAll(".cardOfCity");
cardOfCity.forEach((card) => {
  card.addEventListener("click", () => {
    const cardOfWeek = document.querySelectorAll(".cardOfWeek ");
    const hourAndTime = document.querySelector(".hourAndTime");
    for (let i = 1; i < 4; i++) {
      if (
        hourAndTime.classList.contains("lack") ||
        hourAndTime.classList.contains(`lack${i}`)
      ) {
        hourAndTime.classList.remove("lack") ||
          hourAndTime.classList.remove(`lack${i}`);
      }
    }
    cardOfWeek.forEach((card) => {
      if (card.classList.contains("white")) {
        card.classList.remove("white");
      }
    });
    cardOfWeek[0].classList.add("whit");
    const city = document.getElementById("fname");
    const nearCity = card.children[0].textContent;

    city.value = nearCity.trim();

    info();
  });
});
function getNextDayOfWeek(a) {
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let today = new Date();
  let currentDayOfWeek = today.getDay();
  let nextDayOfWeek = (currentDayOfWeek + a) % 7;

  if (nextDayOfWeek < 0) {
    nextDayOfWeek += 7;
  }

  return daysOfWeek[nextDayOfWeek];
}
function showTomorrowDate(a) {
  let today = new Date();

  let tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + a);

  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let month = monthNames[tomorrow.getMonth()];

  let date = tomorrow.getDate();

  date = ("0" + date).slice(-2);

  let formattedDate = month + " " + date;

  return formattedDate;
}
function getdDate() {
  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let formattedDate =
    (day < 10 ? "0" : "") +
    day +
    "." +
    (month < 10 ? "0" : "") +
    month +
    "." +
    year;
  return formattedDate;
}
function determineW(weather) {
  let img;
  if (weather === "Clouds") {
    img = "https://pogoda.uz/images/icons/cloudy.png";
  } else if (weather === "Clear") {
    img = "https://pogoda.uz/images/icons/clear.png";
  } else if (weather === "Rain") {
    img = "https://pogoda.uz/images/icons/rain.png";
  } else if (weather === "Thunderstorm") {
    img = `./img/pngtree-thunderstorm-weather-lightning-clip-art-png-image_2734752.jpg`;
  } else if (weather === "Snow") {
    img = `https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Weather-snow.svg/1024px-Weather-snow.svg.png`;
  }

  return img;
}

function convertTimeToDate(time) {
  const date = new Date(time * 1000);

  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${hour}:${minute}`;
}
function convertTo12HourFormat(time) {
  let timeParts = time.split(":");
  let hours = timeParts[0];
  let minutes = timeParts[1];

  let formattedTime =
    (hours % 12 || 12) + ":" + (minutes < 10 ? "0" : "") + minutes;

  return formattedTime;
}
function getDuration(sunrise, sunset) {
  let duration = sunrise - sunset;

  return duration;
}
function todayDate() {
  let today = new Date();
  let day = today.getDate() + 1;
  let month = today.getMonth() + 1;
  let year = today.getFullYear();

  if (day > new Date(year, month, 0).getDate()) {
    day = 1;
    month += 1;

    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  let formattedDay = day > 9 ? day : "0" + day;
  let formattedMonth = month > 9 ? month : "0" + month;
  let formattedDate = year + "-" + formattedMonth + "-" + formattedDay;

  return formattedDay;
}
function convertToAMPM(hour) {
  if (hour >= 0 && hour <= 11) {
    return hour + " AM";
  } else if (hour == 12) {
    return hour + " AM";
  } else {
    return hour - 12 + " PM";
  }
}

function showIn(endfilter) {
  const hourAndTime = document.querySelector(".hourAndTime");
  hourAndTime.innerHTML = ``;
  let h3today = document.createElement("h3");
  h3today.classList.add(`h3-today`);
  h3today.innerHTML = `Today`;
  hourAndTime.appendChild(h3today);
  for (i = 0; i < endfilter.length; i++) {
    let span = document.createElement("span");
    span.innerHTML = convertToAMPM(endfilter[i].dt_txt.slice(11, 13));
    hourAndTime.appendChild(span);
  }
  for (let i = 0; i < endfilter.length; i++) {
    let img = document.createElement("img");
    const det = determineW(endfilter[i].weather[0].main);
    img.src = det;
    hourAndTime.appendChild(img);
  }
  let h3forecast = document.createElement("h3");
  h3forecast.classList.add("gray", "underline");
  h3forecast.innerHTML = `Forecast`;
  hourAndTime.appendChild(h3forecast);
  for (let i = 0; i < endfilter.length; i++) {
    let span = document.createElement("span");
    span.innerHTML = endfilter[i].weather[0].main;
    span.classList.add("gray", "underline");
    hourAndTime.appendChild(span);
  }
  let h3temp = document.createElement("h3");
  h3temp.classList.add("gray", "underline");
  h3temp.innerHTML = `Temp(c°)`;
  hourAndTime.appendChild(h3temp);
  for (i = 0; i < endfilter.length; i++) {
    let span = document.createElement("span");
    span.classList.add("gray", "underline");
    span.innerHTML = Math.floor(endfilter[i].main.temp) + `°`;
    hourAndTime.appendChild(span);
  }
  let h3feel = document.createElement("h3");
  h3feel.classList.add("gray", "underline");
  h3feel.innerHTML = `Real Feal`;
  hourAndTime.appendChild(h3feel);
  for (i = 0; i < endfilter.length; i++) {
    let span = document.createElement("span");
    span.classList.add("gray", "underline");
    span.innerHTML = Math.floor(endfilter[i].main.feels_like) + `°`;
    hourAndTime.appendChild(span);
  }
  let speed = document.createElement("h3");
  speed.innerHTML = `Wind(speed/deg)`;
  hourAndTime.appendChild(speed);
  for (i = 0; i < endfilter.length; i++) {
    let span = document.createElement("span");
    span.innerHTML =
      Math.floor(endfilter[i].wind.speed) +
      `/` +
      Math.floor(endfilter[i].wind.deg);
    hourAndTime.appendChild(span);
  }
}
