import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  fetchError = signal(null);

  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscriber = this.placesService.loadAvailablePlaces().subscribe({
      next: (places) => {
        console.log(places);
        this.places.set(places);
      },
      error: (error) => {
        this.fetchError.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscriber.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    const subscriber = this.placesService
      .addPlaceToUserPlaces(selectedPlace)
      .subscribe();
    this.destroyRef.onDestroy(() => {
      subscriber.unsubscribe();
    });
  }
}
