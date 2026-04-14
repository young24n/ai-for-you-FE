import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Thread } from "@/components/thread";
import { MenuIcon, SparklesIcon, KeyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import SidebarContent from "@/components/SidebarContent"; // SidebarContent 임포트

function App() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "http://localhost:8080/sendMessage",
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <TooltipProvider>
        <div className="flex h-screen w-full bg-background text-foreground antialiased overflow-hidden font-sans">
          
          {/* 데스크탑 전용 기본 사이드바 */}
          <aside className="hidden md:flex w-[280px] flex-col shrink-0 border-r border-border">
            <SidebarContent />
          </aside>

          {/* 메인 챗 영역 */}
          <main className="flex flex-1 flex-col h-full overflow-hidden">
            {/* 상단 헤더 */}
            <header className="flex h-16 items-center justify-between px-4 lg:px-6 shrink-0 border-b border-border/40">
              <div className="flex items-center gap-3">
                {/* 모바일 화면용 드로어(Sheet) 사이드바 */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden -ml-2 rounded-full">
                  <MenuIcon className="size-5" />
                      <span className="sr-only">메뉴 열기</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] p-0 border-r-0">
                    <SheetTitle className="sr-only">사이드바 메뉴</SheetTitle>
                    <SidebarContent />
                  </SheetContent>
                </Sheet>

                <Button variant="ghost" className="text-lg font-medium tracking-tight gap-2 px-3 py-1.5 rounded-lg hidden sm:flex">
                  Gemini <SparklesIcon className="size-4 text-blue-500" />
                </Button>
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
