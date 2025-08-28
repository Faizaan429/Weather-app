# Weather Dashboard 🌤️

A clean and simple web application that provides real-time weather data and a 5-day forecast for cities worldwide. This project uses the OpenWeatherMap API to fetch weather information and displays it in a user-friendly interface.

---

## Features

-   **Current Weather:** Displays the current temperature, condition, humidity, and wind speed.
-   **5-Day Forecast:** Shows a 5-day weather forecast with temperature and conditions for each day.
-   **City Search:** Users can search for any city to get its weather information.
-   **Geolocation:** Automatically detects the user's location on page load and displays the local weather.
-   **Responsive Design:** The layout is optimized for both desktop and mobile devices.

---

## Technologies Used

-   **HTML5:** For the structure and content of the application.
-   **CSS3:** For styling, including Flexbox and Grid for layout.
-   **Vanilla JavaScript:** For application logic, event handling, and API integration using `async/await`.
-   **[OpenWeatherMap API](https://openweathermap.org/api):** To source live weather data.

---

## Setup and Installation

To run this project locally, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2.  **Get your API Key:**
    -   Go to [OpenWeatherMap](https://openweathermap.org/) and create a free account.
    -   Navigate to the "API keys" tab on your profile and get your unique API key.

3.  **Add the API Key to the project:**
    -   Open the `script.js` file.
    -   Find the following line:
        ```javascript
        const apiKey = "8b3a98a28abe5b6c74f1f0953a4f9615"; // only the key
        ```
    -   Replace the placeholder key with your own API key:
        ```javascript
        const apiKey = "YOUR_OWN_API_KEY_HERE";
        ```

4.  **Open in your browser:**
    -   Simply open the `index.html` file in your web browser to see the application running.

---

## Future Improvements

-   **Theme Toggle:** The HTML includes a theme toggle button (`🌙`). The next step would be to implement the JavaScript logic and CSS variables to switch between a light and dark mode.
-   **Weather Icons:** Add dynamic weather icons that change based on the weather conditions (e.g., sunny, cloudy, rainy).
-   **Search History:** Use `localStorage` to save and display a list of recently searched cities.
