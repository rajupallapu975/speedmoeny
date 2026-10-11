import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

export interface AuthState {
  phoneNumber: string;
  verificationId: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: any | null;
}

export const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

export interface SessionData {
  phoneNumber: string;
  loginTimestamp: number;
  expiresAt: number;
}

export function saveSession(phoneNumber: string) {
  if (typeof window === "undefined") return;
  const session: SessionData = {
    phoneNumber,
    loginTimestamp: Date.now(),
    expiresAt: Date.now() + FIFTEEN_DAYS_MS,
  };
  localStorage.setItem("sm_session", JSON.stringify(session));
  localStorage.setItem("sm_user_phone", phoneNumber);
}

export function checkSession(): { valid: boolean; phoneNumber: string } {
  if (typeof window === "undefined") return { valid: false, phoneNumber: "" };
  try {
    const raw = localStorage.getItem("sm_session");
    if (!raw) {
      const phone = localStorage.getItem("sm_user_phone");
      if (phone) {
        saveSession(phone);
        return { valid: true, phoneNumber: phone };
      }
      return { valid: false, phoneNumber: "" };
    }
    const data: SessionData = JSON.parse(raw);
    if (data.expiresAt && Date.now() < data.expiresAt && data.phoneNumber) {
      return { valid: true, phoneNumber: data.phoneNumber };
    }
    localStorage.removeItem("sm_session");
    localStorage.removeItem("sm_user_phone");
    return { valid: false, phoneNumber: "" };
  } catch {
    return { valid: false, phoneNumber: "" };
  }
}

const initialSession = checkSession();

let state: AuthState = {
  phoneNumber: initialSession.phoneNumber,
  verificationId: null,
  isLoading: false,
  error: null,
  isAuthenticated: initialSession.valid,
  user: null,
};

const listeners = new Set<(s: AuthState) => void>();

function notify() {
  listeners.forEach((fn) => fn({ ...state }));
}

export function subscribeAuth(fn: (s: AuthState) => void) {
  listeners.add(fn);
  fn({ ...state });
  return () => {
    listeners.delete(fn);
  };
}

export function getAuthState(): AuthState {
  return { ...state };
}

/**
 * Send Phone OTP via Firebase
 * @param raw10Digits 10-digit Indian phone number (e.g. "9876543210")
 */
export async function sendOtp(raw10Digits: string): Promise<{ success: boolean; error?: string }> {
  const fullPhone = `+91${raw10Digits.replace(/\D/g, "").slice(0, 10)}`;
  if (typeof window !== "undefined") {
    localStorage.setItem("sm_user_phone", fullPhone);
  }
  state = {
    ...state,
    phoneNumber: fullPhone,
    isLoading: true,
    error: null,
  };
  notify();

  if (Capacitor.isNativePlatform()) {
    return new Promise<{ success: boolean; error?: string }>(async (resolve) => {
      let resolved = false;

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          const msg = "Request timed out. Please check your internet connection and try again.";
          state = { ...state, isLoading: false, error: msg };
          notify();
          resolve({ success: false, error: msg });
        }
      }, 25000);

      try {
        await FirebaseAuthentication.removeAllListeners();

        await FirebaseAuthentication.addListener("phoneCodeSent", (event) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            state = {
              ...state,
              verificationId: event.verificationId,
              isLoading: false,
              error: null,
            };
            notify();
            resolve({ success: true });
          }
        });

        await FirebaseAuthentication.addListener("phoneVerificationFailed", (event) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            let msg = event.message || "Phone verification failed.";
            if (msg.includes("play_integrity_token") || msg.includes("17028")) {
              msg = "Google Play Integrity check failed. Please ensure your SHA-256 fingerprint is registered in Firebase Console, and test on a physical Android device (emulators fail Google device integrity checks for real SMS).";
            }
            state = {
              ...state,
              isLoading: false,
              error: msg,
            };
            notify();
            resolve({ success: false, error: msg });
          }
        });

        await FirebaseAuthentication.addListener("phoneVerificationCompleted", (event) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            const userPhone = event.user?.phoneNumber || fullPhone;
            saveSession(userPhone);
            state = {
              ...state,
              phoneNumber: userPhone,
              isAuthenticated: true,
              user: event.user,
              isLoading: false,
              error: null,
            };
            notify();
            resolve({ success: true });
          }
        });

        await FirebaseAuthentication.signInWithPhoneNumber({
          phoneNumber: fullPhone,
        });
      } catch (err: any) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          const msg = err?.message || "Failed to start phone verification.";
          state = { ...state, isLoading: false, error: msg };
          notify();
          resolve({ success: false, error: msg });
        }
      }
    });
  } else {
    // Web / Emulator fallback: simulate sending OTP
    await new Promise((r) => setTimeout(r, 600));
    state = {
      ...state,
      verificationId: "mock-verif-" + Date.now(),
      isLoading: false,
      error: null,
    };
    notify();
    return { success: true };
  }
}

/**
 * Verify received 6-digit OTP code
 */
export async function verifyOtp(code: string): Promise<{ success: boolean; error?: string }> {
  state = { ...state, isLoading: true, error: null };
  notify();

  if (Capacitor.isNativePlatform()) {
    try {
      if (!state.verificationId) {
        throw new Error("Missing verification ID. Please request OTP again.");
      }

      const result = await FirebaseAuthentication.confirmVerificationCode({
        verificationId: state.verificationId,
        verificationCode: code.trim(),
      });

      const userPhone = result.user?.phoneNumber || state.phoneNumber;
      saveSession(userPhone);
      state = {
        ...state,
        phoneNumber: userPhone,
        isAuthenticated: true,
        user: result.user,
        isLoading: false,
        error: null,
      };
      notify();
      return { success: true };
    } catch (err: any) {
      const msg = err?.message || "Invalid OTP code";
      state = { ...state, isLoading: false, error: msg };
      notify();
      return { success: false, error: msg };
    }
  } else {
    // Web / Dev mock verification
    await new Promise((r) => setTimeout(r, 600));
    saveSession(state.phoneNumber);
    state = {
      ...state,
      isAuthenticated: true,
      user: { phoneNumber: state.phoneNumber, uid: "mock-user-123" },
      isLoading: false,
      error: null,
    };
    notify();
    return { success: true };
  }
}

/**
 * Resend OTP
 */
export async function resendOtp(): Promise<{ success: boolean; error?: string }> {
  if (!state.phoneNumber) {
    return { success: false, error: "No phone number available to resend." };
  }
  const digits = state.phoneNumber.replace("+91", "");
  return sendOtp(digits);
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await FirebaseAuthentication.signOut();
    } catch {}
  }
  state = {
    phoneNumber: "",
    verificationId: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    user: null,
  };
  if (typeof window !== "undefined") {
    localStorage.removeItem("sm_session");
    localStorage.removeItem("sm_user_phone");
  }
  notify();
}
