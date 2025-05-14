/* eslint-disable react/prop-types */
import Grid from "@mui/material/Grid2";

export default function DataAndTime({
  selectedCity,
  selectedCountry,
  time,
  nextPrayerName,
  nextPrayerTime,
}) {
  return (
    <Grid container justifyContent={"space-between"} alignItems={"center"}>
      <Grid xs={6}>
        <div>
          <h2>
            <span>Time and date</span> {time}
          </h2>
          <h1>
            <span>Country </span>
            {selectedCountry}
            <span> in City</span>
            {selectedCity}
          </h1>
        </div>
      </Grid>

      <Grid xs={6}>
        <div>
          <h1>Time left for  {nextPrayerName} prayer</h1>
          <h1>{nextPrayerTime}</h1>
        </div>
      </Grid>
    </Grid>
  );
}
