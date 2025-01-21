import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  userForm: FormGroup;
  backgroundImage: string = './../../../assets/images/day/sky.jpg';
  temp: string = '';
  date: string = '';
  time: string = '10:30';
  cityName: string = 'City Name';
  icon: any = '../../../assets/images/sunny.webp';
  condition: string = '';
  cloud: string = "89";
  humidity: string = '45';
  wind: string = '10';
  name: string = "Hyderabad";
  cities: any[] = [
    "Hyderabad",
    "Bangalore",
    "Mumbai",
    "Chennai",
    "Delhi"
  ];

  days: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  forecast: any[] = [];
  visibleForecastDays: any[] = []; // Subset to display
  currentIndex: number = 0; // Tracks the start index of visible cards

  constructor(
    private fb: FormBuilder,
    private weatherService: WeatherService
  ) {
    const today = new Date();
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');

    const time = `${hours}:${minutes}`;
    const date = `${this.days[today.getDay()]} ${today.getDate()}, ${this.months[today.getMonth()]} ${today.getFullYear()}`;

    this.date = date;
    this.time = time;

    this.userForm = this.fb.group({
      searchInput: ['']
    });
  }

  ngOnInit(): void {
    this.getCurrentLocationWeather();
  }

  formatDate(date: string) {
    const y = parseInt(date.substr(0, 4));
    const m = parseInt(date.substr(5, 2));
    const d = parseInt(date.substr(8, 2));
    const time = date.substr(11);

    const dateObj = new Date(y, m - 1, d);
    const dayName = this.days[dateObj.getDay()];
    const monthName = this.months[m - 1];

    return `${dayName} ${d}, ${monthName} ${y}`;
  }

  getDay(date: string) {
    const y = parseInt(date.substr(0, 4));
    const m = parseInt(date.substr(5, 2));
    const d = parseInt(date.substr(8, 2));

    const dateObj = new Date(y, m - 1, d);
    const dayName = this.days[dateObj.getDay()];

    return `${dayName}`;
  }

  getCurrentLocationWeather() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Fetch weather data for the current location
          this.fetchWeatherDataByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Handle location permission denied or other errors
        }
      );
    } else {
      console.error('Geolocation is not available in this browser.');
    }
  }

  fetchWeatherData(city: any) {
    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        this.temp = data.current.temp_c;
        this.condition = data.current.condition.text;
        this.icon = data.current.condition.icon;

        const date = data.location.localtime;

        this.time = date.substr(11);
        this.date = this.formatDate(date);
        this.name = data.location.name;
        this.cloud = data.current.cloud;
        this.humidity = data.current.humidity;
        this.wind = data.current.wind_kph;

        this.forecast = data.forecast.forecastday;
        this.updateVisibleForecastDays();

        this.setBackgroundImage(this.condition);
      },
      error: (error) => {
        console.error('Error fetching weather:', error);
      }
    });
  }

  fetchWeatherDataByCoordinates(latitude: number, longitude: number) {
    this.weatherService.getWeatherByCoordinates(latitude, longitude).subscribe({
      next: (data) => {
        this.temp = data.current.temp_c;
        this.condition = data.current.condition.text;
        this.icon = data.current.condition.icon;

        const date = data.location.localtime;

        this.time = date.substr(11);
        this.date = this.formatDate(date);
        this.name = data.location.name;
        this.cloud = data.current.cloud;
        this.humidity = data.current.humidity;
        this.wind = data.current.wind_kph;

        this.forecast = data.forecast.forecastday;
        this.updateVisibleForecastDays();

        this.setBackgroundImage(this.condition);
      },
      error: (error) => {
        console.error('Error fetching weather by coordinates:', error);
      }
    });
  }

  updateVisibleForecastDays() {
    // Update the subset of forecast days to display
    this.visibleForecastDays = this.forecast.slice(
      this.currentIndex,
      this.currentIndex + 3
    );
  }

  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this.updateVisibleForecastDays();
    }
  }

  nextCard() {
    if (this.currentIndex + 3 < this.forecast.length) {
      this.currentIndex += 1;
      this.updateVisibleForecastDays();
    }
  }

  onSearch() {
    this.fetchWeatherData(this.userForm.value.searchInput);
  }

  setBackgroundImage(condition: string) {
    if (condition.includes('Sunny')) {
      this.backgroundImage = '../../../assets/images/day/sunny.jpg';
    } else if (condition.includes('Cloudy') || condition.includes('Overcast')) {
      this.backgroundImage = '../../../assets/images/day/cloudy.jpg';
    } else if (condition.includes('Partly cloudy')) {
      this.backgroundImage = '../../../assets/images/day/partly_cloudy.jpg';
    } else if (condition.includes('Mist') || condition.includes('Fog')) {
      this.backgroundImage = '../../../assets/images/day/mist.jpg';
    } else if (condition.includes('Clear')) {
      this.backgroundImage = '../../../assets/images/day/clear.jpg';
    } else if (condition.includes('rain') || condition.includes('Showers')) {
      this.backgroundImage = '../../../assets/images/day/rainy.jpg';
    } else if (condition.includes('snow')) {
      this.backgroundImage = '../../../assets/images/day/snow.jpg';
    } else {
      this.backgroundImage = '../../../assets/images/day/sky.jpg';
    }
  }

}
