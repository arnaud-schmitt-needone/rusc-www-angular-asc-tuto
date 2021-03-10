import { createServer, Model, Server } from 'miragejs';
import { Hero } from './models/hero';

const heroes = [
  { id: 11, name: 'Dr Nice' },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' }
];

export default () => {
  new Server({
    seeds(server) {
      server.db.loadData({
        heroes
      });
    },
    routes() {
      this.namespace = '/api';

      this.get('/heroes', schema => schema.db.heroes);

      this.get('/heroes/:id', (schema, request) => {
        const id: number = parseInt(request.params.id || '-1', undefined);
        return schema.db.heroes.find(id);
      });

      this.get('/heroes?name=:name', (schema, request) => {
        const name: string = request.params.name;
        return schema.db.heroes.findBy({name: name});
      });

      this.put('/heroes', (schema, request) => {
        const hero: Hero = (JSON.parse(request.requestBody));
        return schema.db.heroes.update(hero.id, {name: hero.name});
      });

      this.post('/heroes', (schema, request) => {
        const hero: Hero = (JSON.parse(request.requestBody));
        return schema.db.heroes.insert(hero);
      });

      this.del('/heroes/:id', (schema, request) => {
        const id: number = parseInt(request.params.id);
        const hero = schema.db.heroes.find(id);
        return hero.destroy();
      });
    },
  });
};
