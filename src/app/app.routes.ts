import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HelloComponent } from './hello/hello.component';
import { ExampleComponent } from './example/example.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'hello', component: HelloComponent},
  {path: 'example', component: ExampleComponent}
];
