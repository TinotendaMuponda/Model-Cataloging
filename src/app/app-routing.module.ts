import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelsListComponent } from './models-list/models-list.component';
import { ModelDetailComponent } from './model-detail/model-detail.component';
import { DocumentationComponent } from './documentation/documentation.component';

const routes: Routes = [
  { path: '', component: ModelsListComponent },
  { path: 'documentation', component: DocumentationComponent },
  { path: ':id', component: ModelDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
