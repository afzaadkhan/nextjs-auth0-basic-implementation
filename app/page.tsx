import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
          <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Welcome to Auth0
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Please log in or sign up to continue
            </p>
            <div className="flex gap-4">
              <a
                href="/auth/login?screen_hint=signup"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Sign Up
              </a>
              <a
                href="/auth/login"
                className="px-6 py-3 rounded-lg bg-zinc-300 dark:bg-zinc-700 text-black dark:text-white font-medium hover:bg-zinc-400 dark:hover:bg-zinc-600 transition"
              >
                Log In
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ Access token from session.tokenSet
  const accessToken = session.tokenSet?.accessToken;
  const accessTkn = session.accessTokens
  console.log('These are the accesstokens : ',accessTkn);
  

  // ✅ Call your NestJS backend
  const response = await fetch(`${process.env.BACKEND_URL}/auth/sync-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
    email: session.user.email,
    fullName: session.user.name,
    emailVerified: session.user.email_verified,
  }),
  });

  const userData = await response.json();

  console.log('Access Token:', accessToken);
  console.log('User from Auth0:', session.user);
  console.log('User data from backend:', userData);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="text-center">
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
              Logged in as
            </p>
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
              {session.user.email}
            </h1>
          </div>

          <div className="w-full">
            <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-4">
              User Profile
            </h2>
            <pre className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-auto text-sm text-black dark:text-zinc-50">
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </div>

          <a
            href="/auth/logout"
            className="px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Logout
          </a>
        </div>
      </main>
    </div>
  );
}