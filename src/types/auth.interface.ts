import { LoginResponse } from "./login.interface";

export type ActionMapType<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, unknown>;

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: LoginResponse | null;
};

// ----------------------------------------------------------------------

type CanRemove = {
  login?: (username: string, password: string) => Promise<LoginResponse>;
  initialize: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
};

export type ContextType = CanRemove & {
  user: LoginResponse | null;
  loading: boolean;
  accessToken: string | null;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  initialize: () => Promise<void>;
};
