import { useState, useEffect } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Thread } from "@/components/thread";
import { MenuIcon, SparklesIcon, KeyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import SidebarContent from "@/components/SidebarContent"; // SidebarContent 임포트
import { Toaster, toast } from "sonner"; // Sonner 추가
import axios from "axios";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BACKEND_URL } from "./constants";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [tempKey, setTempKey] = useState("");
  const [isValidating, setIsValidating] = useState(false); // 검증 상태 관리

  // 컴포넌트 마운트 시 Session Storage에서 API 키 확인
  useEffect(() => {
    const storedApiKey = sessionStorage.getItem("apiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setTempKey(storedApiKey); // 입력 필드도 채움
    }
  }, []);

  const handleSaveApiKey = async () => {
    setIsValidating(true); // 검증 시작
    try {
      const response = await axios.post(`${BACKEND_URL}/validateApiKey`, {
        apiKey: tempKey,
      });

      if (response.data.valid) {
        setApiKey(tempKey);
        sessionStorage.setItem("apiKey", tempKey); // Session Storage에 저장
        toast.success("API 키가 유효합니다!"); // 성공 알림
      } else {
        // 서버에서 전달된 오류 메시지를 사용자에게 표시
        toast.error(response.data.error || "유효하지 않은 API 키입니다."); 
      }
    } catch (error) {
      console.error("API 키 검증 요청 실패:", error);

      // `error`가 AxiosError인지 확인
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error); // 서버에서 전달된 오류 메시지
        } else {
          toast.error("서버와 통신 중 문제가 발생했습니다."); // 일반적인 네트워크 오류 메시지
        }
      } else if (error instanceof Error) {
        // 일반적인 Error 객체 처리
        toast.error(error.message);
      } else {
        // 알 수 없는 오류 처리
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsValidating(false); // 검증 종료
    }
  };

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "${BACKEND_URL}/sendMessage",
      headers: apiKey ? { Authorization: `${apiKey}` } : undefined,
    }),
  });

  return (
    <>
      <Toaster position="top-center" richColors /> {/* Sonner Toaster 추가 */}
      <AssistantRuntimeProvider runtime={runtime}>
        <TooltipProvider>
          <div className="flex h-screen w-full bg-background text-foreground antialiased overflow-hidden font-sans">
            
            {/* 데스크탑 전용 기본 사이드바 */}
            <aside className="hidden md:flex w-[280px] flex-col shrink-0 border-r border-border">
              <SidebarContent />
            </aside>

            {/* 메인 채팅 영역 */}
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

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="text-lg font-medium tracking-tight gap-2 px-3 py-1.5 rounded-lg hidden sm:flex">
                        GPT-4o <SparklesIcon className="size-4 text-blue-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>죄송합니다 현재 할당량 초과로 해당 모델만 지원하고 있습니다.</span>
                    </TooltipContent>
                  </Tooltip>
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
                    onClick={handleSaveApiKey} // 저장 버튼 클릭 시 서버 검증 요청
                    variant={apiKey === tempKey && apiKey !== "" ? "secondary" : "default"}
                    size="sm"
                    className="h-9"
                    disabled={isValidating} // 검증 중에는 버튼 비활성화
                  >
                    {isValidating ? "검증 중..." : "저장"}
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
    </>
  );
}

export default App;
