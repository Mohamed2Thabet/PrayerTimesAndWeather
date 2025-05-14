# Prayer Times App

A modern, responsive web application for checking prayer times and weather information based on location. Built with React, Material-UI, and powered by various APIs.

![Prayer Times App Screenshot](screenshot.png)

## Features

- 🌍 Country and City Selection
- 🕌 Accurate Prayer Times
- ⛅ Weather Information
- 🌙 Dark Theme
- 📱 Responsive Design
- ⚡ Real-time Updates
- 🔔 Prayer Time Notifications
- ⚙️ Customizable Settings

## Technologies Used

- React 18
- Vite
- Material-UI
- Styled Components
- Framer Motion
- React Router
- Axios

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/prayer-times.git
   cd prayer-times
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_WEATHER_API_KEY=your_openweather_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Configuration

### Prayer Times Calculation Methods

The app supports multiple calculation methods:

1. Muslim World League
2. Islamic Society of North America
3. Egyptian General Authority
4. Umm al-Qura University, Makkah
5. University of Islamic Sciences, Karachi

You can change the calculation method in the Settings page.

### Weather Information

Weather data is provided by OpenWeather API. Make sure to:

1. Sign up at [OpenWeather](https://openweathermap.org/api)
2. Get your API key
3. Add it to your `.env` file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Prayer times data provided by [Aladhan API](https://aladhan.com/prayer-times-api)
- Weather data provided by [OpenWeather API](https://openweathermap.org/api)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
