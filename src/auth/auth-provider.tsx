"use client";

import { useEffect, useReducer, useCallback, useMemo } from "react";
import axios from "axios";
import { ActionMapType, AuthStateType } from "../types/auth.interface";
import { useSnackbar } from "notistack";
import { createCookie, deleteCookie, getCookie } from "../utils/cookie";
import { createContext } from "react";
import { ContextType } from "../types/auth.interface";
import { LoginResponse } from "../types/login.interface";
import { API_ENDPOINTS } from "../utils/axios";
// ----------------------------------------------------------------------

export const AuthContext = createContext({} as ContextType);
enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: {
    user: LoginResponse | null;
    token: string | null;
  };
  [Types.LOGIN]: {
    user: LoginResponse;
    token: string;
  };
  [Types.LOGOUT]: {
    user: null;
    token: null;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

type AuthStateExtended = AuthStateType & {
  token: string | null;
};

const initialState: AuthStateExtended = {
  user: null,
  loading: true,
  token: null,
};

const reducer = (
  state: AuthStateExtended,
  action: ActionsType,
): AuthStateExtended => {
  switch (action.type) {
    case Types.INITIAL:
      return {
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
      };
    case Types.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case Types.LOGOUT:
      return {
        loading: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { enqueueSnackbar } = useSnackbar();

  const logout = useCallback(async () => {
    await deleteCookie("user");
    await deleteCookie("token");
    window.location.href = "/login";
    dispatch({
      type: Types.LOGOUT,
      payload: { user: null, token: null },
    });

    // setSession(null, null);
  }, []);

  const initialize = useCallback(async () => {
    const user = await getCookie("user");
    const accessToken = await getCookie("token");
    if (user && accessToken) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: user,
          token: accessToken,
        },
      });
    } else {
      await deleteCookie("user");
      await deleteCookie("token");
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
          token: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(
    async (userName: string, password: string) => {
      const response = await axios.post(API_ENDPOINTS.auth.login, {
        username:userName,
        password,
      });
      console.log(response)

      const {
        id,
        username,
        email,
        firstName,
        lastName,
        gender,
        image,
        accessToken,
        refreshToken,
      } = response.data;
      const user: LoginResponse = {
        id: id,
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        image: image,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      await createCookie("user", JSON.stringify(user));
      await createCookie("token", JSON.stringify(accessToken));
      dispatch({
        type: Types.LOGIN,
        payload: {
          user: user,
          token: accessToken,
        },
      });

      return user;
    },
    [enqueueSnackbar],
  );

  const status = state.loading
    ? "loading"
    : state.user
      ? "authenticated"
      : "unauthenticated";

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      accessToken: state.token,
      initialize,
      login,
      logout,
    }),
    [state, login, logout],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
