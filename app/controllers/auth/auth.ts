import { Request, Response, NextFunction } from "express";
import { createLocalJWKSet, jwtVerify, decodeProtectedHeader } from "jose";




export const UserSessionGenerate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtSecret = process.env.SUPABASE_SECRET_KEY;

    if (!jwtSecret) {
      throw new Error("SUPABASE_JWT_SECRET is not defined");
    }

    if (!req.body.access_token) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    // Convert secret to Uint8Array
    const secret = new TextEncoder().encode(jwtSecret);

    // Verify with HS256 (Supabase's algorithm)
    const { payload } = await jwtVerify(req.body.access_token, secret, {
      issuer: `${process.env.PUBLIC_SUPABASE_URL}/auth/v1`,
      audience: "authenticated",
    });

    console.log("Verified payload:", payload);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error: any) {
    console.error("JWT verification error:", error);

    if (error.code === "ERR_JWT_EXPIRED") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// // express-authz.ts
// import 'dotenv/config';
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import crypto from 'crypto';
// import { createRemoteJWKSet, jwtVerify, SignJWT } from 'jose';

// const app = express();
// app.use(express.json());
// app.use(cookieParser());

// // 1) Verify Supabase JWT using Supabase JWKS
// //    Replace YOUR-PROJECT with your ref id.
// const SUPABASE_JWKS = createRemoteJWKSet(
//   new URL('https://YOUR-PROJECT.supabase.co/auth/v1/keys')
// );

// // 2) Your signing key for AuthZ tokens (keep private)
// const AUTHZ_SECRET = new TextEncoder().encode(process.env.AUTHZ_SECRET!);

// // 3) Refresh store (replace with DB)
// const refreshStore = new Map<string, { sub: string; roles: string[]; exp: number }>();

// async function mintAuthZAccess(sub: string, roles: string[], extra?: Record<string, any>) {
//   const now = Math.floor(Date.now() / 1000);
//   return await new SignJWT({ ...extra, roles })
//     .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
//     .setSubject(sub)
//     .setIssuer(process.env.ISSUER ?? 'https://authz.example.com')
//     .setAudience('authz')
//     .setIssuedAt(now)
//     .setExpirationTime(now + 15 * 60) // 15 min
//     .sign(AUTHZ_SECRET);
// }
// function mintAuthZRefresh(sub: string, roles: string[]) {
//   const token = crypto.randomBytes(32).toString('base64url');
//   const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
//   refreshStore.set(token, { sub, roles, exp });
//   return token;
// }
// function rotateRefresh(old: string) {
//   const rec = refreshStore.get(old);
//   if (!rec) return null;
//   refreshStore.delete(old);
//   if (rec.exp <= Math.floor(Date.now() / 1000)) return null;
//   const nxt = mintAuthZRefresh(rec.sub, rec.roles);
//   return { ...rec, token: nxt };
// }

// // Exchange: Supabase access → your AuthZ tokens
// app.post('/issue', async (req, res) => {
//   try {
//     const sbToken = req.headers.authorization?.split(' ')[1];
//     if (!sbToken) return res.status(401).json({ error: 'missing_supabase_token' });

//     // 1) Verify Supabase identity token
//     const { payload } = await jwtVerify(sbToken, SUPABASE_JWKS, {
//       audience: 'authenticated',
//     });
//     // 2) Decide roles from your sources
//     const sub = payload.sub as string;            // Supabase user id (UUID)
//     const roles = payload.app_metadata?.roles ?? ['user']; // or fetch from DB

//     // 3) Mint your tokens
//     const access = await mintAuthZAccess(sub, roles);
//     const refresh = mintAuthZRefresh(sub, roles);

//     res
//       .cookie('authz_refresh', refresh, {
//         httpOnly: true, secure: true, sameSite: 'lax', path: '/',
//       })
//       .json({ access_token: access, token_type: 'bearer', expires_in: 900, roles });
//   } catch (e) {
//     return res.status(401).json({ error: 'invalid_supabase_token' });
//   }
// });

// // Refresh your AuthZ tokens
// app.post('/token', async (req, res) => {
//   const old = req.cookies['authz_refresh'];
//   const rotated = old && rotateRefresh(old);
//   if (!rotated) return res.status(401).json({ error: 'invalid_refresh' });
//   const access = await mintAuthZAccess(rotated.sub, rotated.roles);
//   res
//     .cookie('authz_refresh', rotated.token!, {
//       httpOnly: true, secure: true, sameSite: 'lax', path: '/',
//     })
//     .json({ access_token: access, token_type: 'bearer', expires_in: 900, roles: rotated.roles });
// });

// app.listen(3001);
