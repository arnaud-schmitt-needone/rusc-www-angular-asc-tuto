import { Component, OnInit } from '@angular/core';
import { Hero } from 'src/app/models/hero';
import { HeroService } from 'src/app/services/hero.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.less']
})
export class HeroesComponent implements OnInit {

  selectedHero?: Hero;

  heroes: Hero[] = [];

  constructor(
    private heroService: HeroService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  public getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe((heroes: Hero[]) => {this.heroes = heroes});
  }

  public add(name: string): void {
    name = name.trim();
    if (name) {
      this.heroService.addHero({ name } as Hero)
      .subscribe((hero: Hero) => {this.heroes.push(hero)})
    } else {
      this.messageService.add('Cannot add hero with no name');
      return;
    }
  }

  public delete(id: number): void {
    this.heroService.delete(id)
      .subscribe();

  }
}
