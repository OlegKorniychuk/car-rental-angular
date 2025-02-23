import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Car } from './car.model';
import { HttpClient } from '@angular/common/http';

interface GetCarResponse {
  status: string;
  results: number;
  data: {
    cars: Car[]
  }
}

interface Rental {
  id: string;
  carId: string;
  clientId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  createdAt: string;
  updatedAt: string;
  isOpen: boolean;
}

const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  constructor(
    private readonly http: HttpClient,
  ) { };

  public getCars(): Observable<Car[]> {
    return this.http.get<GetCarResponse>(`${API_URL}/cars`).pipe(
      map((resp: GetCarResponse) => resp.data.cars)
    )
  }

  public rentCar(
    userId: string,
    carId: string,
    rentalEndDate: string,
    rentalStartDate?: string
  ): Observable<{ status: string, data: { rental: Rental } }> {
    return this.http.post<{ status: string, data: { rental: Rental } }>(
      `${API_URL}/clients/${userId}/rentals`,
      { clientId: userId, carId, rentalEndDate, rentalStartDate }
    )
  }
}
