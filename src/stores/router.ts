import type { Component } from "svelte";
import { writable, type Writable } from "svelte/store";
import Home from "../views/Home.svelte";
import NotFound from "../views/404.svelte";
import Detail from "../views/Detail.svelte";

export type Routes = Record<string, Component>;

export const routes: Routes = {
  "": Home,
  loading: Home,
  home: Home,
  "404": NotFound,
  detail: Detail,
};

export const path = writable<string>("loading");
export const parameters = writable<Record<string, string>>({});

export const goTo = (
  route: string,
  params: { key: string; value: string }[] = []
) => {
  if (!routes[route]) {
    parameters.update((p) => {
      p["invalidRoute"] = route;
      return p;
    });
    route = "404";
  }
  const url = new URL(window.location.href);
  url.searchParams.keys().forEach((key) => {
    url.searchParams.delete(key);
  });
  url.searchParams.set("route", route);
  for (let i = 0; i < params.length; i++) {
    url.searchParams.set(params[i].key, params[i].value);
  }
  history.pushState({}, "", url.toString());
  setRoute();
};

const setRoute = () => {
  const params = new URLSearchParams(window.location.search);
  let paramRoute = params.get("route") ?? "";
  if (!routes[paramRoute]) {
    parameters.update((p) => {
      p["invalidRoute"] = paramRoute;
      return p;
    });
    goTo("404");
    return;
  }
  path.set(paramRoute);
};

setRoute();
window.addEventListener("popstate", setRoute);
