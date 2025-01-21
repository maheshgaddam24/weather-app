import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../components/interface/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'fea342ffb4d94dddbca164723252001';
  private apiUrl = 'https://api.weatherapi.com/v1';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<WeatherResponse> {
    const url = `${this.apiUrl}/forecast.json?key=${this.apiKey}&q=${city}&days=5`;
    return this.http.get<WeatherResponse>(url);
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherResponse> {
    const url = `${this.apiUrl}/forecast.json?key=${this.apiKey}&q=${lat},${lon}&days=5`;
    return this.http.get<WeatherResponse>(url);
  }
}
