// constants/roles.js

// Centralized role definitions for the application
// Used in auth middleware, controllers, and validations

export const ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
});

// Optional helper: check if a role is valid
export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};