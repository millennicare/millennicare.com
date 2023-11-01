import FormContextProvider from "./FormContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <FormContextProvider>{children}</FormContextProvider>;
}
