import * as bcrypt from 'bcrypt';

export async function encryptPassword(pw: string) {
  const SALT = bcrypt.genSaltSync();
  return await bcrypt.hash(pw, SALT);
}

export async function validatePassword(
  hash: string,
  pw: string,
): Promise<boolean> {
  const isValidated = await bcrypt.compare(pw, hash);
  return isValidated;
}
