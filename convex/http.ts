import { httpRouter } from "convex/server"; /* This is what we're going to use to define our routes */
import { httpAction } from "./_generated/server";
import { Webhook } from "svix"; // webhook helps verify the data Clerk sends(ensuring it's secure)
import type { WebhookEvent } from "@clerk/nextjs/server";
import { internal } from "./_generated/api"; // internal provides access to backend convex functions for user data management

// A webhook is a way for Clerk to notify this server whenever something changes with a user, like
// a new user signing up. Clerk sends a message to a special URL(/clerk-webhook), and this server
// listens at that URL, ready to take action.

// This code sets up a "route"(URL path) for listening to events from clerk:
// POST request at the path "/clerk-webhook"
// Handler function processes the request and does different actions depending on the type of event

// SUMMARY:

// This code is like a "listener" for user events from Clerk. It:
// sets up an endpoint(/clerk-webhook) to receive and process these events
// validates each request to ensure it's genuinely from clerk
// Updates the server's user data based on the event(like adding, updating, or removing users)

// In short, webhooks enable different applications to "talk" to each other and keep data in sync
// or trigger workflows without manual intervention.

// In essence, the webhook allows Clerk to send data directly to your server whenever something
// important happens with a user, keeping the server's user data up-to-date without any manual work
// "webhooks" are "real-time notification systems"

const http = httpRouter();
// WEBHOOK LISTENER
http.route({
  method: "POST",
  path: "/clerk-webhook",
  handler: httpAction(async (ctx, req) => {
    const body = await validateRequest(req);
    if (!body) {
      return new Response("Unauthorized", { status: 401 });
    }
    switch (body.type) {
      case "user.created": // if a new user is created in clerk, it saves the user data to the server
        await ctx.runMutation(internal.functions.user.upsert, {
          username: body.data.username!,
          image: body.data.image_url,
          clerkId: body.data.id,
        });
        break;
      case "user.updated": // if  a user updates their info in clerk, it updates the userdata on the server
        await ctx.runMutation(internal.functions.user.upsert, {
          username: body.data.username!,
          image: body.data.image_url,
          clerkId: body.data.id,
        });
        break;
      case "user.deleted": // if a user is deleted from clerk, it removes the user data from the server
        if (body.data.id) {
          await ctx.runMutation(internal.functions.user.remove, {
            clerkId: body.data.id,
          });
        }
        break;
    }
    return new Response("OK", { status: 200 });
  }),
});

// Since this server only wants messages from Clerk(to avoid fake requests), the validate request
// function checks the request's security by reading security headers(svix-id e.t.c) and using
// the webhook class to verify that the data and headers match what Clerk would send

//If everything checks out and the data is processed, the server responds with "ok".
// If there's an issue with the data or request(e.g., validation fails), it responds with
// "Unauthorized" and a 401 status, meaning access is denied.

const validateRequest = async (req: Request) => {
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  const text = await req.text();

  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    return webhook.verify(text, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    }) as unknown as WebhookEvent;
  } catch (error) {
    return null;
  }
};

export default http;
