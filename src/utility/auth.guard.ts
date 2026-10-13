import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { browserRefresh } from 'src/app/pin-reset/pin-reset.component';
import { SharingDataService } from './common-services';

/**
 * Step 2 (OTP + new PIN) requires Step 1 (key + mobile) to have completed in this
 * browser session. The real gate is the server-side HttpOnly session cookie set by
 * Step 1 and checked on submit - this guard is only a UX nicety so a direct/refreshed
 * navigation to /reset lands the user back at Step 1 instead of an empty form.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard {
    private readonly router = inject(Router);
    private readonly sharedService = inject(SharingDataService);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const hasStep1Context = !!this.sharedService.getUserKey() || !!this.sharedService.getMobileNumber();
        const hasStep1Context =
            !!history.state?.userKey &&
            !!history.state?.mobileNumber;
        if (hasStep1Context) {
            return true;
        }

        if (!browserRefresh) {
            this.router.navigate(['/pin'], { queryParams: { returnUrl: state.url } });
        }
        return false;
    }
}