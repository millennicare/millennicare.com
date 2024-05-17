import type { Lucia, Session, User } from "lucia";

export interface ApiContextProps {
  session?: Session;
  user?: User;
  auth: Lucia;
  req?: Request;  
}
