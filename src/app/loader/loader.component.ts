import { Component,inject} from '@angular/core';
import { LoaderService } from 'src/utility/loader.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css'],
    standalone: false
})
export class LoaderComponent {
  loading = false;
  private readonly loaderService = inject(LoaderService);
  constructor() {
    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
    });
  }

}
