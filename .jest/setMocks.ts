jest.mock("next/dist/client/router", () => require("next-router-mock"));

jest.mock("next/dist/shared/lib/router-context", () => {
  const { createContext } = jest.requireActual("react");
  const router = jest.requireActual("next-router-mock").default;
  const RouterContext = createContext(router);
  return { RouterContext };
});