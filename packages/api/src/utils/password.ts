import * as argon from "argon2";

export const hashPassword = async (password: string): Promise<string> =>
  await argon.hash(password);

export const validatePassword = async (password: string, hash: string) =>
  await argon.verify(hash, password);
