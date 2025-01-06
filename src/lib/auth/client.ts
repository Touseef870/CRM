// 'use client';

// import type { User } from '@/types/user';

// const user = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   email: 'sofia@devias.io',
// } satisfies User;

// export interface SignUpParams {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export interface SignInWithOAuthParams {
//   provider: 'google' | 'discord';
// }

// export interface SignInWithPasswordParams {
//   email: string;
//   password: string;
// }

// export interface ResetPasswordParams {
//   email: string;
// }

// class AuthClient {


//   async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Password reset not implemented' };
//   }

//   async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Update reset not implemented' };
//   }

//   async getUser(): Promise<{ data?: User | null; error?: string }> {

//     const token = localStorage.getItem('AdminloginData');

//     if (!token) {
//       return { data: null };
//     }

//     return { data: user };
//   }

//   async signOut(): Promise<{ error?: string }> {
//     localStorage.removeItem('AdminloginData');

//     return {};
//   }
// }

// export const authClient = new AuthClient();



'use client';

import type { User } from '@/types/user';

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  // Function to save token with expiration
  async saveToken(token: string) {
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const data = { token, expirationTime };
    localStorage.setItem('AdminloginData', JSON.stringify(data));
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const storedData = localStorage.getItem('AdminloginData');

    if (!storedData) {
      return { data: null };
    }

    const parsedData = JSON.parse(storedData);
    const currentTime = new Date().getTime();


    if (currentTime > parsedData.expirationTime) {
      console.log('Token has expired');
      localStorage.removeItem('AdminloginData');
      return { data: null, error: 'Token has expired' };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('AdminloginData');
    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }
}

export const authClient = new AuthClient();
