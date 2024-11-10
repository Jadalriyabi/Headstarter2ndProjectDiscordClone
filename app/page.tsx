"use client";

/* we will be building a very basic static messages UI that we'll be connecting to our server. 
   Convex is the best option for a messaging app 
    So in this first project, we're going to set convex for database, clerk for user authentication and some ui for our frontend*/

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export default function Home() {
  const messages = useQuery(api.functions.message.list); // fetches messages from the backend
  const createMessage = useMutation(
    // allows sending messages to the backend
    api.functions.message.create
  );
  const [input, setInput] =
    useState(
      ""
    ); /* This state variable keeps track of the current text in the input field */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); /*This is to prevent the page from refreshing on submit */
    createMessage({
      //calls createMessage to send a new message with sender set as "Alice" and content as the current input text
      sender: "Alice",
      content: input,
    });
    setInput(
      //clears the input field after submission
      ""
    );
  };

  return (
    <div>
      {messages?.map(
        (
          message,
          index // maps over messages to display each message with its sender and content. Also provides an input form for adding new messages.
        ) => (
          <div key={index}>
            <strong>{message.sender}</strong>: {message.content}
          </div>
        )
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          id="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
