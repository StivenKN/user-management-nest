import * as bcrypt from 'bcrypt';

/**
 * Function for hash raw password to secure user data in the database.
 * @example
 * const hashedPassword = await hashPassword(rawPassword);
 * await repo.create({ ...data, password: hashedPassword }
 * @param {string} rawPassword
 * @returns {Promise<string>}
 * @async
 */
export default async function hashPassword(
  rawPassword: string,
): Promise<string> {
  const saltRounds = await bcrypt.genSalt();
  return await bcrypt.hash(rawPassword, saltRounds);
}
