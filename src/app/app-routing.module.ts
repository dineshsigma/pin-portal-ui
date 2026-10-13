import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/utility/auth.guard';
import { PinResetComponent } from './pin-reset/pin-reset.component';
import { PinComponent } from './pin/pin.component';
const routes: Routes = [
  { path: "", redirectTo: "pin", pathMatch: "full" },
  { path: "pin", component: PinComponent },
  { path: "reset", component: PinResetComponent },
  { path: "**", redirectTo: "pin" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
