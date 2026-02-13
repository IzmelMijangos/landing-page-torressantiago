/**
 * NextAuth Configuration
 * Authentication system for Mezcal Leads Dashboard
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { queryMezcal } from './db-mezcal';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'tu@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        try {
          // Buscar usuario en la base de datos
          const result = await queryMezcal<{
            id: number;
            uuid: string;
            email: string;
            password_hash: string;
            nombre_completo: string;
            role: 'superadmin' | 'admin' | 'palenque';
            palenque_id: number | null;
            activo: boolean;
            metadata: any;
          }>(
            `SELECT id, uuid, email, password_hash, nombre_completo, role, palenque_id, activo, metadata
             FROM usuarios
             WHERE email = $1 AND activo = TRUE`,
            [credentials.email]
          );

          const user = result.rows[0];

          if (!user) {
            throw new Error('Credenciales inválidas');
          }

          // Verificar password
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!passwordMatch) {
            throw new Error('Credenciales inválidas');
          }

          // Actualizar último acceso
          await queryMezcal(
            `UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1`,
            [user.id]
          );

          // Check if user needs to change password
          const requiereCambioPassword = user.metadata?.requiere_cambio_password === true;

          // Retornar usuario
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.nombre_completo,
            role: user.role as 'superadmin' | 'admin' | 'palenque',
            palenqueId: user.palenque_id,
            requiereCambioPassword,
          } as any;
        } catch (error) {
          console.error('Error en autenticación:', error);
          throw new Error('Error al autenticar');
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Agregar info adicional al JWT token
      if (user) {
        token.role = (user as any).role;
        token.palenqueId = (user as any).palenqueId;
        token.requiereCambioPassword = (user as any).requiereCambioPassword;
      }
      return token;
    },

    async session({ session, token }) {
      // Agregar info del token a la sesión
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).palenqueId = token.palenqueId;
        (session.user as any).requiereCambioPassword = token.requiereCambioPassword;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  secret: process.env.NEXTAUTH_SECRET,
};
