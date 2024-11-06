"use client"; /* This line tells the application that this code will run in the browser, not on the server */

/* In summary, this code sets up a way for React components to access data from Convex by using ConvexClientProvider 
  as a wrapper around parts of the app that need this data */

import { ConvexProvider, ConvexReactClient } from "convex/react";

const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!); /* This line creates a new client(connection) to convex */

/* This is a custom component(wrapper) that lets other parts of the app use convex data.
  It takes children as a prop, which represents any components placed inside it. */
export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
} /* This means it wraps its children with convexprovider, giving them access to the convex data through client. */
