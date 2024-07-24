import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places',
      'Something went wrong fetching places! Try again.'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places',
      'Something went wrong fetching your places! Try again.'
    ).pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces),
      })
    );
  }
  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    if (!prevPlaces.some((p) => p.id === place.id)) {
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this.httpClient
      .put('http://localhost:3000/user-places', {
        placeId: place.id,
      })
      .pipe(
        catchError(() => {
          this.userPlaces.set([...prevPlaces]);
          this.errorService.showError('Could not add place.');
          return throwError(() => new Error('Could not add place.'));
        })
      );
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();

    const newPlaces = prevPlaces.filter((p) => p.id !== place.id);

    return this.httpClient
      .delete<{ userPlaces: Place[] }>(
        `http://localhost:3000/user-places/${place.id}`
      )
      .pipe(
        map((resData) => {
          this.userPlaces.set(newPlaces);
          return resData.userPlaces;
        }),
        catchError((error) => {
          console.error(error);
          this.errorService.showError('Unable to remove place');
          return throwError(() => new Error('Unable to remove place'));
        })
      );
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((resData) => resData.places),
      catchError((error) => {
        console.error(error);
        this.errorService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
