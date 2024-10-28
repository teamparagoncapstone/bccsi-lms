import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { randomBytes } from 'crypto';

const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
          include: {
            students: true,
            educators: true,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        const accessToken = randomBytes(40).toString('hex');

        const student = user.students[0];
        const educator = user.educators[0];

        return {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          grade: student?.grade || 'Unknown',
          studentId: student?.id,
          studentUsername: student?.studentUsername,
          image: student?.image || user.image || null,
          email: user.email,
          accessToken,
          educatorLevel: educator?.educatorLevel,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username, 
          role: token.role,
          createdAt: token.createdAt,
          grade: token.grade,
          email: token.email,
          studentId: token.studentId,
          studentUsername: token.studentUsername,
          image: token.image as string | null,
          educatorLevel: token.educatorLevel,
        },
      };
    },
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as any;
        return {
          ...token,
          id: u.id,
           username: u.username,
          role: u.role,
          createdAt: u.createdAt,
          grade: u.grade,
          accessToken: u.accessToken,
          email: u.email,
          studentId: u.studentId,
          studentUsername: u.studentUsername,
          image: user.image as string | null,
          educatorLevel: u.educatorLevel,
        };
      }
      return token;
    },
  },
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST };
