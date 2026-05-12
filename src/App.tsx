import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MenuIcon, SparklesIcon, KeyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import SidebarContent, { type ChatRoomPreview } from "@/components/SidebarContent"; // 업데이트된 SidebarContent 
import { Toaster, toast } from "sonner";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BACKEND_URL } from "./constants";
import { ChatWindow } from "@/components/ChatWindow";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [tempKey, setTempKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const [chatRooms, setChatRooms] = useState<ChatRoomPreview[]>([]);
  // 현재 방이 없으면 새로운 UUID(식별자)를 생성합니다.
  const [currentRoomId, setCurrentRoomId] = useState<string>(crypto.randomUUID());
  const [initialMessages, setInitialMessages] = useState<any[]>([]);

  // 1. API 키 인증이 유지되어 있을 때, 최초 한번 채팅방 목록 가져오기
  useEffect(() => {
    const storedApiKey = sessionStorage.getItem("apiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setTempKey(storedApiKey);
      fetchChatRooms(storedApiKey); // 검증 없이 바로 로드
    }
  }, []);

  // 2. 채팅방 목록 가져오기 함수 (GET /getChatRooms)
  const fetchChatRooms = async (key: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/getChatRooms`, {
        headers: { Authorization: key }
      });
      setChatRooms(response.data);
    } catch (e) {
      console.error(e);
      toast.error("채팅방 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 3. 채팅방 선택 함수 (GET /getMessages)
  const handleSelectRoom = async (roomId: string) => {
    // 이미 선택된 채팅방이면 스킵
    if (currentRoomId === roomId) {
      return; 
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/getMessages?roomId=${roomId}`, {
        headers: { Authorization: apiKey }
      });
      setInitialMessages(response.data); // 스레드 내용
      setCurrentRoomId(roomId); // 이 시점에 <ChatWindow key={roomId}> 로 인해 재생성 렌더링 일어남
    } catch (error) {
      console.error(error);
      toast.error("대화 내역을 불러오지 못했습니다.");
    }
  };

  // 4. 새 채팅 생성 버튼
  const handleNewRoom = () => {
    setCurrentRoomId(crypto.randomUUID()); // 새로운 방 ID 발급
    setInitialMessages([]); // 빈 방
    fetchChatRooms(apiKey); // 혹시 추가된 방이 있다면 목록 갱신
  };

  // 5. 채팅방 삭제 함수 (DELETE /deleteChat)
  const handleDeleteRoom = async (roomId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/deleteChat?roomId=${roomId}`, {
        headers: { Authorization: apiKey }
      });
      toast.success("채팅방이 삭제되었습니다.");
      
      // 목록 갱신
      setChatRooms(prev => prev.filter(r => r.roomId !== roomId));
      
      // 만약 방금 지운 방에 있었다면 새 채팅방으로 쫓아내기
      if (currentRoomId === roomId) {
        handleNewRoom();
      }
    } catch (e) {
      console.error(e);
      toast.error("삭제 실패");
    }
  };

  // API 키 저장 로직 (기존 저장 후 추가로 fetchChatRooms 실행)
  const handleSaveApiKey = async () => {
    setIsValidating(true); // 검증 시작
    try {
      const response = await axios.post(`${BACKEND_URL}/validateApiKey`, { apiKey: tempKey });

      if (response.data.valid) {
        setApiKey(tempKey);
        sessionStorage.setItem("apiKey", tempKey);
        toast.success("API 키 인증 완료!");
        fetchChatRooms(tempKey); // 인증 완료 직후 바로 목록 호출
      } else {
        // 서버에서 전달된 오류 메시지를 사용자에게 표시
        toast.error(response.data.error || "유효하지 않은 API 키입니다."); 
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "검증 실패");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <TooltipProvider>
        <div className="flex h-screen w-full bg-background text-foreground antialiased overflow-hidden font-sans">
          
          {/* 사이드바 영역: 작성한 Props 넘겨주기 */}
          <aside className="hidden md:flex w-[280px] flex-col shrink-0 border-r border-border">
            <SidebarContent 
              chatRooms={chatRooms}
              currentRoomId={currentRoomId}
              onSelectRoom={handleSelectRoom}
              onNewRoom={handleNewRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          </aside>

          <main className="flex flex-1 flex-col h-full overflow-hidden">
            <header className="flex h-16 items-center justify-between px-4 lg:px-6 shrink-0 border-b border-border/40">
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden -ml-2 rounded-full">
                      <MenuIcon className="size-5" />
                      <span className="sr-only">메뉴 열기</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] p-0 border-r-0">
                    <SheetTitle className="sr-only">사이드바 메뉴</SheetTitle>
                    {/* 모바일 화면용 드로어(Sheet)에도 동일하게 Props 전달 */}
                    <SidebarContent 
                      chatRooms={chatRooms}
                      currentRoomId={currentRoomId}
                      onSelectRoom={handleSelectRoom}
                      onNewRoom={handleNewRoom}
                      onDeleteRoom={handleDeleteRoom}
                    />
                  </SheetContent>
                </Sheet>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="text-lg font-medium tracking-tight gap-2 px-3 py-1.5 rounded-lg hidden sm:flex">
                      Gemini 3.1 <SparklesIcon className="size-4 text-blue-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>해당 모델만 지원하고 있습니다.</span>
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

            <div className="flex-1 relative overflow-hidden">
              {/* 분리한 채팅 영역 (핵심: key를 roomId로 설정!) */}
              <ChatWindow 
                key={currentRoomId} 
                apiKey={apiKey} 
                roomId={currentRoomId} 
                initialMessages={initialMessages} 
                onChatCompleted={() => fetchChatRooms(apiKey)} // 채팅 완료 시 목록 갱신
              />
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}

export default App;
