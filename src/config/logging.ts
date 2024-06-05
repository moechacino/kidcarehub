import winston from "winston";

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console({})],
});

// export const logger = winston.createLogger({
//   level: "debug",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.File({
//       filename: "application.log",
//     }),
//   ],
// });
