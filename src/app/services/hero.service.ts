import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Hero } from '../models/hero';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GetManyHeroesDto } from '../models/get-many-heroes.dto';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private apiRoute = `${environment.apiUrl}${environment.heroesEndpoint}`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  public getHeroes(): Observable<GetManyHeroesDto> {
    const heroes = this.http.get<GetManyHeroesDto>(this.apiRoute)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<GetManyHeroesDto>('getHeroes'))
      );
    return heroes;
  }

  public getHero(id: string): Observable<Hero> {
    const hero = this.http.get<Hero>(`${this.apiRoute}/${id}`)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>('getHero'))
    );
    return hero;
  }

  public addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.apiRoute, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Added hero name=${hero.name}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  /** PUT: update the hero on the server */
  public updateHero(hero?: Hero): Observable<Hero> {
    const route = `${this.apiRoute}/${hero?.id}`;
    return this.http.put<Hero>(route, { name: hero?.name }, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id=${(hero || {id: -1}).id}`)),
        catchError(this.handleError<Hero>('updateHero'))
    );
  }

  public delete(id: string): Observable<Hero> {
    return this.http.delete<Hero>(`${this.apiRoute}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of();
    }
    return this.http.get<GetManyHeroesDto>(`${this.apiRoute}?name=${term}`).pipe(
      map((result: GetManyHeroesDto) => result.heroes),
      tap(heroes => heroes.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): any{
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
  };
}

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }
}
