import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * The PIN-reset flow no longer uses a bearer token: Step 1 -> Step 2 auth is an
 * HttpOnly session cookie set/read by the API (see PinResetSessionService on the
 * backend). This interceptor previously attached `Authorization: Bearer <token>`
 * from localStorage to every request and auto-refreshed it on 401 - both removed.
 *
 * Kept as a passthrough (rather than deleting the class + its DI registration) so
 * a stray `token` left in a returning user's localStorage from before this change
 * can never be replayed as a bearer token again.
 */
@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req);
  }
}
