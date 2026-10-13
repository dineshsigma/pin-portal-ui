import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { PinResetService } from './pin-reset.service';
import { getReferenceNumber, SharingDataService } from 'src/utility/common-services';
import { PinService } from '../pin/pin.service';
import { Subscription } from 'rxjs';
import { ResetPinRequest, ResetPinResponse } from './pin-reset.model';

export let browserRefresh = false;


@Component({
  selector: 'app-pin-reset',
  templateUrl: './pin-reset.component.html',
  styleUrls: ['./pin-reset.component.css'],
  standalone: false
})
export class PinResetComponent implements OnInit {
  errorMsg = '';
  successMsg = false;
  pin1 = '';
  pin2 = '';
  otpVal = '';
  userKey = "";
  mobileNumber = "";

  newpass = "password";
  confirmpass = "password";
  confirmclass = "fa fa-eye-slash";
  newclass = "fa fa-eye-slash";
  showResetPin = true;
  subscription: Subscription;

  private readonly pinResetService = inject(PinResetService);
  private readonly router = inject(Router);
  private readonly pinService = inject(PinService);
  private readonly sharedService = inject(SharingDataService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !this.router.navigated;
      }
    });
  }


  ngOnInit(): void {
    if (!history.state?.userKey ||
      !history.state?.mobileNumber) {
      this.router.navigate(['/pin']);
      return;
    }
    this.userKey = history.state.userKey;
    this.mobileNumber = history.state.mobileNumber;
  }

  resetPin() {
    if (this.pin1 != this.pin2) {
      this.errorMsg = "New PIN and Confirm PIN doesn't match!";
    } else {
      this.errorMsg = "";
      this.validatePin();
    }
  }

  validatePin() {
    this.userKey = history.state?.userKey;
    this.mobileNumber = history.state?.mobileNumber;
    const req: ResetPinRequest = {
      "lsp_user_pin": this.pin1.toString(),
      "lsp_user_mobile": this.mobileNumber.toString(),
      "request_type": "update",
      "reference_id": getReferenceNumber().toString(),
      "lsp_user_key": this.userKey,
      "otp": this.otpVal.toString()
    }
    this.pinResetService.resettingPin(req).subscribe(
      (data: ResetPinResponse) => {
        if (data && data.is_request_success) {
          this.showResetPin = false;
          window.history.replaceState({}, '', window.location.href);
        } else if (data && this.handleSessionExpired(data)) {
          // handled - navigating back to Step 1
        } else if (data && data.error_message) {
          this.errorMsg = data.error_message;
        } else {
          this.errorMsg = data.error_message === "Internal server error" ? "Something went wrong." : data.error_message;
        }
        this.cdr.detectChanges();
      }, err => {
        if (err && this.handleSessionExpired(err)) {
          // handled - navigating back to Step 1
        } else if (err && err.error_message) {
          this.errorMsg = err.error_message;
        } else {
          this.errorMsg = err.error_message;
        }
        this.cdr.detectChanges();
      }
    )
  }

  /**
   * session_valid === false means the PIN-reset session cookie from Step 1 is
   * missing/expired - unlike an invalid OTP, the flow must restart at Step 1.
   * Returns true if it handled (and navigated away for) this case.
   */
  private handleSessionExpired(data: any): boolean {
    if (data && data.status === 401) {
      this.sharedService.setUserKey('');
      this.sharedService.setMobileNumber('');
      this.router.navigate(['/pin'], { queryParams: { sessionExpired: '1' } });
      return true;
    }
    return false;
  }

  passwordnewShow() {
    this.newpass = "text";
    this.newclass = "fa fa-eye";
  }
  passwordnewHide() {
    this.newpass = "password";
    this.newclass = "fa fa-eye-slash";
  }
  passwordconfirmShow() {
    this.confirmpass = "text";
    this.confirmclass = "fa fa-eye";
  }
  passwordconfirmHide() {
    this.confirmpass = "password";
    this.confirmclass = "fa fa-eye-slash";
  }

  newPinKeyEntered = false;
  newPinKeyOnBlur = false;
  confirmPinKeyEntered = false;
  confirmPinKeyOnBlur = false;
  otpKeyEntered = false;
  otpKeyOnBlur = false;
  isDisabled = true;



  newPinKeyPress() {
    this.newPinKeyEntered = true;
    this.checkDisable();
  }

  newPinKeyOnBlurEvent() {
    if (this.newPinKeyEntered) {
      this.newPinKeyOnBlur = true;
    }
  }

  confirmPinKeyPress() {
    this.confirmPinKeyEntered = true;
    this.checkDisable();
  }

  confirmPinKeyOnBlurEvent() {
    if (this.confirmPinKeyEntered) {
      this.confirmPinKeyOnBlur = true;
    }
  }

  otpKeyPress() {
    this.otpKeyEntered = true;
    this.checkDisable();

  }

  otpKeyOnBlurEvent() {
    if (this.otpKeyEntered) {
      this.otpKeyOnBlur = true;
    }
  }

  checkDisable() {
    if ((this.pin1 && this.pin1.toString().length == 6) && (this.pin2 && this.pin2.toString().length == 6) && (this.otpVal)) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  resendOTP() {
    this.errorMsg = "";
    this.userKey = history.state?.userKey;
    this.mobileNumber = history.state?.mobileNumber;
    const req = {
      "reference_id": getReferenceNumber().toString(),
      "lsp_user_key": this.userKey,
      "lsp_user_mobile": this.mobileNumber.toString()
    }
    this.pinService.validateUserDetails(req).subscribe(
      (data) => {
        if (data && data.is_request_success) {
          this.successMsg = true;
        } else if (data && data.error_message) {
          this.errorMsg = data.error_message;
        } else {
          this.errorMsg = "Something went wrong.";
        }
        this.cdr.detectChanges();
      }, err => {
        if (err && err.error_message) {
          this.errorMsg = err.error_message;
        } else {
          this.errorMsg = "Session expired. Please refresh again.";
        }
        this.cdr.detectChanges();
      }
    )
  }
  backToHome() {
    this.router.navigate(['/']);
  }
}
