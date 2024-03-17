interface IOptions {
  cookieName: string,
  password: string,
  cookieOptions: {
      httpOnly: boolean,
      sameSite: boolean | "lax" | "none" | "strict" | undefined,
      maxAge: number,
  }
}

export const ironOptions: IOptions = {
    cookieName: process.env.SESSION_COOKIE_NAME as string,
    password: process.env.SESSION_PASSWORD as string,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    },
  };