import { useState } from "react";
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
  const [apiKey, setApiKey] = useState("");
  const [tempKey, setTempKey] = useState("");

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "http://localhost:8080/sendMessage",
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
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

              {/* API 키 입력 공간 */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <KeyIcon className="absolute left-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="API Key 입력..."
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    className="h-9 w-[160px] sm:w-[200px] lg:w-[240px] pl-9"
                  />
                </div>
                <Button 
                  onClick={() => setApiKey(tempKey)}
                  variant={apiKey === tempKey && apiKey !== "" ? "secondary" : "default"}
                  size="sm"
                  className="h-9"
                >
                  저장
                </Button>
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
