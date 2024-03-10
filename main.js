const searchForm = document.getElementById("search-form");
const searchButton = document.getElementById("search-btn");
const fieldIpAddress = document.getElementById("field-ip-address");
const fieldLocation = document.getElementById("field-location");
const fieldTimezone = document.getElementById("field-timezone");
const fieldISP = document.getElementById("field-isp");
const initialIpAddress = "192.212.174.101";
const customIcon = new L.icon({
  iconUrl: "./public/icons/icon-location.svg",
  iconSize: [36, 46],
  iconAnchor: [18, 46],
});
var map = L.map("map", { zoomControl: false, attributionControl: false }).setView([0, 0], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

async function getIpAddress(ipAddress) {
  const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_34XaYYBGYfYfaTgMITBVmdjr7ZLhP&ipAddress=${ipAddress}`, {
    method: "get",
  });
  return await response.json();
}

function updateResult(result) {
  const { ip, location, as, isp } = result;
  const { country, region, timezone, lat, lng } = location;
  const { asn } = as;

  searchForm.value = ip;

  fieldIpAddress.innerText = ip;
  fieldLocation.innerText = `${region}, ${country} ${asn}`;
  fieldTimezone.innerText = `UTC ${timezone}`;
  fieldISP.innerText = isp;

  map.panTo(new L.LatLng(lat, lng));
  L.marker([lat, lng], { icon: customIcon }).addTo(map);
}

document.addEventListener("DOMContentLoaded", async function (e) {
  const result = await getIpAddress(initialIpAddress);
  updateResult(result);
});

searchButton.addEventListener("click", async function (e) {
  const searchFormValue = searchForm.value;

  // clear field
  fieldIpAddress.innerText = "...";
  fieldLocation.innerText = "...";
  fieldTimezone.innerText = "...";
  fieldISP.innerText = "...";

  const result = await getIpAddress(searchFormValue);
  updateResult(result);
});
