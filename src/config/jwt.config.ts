export const expiresData = {
  access: {
    min: 10
  },
  refresh: {
    day: 10
  }
}

export default {
  secret: process.env.JWT_SECRET || "default_secret",
  expiresIn: process.env.JWT_EXPIRES_IN || "10Min",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7Day",
};
