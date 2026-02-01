"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, CheckCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ChatBoxProps {
  applicationId: string;
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  status: string;
}

export default function ChatBox({
  applicationId,
  currentUserId,
  otherUserId,
  otherUserName,
  status,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef(createClient());
  const isChatAllowed = status === "shortlisted" || status === "hired";

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isChatAllowed) {
      setIsLoading(false);
      return;
    }

    const supabase = supabaseRef.current;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("application_id", applicationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
      setIsLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat-${applicationId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `application_id=eq.${applicationId}`,
        },
        (payload) => {
          console.log("📩 New message received:", payload);
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === newMsg.id)) {
              return prev;
            }
            return [...prev, newMsg];
          });
        },
      )
      .subscribe((status) => {
        console.log("🔌 Subscription status:", status);
      });

    return () => {
      console.log("🔴 Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [applicationId, isChatAllowed]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isChatAllowed || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    try {
      const { data, error } = await supabaseRef.current
        .from("messages")
        .insert({
          application_id: applicationId,
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: messageContent,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === data.id)) {
            return prev;
          }
          return [...prev, data as Message];
        });
      }

      console.log("✅ Message sent successfully:", data);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getDateSeparator = (dateString: string, index: number) => {
    const date = new Date(dateString);
    const prevDate =
      index > 0 ? new Date(messages[index - 1].created_at) : null;

    if (!prevDate || date.toDateString() !== prevDate.toDateString()) {
      const now = new Date();
      const today = now.toDateString();
      const yesterday = new Date(now.getTime() - 86400000).toDateString();

      if (date.toDateString() === today) return "Today";
      if (date.toDateString() === yesterday) return "Yesterday";

      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
    return null;
  };

  if (!isChatAllowed) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        `}</style>
        <Card className="border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden bg-white dark:bg-neutral-950">
          <CardContent className="p-16">
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-neutral-900 dark:bg-neutral-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Send
                  className="h-10 w-10 text-white dark:text-neutral-900"
                  strokeWidth={2}
                />
              </div>
              <div className="space-y-3">
                <h2
                  className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Chat Locked
                </h2>
                <p
                  className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Messaging is exclusively available for shortlisted or hired
                  applications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap");

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .message-appear {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .typing-indicator {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .chat-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        .dark .chat-input:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="w-full max-w-5xl mx-auto h-[calc(100vh-6rem)]">
        <Card className="h-full border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-neutral-950">
          {/* Minimal Header */}
          <CardHeader className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-neutral-200 dark:border-neutral-800 shadow-md">
                    <AvatarFallback
                      className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-lg"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {getInitials(otherUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-neutral-900 dark:bg-neutral-100 rounded-full border-2 border-white dark:border-neutral-950"></div>
                </div>
                <div>
                  <CardTitle
                    className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {otherUserName}
                  </CardTitle>
                  <p
                    className="text-sm text-neutral-600 dark:text-neutral-400 font-medium"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {isLoading ? (
                      <span className="typing-indicator">Connecting...</span>
                    ) : (
                      "Active now"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-hidden p-0 bg-neutral-50 dark:bg-neutral-900">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <Loader2
                    className="h-12 w-12 animate-spin text-neutral-900 dark:text-neutral-100 mx-auto"
                    strokeWidth={2}
                  />
                  <p
                    className="text-sm text-neutral-600 dark:text-neutral-400 font-medium"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Loading your conversation...
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-full px-6 py-6">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md space-y-6">
                      <div className="mx-auto w-20 h-20 bg-neutral-900 dark:bg-neutral-100 rounded-2xl flex items-center justify-center shadow-lg">
                        <Send
                          className="h-10 w-10 text-white dark:text-neutral-900"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="space-y-3">
                        <h3
                          className="font-semibold text-2xl text-neutral-900 dark:text-neutral-100"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Start the Conversation
                        </h3>
                        <p
                          className="text-neutral-600 dark:text-neutral-400"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Send a message to {otherUserName} and begin your
                          discussion
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pb-4">
                    {messages.map((message, index) => {
                      const isMe = message.sender_id === currentUserId;
                      const showAvatar =
                        index === messages.length - 1 ||
                        messages[index + 1]?.sender_id !== message.sender_id;
                      const dateSeparator = getDateSeparator(
                        message.created_at,
                        index,
                      );

                      return (
                        <div key={message.id}>
                          {dateSeparator && (
                            <div className="flex items-center justify-center my-8">
                              <div className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                                <p
                                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                                  style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                  {dateSeparator}
                                </p>
                              </div>
                            </div>
                          )}

                          <div
                            className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"} message-appear`}
                          >
                            {!isMe && (
                              <Avatar
                                className={`h-9 w-9 mt-1 border-2 border-neutral-200 dark:border-neutral-800 shadow-sm ${showAvatar ? "visible" : "invisible"}`}
                              >
                                <AvatarFallback className="bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold">
                                  {getInitials(otherUserName)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div
                              className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[65%]`}
                            >
                              <div
                                className={`px-4 py-3 shadow-md ${
                                  isMe
                                    ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-3xl rounded-br-md"
                                    : "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-3xl rounded-bl-md"
                                }`}
                              >
                                <p
                                  className="text-[15px] leading-relaxed whitespace-pre-wrap break-words"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 400,
                                  }}
                                >
                                  {message.content}
                                </p>
                              </div>
                              <div
                                className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                              >
                                <p
                                  className="text-xs font-medium text-neutral-500 dark:text-neutral-500"
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                  }}
                                >
                                  {formatTime(message.created_at)}
                                </p>
                                {isMe && (
                                  <CheckCheck
                                    className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400"
                                    strokeWidth={2.5}
                                  />
                                )}
                              </div>
                            </div>

                            {isMe && (
                              <Avatar
                                className={`h-9 w-9 mt-1 border-2 border-neutral-200 dark:border-neutral-800 shadow-sm ${showAvatar ? "visible" : "invisible"}`}
                              >
                                <AvatarFallback className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold">
                                  ME
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={scrollRef} />
                  </div>
                )}
              </ScrollArea>
            )}
          </CardContent>

          {/* Minimal Input Area */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="chat-input min-h-[52px] max-h-[120px] resize-none rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 py-3.5 text-[15px] focus-visible:border-neutral-900 dark:focus-visible:border-neutral-100 focus-visible:ring-0 transition-all duration-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={isSending || !newMessage.trim()}
                className="h-[52px] w-[52px] rounded-2xl bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.5} />
                ) : (
                  <Send className="h-5 w-5" strokeWidth={2.5} />
                )}
              </Button>
            </form>
            <p
              className="text-[11px] text-neutral-500 dark:text-neutral-500 text-center mt-3 font-medium"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[10px] font-semibold">
                Enter
              </kbd>{" "}
              to send •{" "}
              <kbd className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[10px] font-semibold">
                Shift + Enter
              </kbd>{" "}
              for new line
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
