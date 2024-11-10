"use client"; /* This line tells the application that this code will run in the browser, not on the server */

/* In summary, this code sets up a way for React components to access data from Convex by using ConvexClientProvider 
  as a wrapper around parts of the app that need this data */

// The core purpose of the code is to set up a data connection btwn the react application and
// convex(a backend service). It uses a provider component(ConvexClientProvider) to
// give access to convex data across any parts of the app that are wrapped within it.

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

// The ConvexReactClient instance connects to convex using an environment variable for the
// backend URL
const client = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
); /* This line creates a new client(connection) to convex */

/* This is a custom component(wrapper) that lets other parts of the app use convex data.
  It takes children as a prop, which represents any components placed inside it. */

// Any child component of ConvexClientProvider can directly access and use Convex services and
// authenticated user data because it wraps parts of the app supplying them with convex data and
// authentication context from clerk.
export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={client} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
} /* This means it wraps its children with convexprovider, giving them access to the convex data through client. */
