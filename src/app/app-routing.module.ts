import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelsListComponent } from './models-list/models-list.component';
import { ModelDetailComponent } from './model-detail/model-detail.component';
import { DocumentationComponent } from './documentation/documentation.component';

const routes: Routes = [
  { path: '', redirectTo: 'models', pathMatch: 'full' },
  { path: 'models', component: ModelsListComponent },
  { path: 'docs', component: DocumentationComponent },
  { path: 'models/:id', component: ModelDetailComponent },
  { path: '**', redirectTo: 'models' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
