import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Thread } from "@/components/thread";
import { MenuIcon, PlusIcon, SparklesIcon, MessageSquareIcon } from "lucide-react";

function App() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "http://localhost:8080/sendMessage",
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <TooltipProvider>
        <div className="flex h-screen w-full bg-white dark:bg-[#131314] text-[#1f1f1f] dark:text-[#e3e3e3] antialiased overflow-hidden font-sans">
          
          {/* 사이드바 */}
          <aside className="hidden md:flex w-[280px] flex-col bg-[#f0f4f9] dark:bg-[#1e1f20] transition-colors p-4">
            <button className="flex w-full items-center gap-2 rounded-full bg-white dark:bg-[#131314] px-4 py-3 text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <PlusIcon className="size-5 text-gray-500" />
              새 채팅
            </button>
            
            <div className="mt-8 flex-1 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2">최근</div>
              <button className="flex items-center gap-3 w-full rounded-full px-3 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left">
                <MessageSquareIcon className="size-4 shrink-0 text-gray-400" />
                <span className="truncate">React 컴포넌트 질문</span>
              </button>
            </div>
          </aside>

          {/* 메인 챗 영역 */}
          <main className="flex flex-1 flex-col h-full bg-white dark:bg-[#131314] overflow-hidden">
            {/* 상단 헤더 */}
            <header className="flex h-16 items-center justify-between px-4 lg:px-6 shrink-0">
              <div className="flex items-center gap-3">
                <button className="md:hidden p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300">
                  <MenuIcon className="size-5" />
                </button>
                <button className="flex items-center gap-2 text-lg font-medium tracking-tight bg-transparent hover:bg-black/5 dark:hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                  Gemini <SparklesIcon className="size-4 text-blue-500" />
                </button>
              </div>
              <div className="size-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                U
              </div>
            </header>

            {/* 채팅창 컨테이너 */}
            <div className="flex-1 relative overflow-hidden">
              <Thread />
            </div>
          </main>
        </div>
      </TooltipProvider>
    </AssistantRuntimeProvider>
  );
}

export default App;
