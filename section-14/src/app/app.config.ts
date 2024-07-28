import { ApplicationConfig } from "@angular/core";
import { Routes } from "./app.routes";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";

export const appConfig: ApplicationConfig =
{
  providers: [provideRouter(Routes, withComponentInputBinding(), withRouterConfig({
    paramsInheritanceStrategy: "always"
  }))]
};
