import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getReferenceNumber, SharingDataService } from 'src/utility/common-services';
import { PinService } from './pin.service';
import { ValidateUserRequest, ValidateUserResponse } from './pin.model'

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.css'],
  standalone: false
})
export class PinComponent implements OnInit {
  mobile = '';
  user_key = "";
  mobileError = false;
  userKeyError = false;
  errorMsg = '';

  // validations
  userKeyEntered = false;
  userKeyOnBlur = false;
  mobileNoEntered = false;
  mobileNoOnBlur = false;
  validMobileNo = false;
  validUserKey = false;

  isDisabled = true;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly pinService = inject(PinService);
  private readonly sharedService = inject(SharingDataService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('sessionExpired')) {
      this.errorMsg = 'session expired. Please refresh again.';
      // Remove query params from URL
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });

      return;
    }
    this.getSessionDetails();
  }

  getSessionDetails(): void {
    this.pinService.SessionDetails().subscribe({
      next: (response) => {
      },
      error: (error) => {
        this.errorMsg = 'Unable to create session. Please try again.';
      }
    });
  }


  submitForm() {
    if (!this.user_key) {
      this.errorMsg = "";
    } else if (!this.mobile) {
      this.errorMsg = "";
    } else {
      this.errorMsg = "";
      this.getOtpByUserKey();
    }
  }

  getOtpByUserKey() {
    const req: ValidateUserRequest = {
      "reference_id": getReferenceNumber().toString(),
      "lsp_user_key": this.user_key,
      "lsp_user_mobile": '+65' + this.mobile.trim()
    }

    this.pinService.validateUserDetails(req).subscribe(
      (data: ValidateUserResponse) => {
        if (data?.is_request_success) {
          this.router.navigate(['/reset'], {
            state: {
              userKey: this.user_key,
              mobileNumber: '+65' + this.mobile.trim()
            }
          });
        } else {
          this.errorMsg =
            data?.error_message || 'Session expired. Please refresh again.';
        }
        this.cdr.detectChanges();
      },
      (err: any) => {
        if (err.error?.error_message) {
          this.errorMsg = err.error.error_message;
        } else if (err.error?.message) {
          this.errorMsg = err.error.message;
        } else if (err.status === 401) {
          this.errorMsg = 'Session expired. Please refresh again.';
        } else {
          this.errorMsg = 'Something went wrong. Please try again.';
        }
        this.cdr.detectChanges();
      }
    );
  }

  userKeyPress(event: KeyboardEvent) {
    this.errorMsg = "";
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    } else {
      this.userKeyEntered = true;
      if (this.user_key) {
        this.validUserKey = true;
      } else {
        this.validUserKey = false;
      }
    }
  }

  userKeyOnBlurEvent() {
    if (this.userKeyEntered) {
      this.userKeyOnBlur = true;
    }
  }

  mobileKeyPress() {
    this.errorMsg = "";
    this.mobileNoEntered = true;
    if (this.mobile && this.mobile.toString().length == 8 && (this.mobile.charAt(0) == "8" || this.mobile.charAt(0) == "9") && !isNaN(Number(this.mobile))) {
      this.validMobileNo = true;
    } else {
      this.validMobileNo = false;
    }
  }

  mobileOnBlurEvent() {
    if (this.mobileNoEntered) {
      this.mobileNoOnBlur = true;
    }
  }

  checkDisable(): void {

    this.validUserKey = /^\d{12}$/.test(this.user_key.trim());

    this.validMobileNo = /^[89]\d{7}$/.test(this.mobile.trim());

    this.isDisabled = !(
      this.validUserKey &&
      this.validMobileNo
    );
  }

}
