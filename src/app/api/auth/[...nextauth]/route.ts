import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

const authOptions: AuthOptions = {
  providers: [
    {
      id: "NYU_OAuth2",
      type: "oauth",
      name: "NYUOAuth2",
      wellKnown: `${process.env.OAUTH_NYU_API_ENDPOINT}/oidcdiscovery/.well-known/openid-configuration`,
      clientId: process.env.OAUTH_NYU_CLIENT_ID!,
      clientSecret: process.env.OAUTH_NYU_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email profile" } },
      checks: ["state"],
      async profile(profile: any) {
        return {
          id: profile.sub,
          name:
            profile.firstname && profile.lastname
              ? `${profile.firstname} ${profile.lastname}`
              : profile.display_name,
          email: `${profile.sub}@nyu.edu`,
          image: null,
        };
      },
    },
  ],
  pages: {
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return "/home";
    },
    async session({ session, token }: { session: any; token: any }) {
      return session;
    },
  },
  session: {
    maxAge: 30 * 60,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
