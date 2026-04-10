import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Thread } from "@/components/thread";

function App() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <TooltipProvider>
        <div>
          <Thread />
        </div>
      </TooltipProvider>
    </AssistantRuntimeProvider>
  );
}

export default App;
