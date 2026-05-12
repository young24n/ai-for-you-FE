import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/thread";
import { toast } from "sonner";
import { BACKEND_URL } from "@/src/constants";

interface ChatWindowProps {
  apiKey: string;
  roomId: string;
  initialMessages: any[];
  onChatCompleted: () => void;
}

export function ChatWindow({ 
  apiKey, 
  roomId, 
  initialMessages,
  onChatCompleted 
}: ChatWindowProps) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: `${BACKEND_URL}/sendMessage`,
      headers: apiKey ? { Authorization: `${apiKey}` } : undefined,
      body: { roomId } 
    }),
    messages: initialMessages,
    onError: (error) => {
      toast.error(`Runtime Error: ${error.message || "알 수 없는 오류"}`);
    },
    onFinish: () => {
      onChatCompleted();
    }
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}
