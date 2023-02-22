import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiTemplateGenComponent } from './views/ai-template-gen/ai-template-gen.component';

const routes: Routes = [
  { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
  { path: 'portfolio', component: AiTemplateGenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
