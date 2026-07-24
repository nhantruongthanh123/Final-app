import { AppError } from "#utils/app.error.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "./db.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        if (!user.password) {
          return done(null, false, {
            message:
              "This account uses social login. Please log in with Google, Facebook, or Twitter.",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        if (!user.isEmailVerified) {
          throw new AppError(
            "Email is not verified. Please verify your email before logging in.",
            400,
          );
        }

        return done(null, {
          userId: user.id,
          role: user.role,
          email: user.email,
        });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new AppError("No email found in Google profile", 400));
        }

        const existingOauth = await prisma.oauthAccount.findUnique({
          where: {
            provider_providerAccountId: {
              provider: "google",
              providerAccountId: profile.id,
            },
          },
          include: { user: true },
        });

        if (existingOauth) {
          return done(null, {
            userId: existingOauth.user.id,
            role: existingOauth.user.role,
            email: existingOauth.user.email,
          });
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              isEmailVerified: true,
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              avatarUrl: profile.photos?.[0]?.value,
              oauthAccounts: {
                create: {
                  provider: "google",
                  providerAccountId: profile.id,
                },
              },
            },
          });
        } else {
          // 4. User exists via local/other login, just link this new Google provider to them
          await prisma.oauthAccount.create({
            data: {
              userId: user.id,
              provider: "google",
              providerAccountId: profile.id,
            },
          });
        }

        return done(null, {
          userId: user.id,
          role: user.role,
          email: user.email,
        });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "picture.type(large)"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new AppError("No email found in Facebook profile", 400));
        }

        const existingOauth = await prisma.oauthAccount.findUnique({
          where: {
            provider_providerAccountId: {
              provider: "facebook",
              providerAccountId: profile.id,
            },
          },
          include: { user: true },
        });

        if (existingOauth) {
          return done(null, {
            userId: existingOauth.user.id,
            role: existingOauth.user.role,
            email: existingOauth.user.email,
          });
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              isEmailVerified: true,
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              avatarUrl: profile.photos?.[0]?.value,
              oauthAccounts: {
                create: {
                  provider: "facebook",
                  providerAccountId: profile.id,
                },
              },
            },
          });
        } else {
          await prisma.oauthAccount.create({
            data: {
              userId: user.id,
              provider: "facebook",
              providerAccountId: profile.id,
            },
          });
        }

        return done(null, {
          userId: user.id,
          role: user.role,
          email: user.email,
        });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
