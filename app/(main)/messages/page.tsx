import Link from "next/link";
import { sendMessageAction } from "@/app/actions";
import type { Conversation, User } from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

type MessagesPageProps = {
  searchParams: Promise<{ conversationId?: string }>;
};

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const params = await searchParams;
  const [userResponse, conversationsResponse] = await Promise.all([
    safeServerApiGet<User>("/users/me"),
    safeServerApiGet<Conversation[]>("/chat/conversations"),
  ]);
  const user = userResponse?.data;
  const conversations = conversationsResponse?.data ?? [];
  const selectedId = params.conversationId ?? conversations[0]?.id;
  const selectedConversation = selectedId
    ? (
        await safeServerApiGet<Conversation>(
          `/chat/conversations/${selectedId}`,
        )
      )?.data
    : null;

  if (!userResponse) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-card">
          <h1 className="text-3xl font-bold text-gray-900">Login required</h1>
          <p className="mt-3 text-gray-500">Please login to use chat.</p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Messages
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          Keep buyer conversations clear.
        </h1>
      </div>

      <div className="grid min-h-[620px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card lg:grid-cols-[340px_1fr]">
        <aside className="border-r border-gray-200 bg-gray-50">
          {conversations.map((conversation) => {
            const other = conversation.participants.find(
              (participant) => participant.userId !== user?.id,
            )?.user;
            const latestMessage = conversation.messages[0];

            return (
            <Link
              href={`/messages?conversationId=${conversation.id}`}
              key={conversation.id}
              className={`block border-b border-gray-200 p-5 ${conversation.id === selectedId ? "bg-white" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {other?.sellerProfile?.shopName ?? other?.name ?? "Conversation"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {conversation.product?.title ?? latestMessage?.body ?? "No messages yet"}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {conversation.lastMessageAt
                    ? new Date(conversation.lastMessageAt).toLocaleTimeString("en-BD", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </Link>
            );
          })}
          {!conversations.length ? (
            <div className="p-5 text-sm text-gray-500">No conversations yet.</div>
          ) : null}
        </aside>

        <div className="flex flex-col">
          <div className="border-b border-gray-200 p-5">
            <p className="font-semibold text-gray-900">
              {selectedConversation
                ? selectedConversation.participants.find(
                    (participant) => participant.userId !== user?.id,
                  )?.user.name ?? "Conversation"
                : "Select a conversation"}
            </p>
            <p className="text-sm text-gray-500">
              {selectedConversation?.product?.title ?? "Buyer/seller chat"}
            </p>
          </div>
          <div className="flex-1 space-y-4 bg-surface p-6">
            {selectedConversation?.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-md rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.senderId === user?.id
                    ? "ml-auto bg-brand-500 text-white"
                    : "bg-white text-gray-700 shadow-sm"
                }`}
              >
                {message.body}
              </div>
            ))}
            {!selectedConversation?.messages.length ? (
              <p className="text-sm text-gray-500">No messages yet.</p>
            ) : null}
          </div>
          <div className="border-t border-gray-200 p-5">
            <form action={sendMessageAction} className="flex gap-3">
              <input
                type="hidden"
                name="conversationId"
                value={selectedConversation?.id ?? ""}
              />
              <input
                name="body"
                className="flex-1 rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="Write a message..."
                required
                disabled={!selectedConversation}
              />
              <button
                disabled={!selectedConversation}
                className="rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
