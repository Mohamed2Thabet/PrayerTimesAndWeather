/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

export default function Prayer({prayer}) {
  return (
    <Card sx={{ maxWidth: 345 }} style={{ marginTop: "10px" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          maxWidth={"20px"}
          image={prayer.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {prayer.name}
          </Typography>
          <Typography variant="h2" sx={{ color: "text.secondary" }}>
            {prayer.time}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
