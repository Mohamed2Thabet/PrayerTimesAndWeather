import { useEffect, useState, useMemo } from "react";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import SelectComponent from "./SelectComponent";
import { fetchCountries, fetchPrayerTimes } from "../utils/api";
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../utils/storage";
import moment from "moment";
import "moment/dist/locale/ar-dz";
import DataAndTime from "./DataAndTime";

moment.locale("ar");

export default function MainContent() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    getFromLocalStorage("selectedCountry") || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    getFromLocalStorage("selectedCity") || ""
  );
  const [prayerTimes, setPrayerTimes] = useState(
    getFromLocalStorage("prayerTimes")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
  const [nextPrayerName, setNextPrayerName] = useState("");
  const [nextPrayerTime, setNextPrayerTime] = useState("");

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
        if (selectedCountry) {
          const countryData = data.find((c) => c.country === selectedCountry);
          setCities(countryData ? countryData.cities : []);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    loadCountries();

    const interval = setInterval(() => {
      setTime(moment().format("YYYY-MM-DD HH:mm:ss"));
      setupCountdownTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedCountry, selectedCity, prayerTimes]);

  useEffect(() => {
    if (selectedCountry && selectedCity) {
      handleFetchPrayerTimes(selectedCity, selectedCountry);
    }
  }, [selectedCountry, selectedCity]);

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedCity("");
    setPrayerTimes(null);
    saveToLocalStorage("selectedCountry", country);
    removeFromLocalStorage("selectedCity");
    removeFromLocalStorage("prayerTimes");

    const countryData = countries.find((c) => c.country === country);
    setCities(countryData ? countryData.cities : []);
  };

  const handleCityChange = async (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    handleFetchPrayerTimes(city, selectedCountry);
  };

  const handleFetchPrayerTimes = async (city, country) => {
    setLoading(true);
    setError(false);
    try {
      const timings = await fetchPrayerTimes(city, country);
      setPrayerTimes(timings);
      saveToLocalStorage("selectedCity", city);
      saveToLocalStorage("prayerTimes", timings);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      setError(true);
    }
    setLoading(false);
  };

  const setupCountdownTimer = () => {
    if (!prayerTimes) return;

    const now = moment();
    const prayerTimesArray = [
      { name: "Fajr", time: moment(prayerTimes.Fajr, "HH:mm") },
      { name: "Dhuhr", time: moment(prayerTimes.Dhuhr, "HH:mm") },
      { name: "Asr", time: moment(prayerTimes.Asr, "HH:mm") },
      { name: "Maghrib", time: moment(prayerTimes.Maghrib, "HH:mm") },
      { name: "Isha", time: moment(prayerTimes.Isha, "HH:mm") },
    ];

    let nextPrayer = null;

    for (let prayer of prayerTimesArray) {
      if (now.isBefore(prayer.time)) {
        nextPrayer = prayer;
        break;
      }
    }

    if (!nextPrayer) {
      nextPrayer = prayerTimesArray[0]; // إذا انتهت الصلوات نبدأ من الفجر
    }

    const diff = moment.duration(nextPrayer.time.diff(now));

    setNextPrayerName(nextPrayer.name);
    setNextPrayerTime(
      `${diff.hours()} : ${diff.minutes()} : ${diff.seconds()} `
    );
  };

  const prayers = useMemo(
    () =>
      prayerTimes
        ? [
            {
              id: 1,
              name: "Fajr",
              time: prayerTimes.Fajr,
              image:
                "https://www.ancient-origins.net/sites/default/files/field/image/mosques.jpg",
            },
            {
              id: 2,
              name: "Dhuhr",
              time: prayerTimes.Dhuhr,
              image:
                "https://www.ancient-origins.net/sites/default/files/field/image/mosques.jpg",
            },
            {
              id: 3,
              name: "Asr",
              time: prayerTimes.Asr,
              image:
                "https://www.ancient-origins.net/sites/default/files/field/image/mosques.jpg",
            },
            {
              id: 4,
              name: "Maghrib",
              time: prayerTimes.Maghrib,
              image:
                "https://www.ancient-origins.net/sites/default/files/field/image/mosques.jpg",
            },
            {
              id: 5,
              name: "Isha",
              time: prayerTimes.Isha,
              image:
                "https://www.ancient-origins.net/sites/default/files/field/image/mosques.jpg",
            },
          ]
        : [],
    [prayerTimes]
  );

  return (
    <section>
      <Stack spacing={3} alignItems="center">
        <SelectComponent
          label="Select Country"
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countries.map((c) => c.country)}
        />
        <SelectComponent
          label="Select City"
          value={selectedCity}
          onChange={handleCityChange}
          options={cities}
          disabled={!selectedCountry}
        />

        {loading && <h3>⏳ Loading prayer times...</h3>}
        {error && <h3 style={{ color: "red" }}>❌ Error fetching data</h3>}
        {prayerTimes && !loading && !error && (
          <div>
            <DataAndTime
              time={time}
              selectedCountry={selectedCountry}
              selectedCity={selectedCity}
              nextPrayerTime={nextPrayerTime}
              nextPrayerName={nextPrayerName}
            />
            <h3 style={{ color: "green" }}></h3>
            <Stack justifyContent="space-around" direction="row" gap={2}>
              {prayers.map((prayer) => (
                <Prayer key={prayer.id} prayer={prayer} />
              ))}
            </Stack>
          </div>
        )}
      </Stack>
    </section>
  );
}
