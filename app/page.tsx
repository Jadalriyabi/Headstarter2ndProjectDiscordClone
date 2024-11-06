"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export default function Home() {
  const messages = useQuery(api.functions.message.list);
  const createMessage = useMutation(
    api.functions.message.create
  ); /* This state variable keeps a list of messages. Initially, it has two messages, one from Alice and another from Bob */
  const [input, setInput] =
    useState(
      ""
    ); /* This state variable keeps track of the current text in the input field */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); /*This is to prevent the page from refreshing on submit */
    createMessage({
      sender: "Alice",
      content: input,
    }); /*it adds a new message to the messages list, using the current text in input */
    setInput(
      ""
    ); /* It then clears the input so that the text field is empty after sending a message */
  };

  /* This component returns a div containing a list of messages, displaying each one with the sender's name and the message content and a form with an input field and a button. 
  The input field updates input as the user types, and the button submits the form to add a new message. */
  return (
    <div>
      {messages?.map((message, index) => (
        <div key={index}>
          <strong>{message.sender}</strong>: {message.content}
        </div>
      ))}
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
