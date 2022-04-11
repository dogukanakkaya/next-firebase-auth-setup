import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import { AuthProvider, User } from '../context/useAuth';
import { parse } from 'cookie';
import { auth } from '../lib/firebase-admin';

interface InitialProps {
  user: User | null
}

function MyApp({ Component, pageProps, user }: AppProps & InitialProps) {
  return (
    <AuthProvider user={user}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }: AppContext) => {
  const response = await fetch('https://127.0.0.1:3000/api/auth/verify', {
    method: 'GET',
    headers: {
      Cookie: ctx.req?.headers.cookie || '',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });

  const result = await response.json();

  return { user: result.data };
}

export default MyApp
