export function calculateAge(birthDate) {
  const dob = new Date(birthDate);
  const currentDate = new Date();
  const diffMillis = currentDate - dob;
  const age = Math.floor(diffMillis / (1000 * 60 * 60 * 24 * 365));
  return age;
}
