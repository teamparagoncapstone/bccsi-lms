import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name: string | null
      email: string | null
      image: string | null
      role: string 
      grade?: string
      studentId?: string; 
      studentUsername?: string;
      educatorLevel?: string;
      username?: string;

      
    }
  }

  interface JWT {
    role: string 
    grade?: string
    studentId?: string;
     image?: string | null;
     educatorLevel?: string;
     username?: string;
  }
}