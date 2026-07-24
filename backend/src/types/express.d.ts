export {};

declare global {
  namespace Express {
    interface User {
      userId: string;
      role: string;
      email: string;
    }

    interface Request {
      user?: User;
    }
  }
}
