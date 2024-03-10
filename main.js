import { isIP } from "is-ip";
const searchForm = document.getElementById("search-form");
const searchButton = document.getElementById("search-btn");
const fieldIpAddress = document.getElementById("field-ip-address");
const fieldLocation = document.getElementById("field-location");
const fieldTimezone = document.getElementById("field-timezone");
const fieldISP = document.getElementById("field-isp");
const arrowIcon = document.querySelector(".arrow-icon");
const loadingIcon = document.querySelector(".loading-icon");
const customIcon = new L.icon({
  iconUrl: "./public/icons/icon-location.svg",
  iconSize: [36, 46],
  iconAnchor: [18, 46],
});

var map = L.map("map", { zoomControl: false, attributionControl: false }).setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

async function getIpAddress(ipAddress) {
  // const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_34XaYYBGYfYfaTgMITBVmdjr7ZLhP&ipAddress=${ipAddress}`, {
  //   method: "get",
  // });
  const response = await fetch(`http://ip-api.com/json/${ipAddress}`, {
    method: "get",
  });
  return await response.json();
}

function onLoading() {
  arrowIcon.classList.toggle("hidden");
  if (arrowIcon.classList.contains("hidden")) {
    searchForm.disabled = true;
  } else {
    searchForm.disabled = false;
  }
  loadingIcon.classList.toggle("hidden");
}

function updateResult(result) {
  const { country, regionName, city, zip, timezone, isp, query, lat, lon } = result;

  searchForm.value = query;

  fieldIpAddress.innerText = query;
  fieldLocation.innerText = `${city}, ${regionName}, ${country} ${zip}`;
  fieldTimezone.innerText = timezone;
  fieldISP.innerText = isp;

  map.panTo(new L.LatLng(lat, lon));
  L.marker([lat, lon], { icon: customIcon }).addTo(map);
}

searchButton.addEventListener("click", async function (e) {
  onLoading();

  const searchFormValue = searchForm.value;
  const isValid = isIP(searchFormValue);
  if (!isValid) {
    alert("This IP Address is not valid, please try other");
    return;
  }

  // clear field
  fieldIpAddress.innerText = "...";
  fieldLocation.innerText = "...";
  fieldTimezone.innerText = "...";
  fieldISP.innerText = "...";

  const result = await getIpAddress(searchFormValue);
  updateResult(result);

  onLoading();
});

// {
//   "status": "success",
//   "country": "Indonesia",
//   "countryCode": "ID",
//   "region": "JT",
//   "regionName": "Central Java",
//   "city": "Gejagan",
//   "zip": "",
//   "lat": -7.48413,
//   "lon": 110.25,
//   "timezone": "Asia/Jakarta",
//   "isp": "PT Juragan Lintas Data",
//   "org": "PT Juragan Lintas Data",
//   "as": "AS149975 PT Juragan Lintas Data",
//   "query": "103.35.219.10"
// }
