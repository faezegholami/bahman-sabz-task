"use server";

import { cookies } from "next/headers";

export async function createCookie(name: string, value: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: name,
    value: value,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 5 * 1
  });
}

export async function deleteCookie(name: string) {
  (await cookies()).delete(name);
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  if (cookie) {
    return JSON.parse(cookie.value);
  }
}
