import type { Component } from "svelte";
import { writable, type Writable } from "svelte/store";
import Home from "../views/Home.svelte";
import NotFound from "../views/404.svelte";

export type Routes = Record<string, Component>;

export const routes: Routes = {
  "": Home,
  loading: Home,
  "404": NotFound,
};

export const path = writable<string>("loading");
export const parameters = writable<Record<string, string>>({});

export const goTo = (route: string) => {
  if (!routes[route]) {
    parameters.update((p) => {
      p["invalidRoute"] = route;
      return p;
    });
    route = "404";
  }
  const url = new URL(window.location.href);
  url.searchParams.set("route", route);
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
