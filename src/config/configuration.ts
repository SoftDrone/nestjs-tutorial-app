export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER
  },
  jwtConstants: {
    secret: process.env.JWT_SECRET
  }
});