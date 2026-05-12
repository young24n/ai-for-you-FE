import { Button } from "@/components/ui/button";
import { PlusIcon, MessageSquareIcon, Trash2Icon } from "lucide-react";
// 새로 설치한 AlertDialog 관련 컴포넌트 임포트
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface ChatRoomPreview {
  roomId: string;
  title: string;
  updatedAt: string;
}

interface SidebarContentProps {
  chatRooms: ChatRoomPreview[];
  currentRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onNewRoom: () => void;
  onDeleteRoom: (roomId: string) => void;
}

const SidebarContent = ({
  chatRooms,
  currentRoomId,
  onSelectRoom,
  onNewRoom,
  onDeleteRoom
}: SidebarContentProps) => (
  <div className="justify-center flex flex-col h-full bg-[#f0f4f9] dark:bg-[#1e1f20] p-4">
    <Button 
      variant="outline" 
      onClick={onNewRoom}
      className="w-[90%] justify-start gap-2 rounded-full shadow-sm bg-background hover:shadow-md transition-shadow"
    >
      <PlusIcon className="size-5 text-muted-foreground shrink-0" />
      새 채팅
    </Button>
    
    <div className="mt-8 flex-1 overflow-y-auto">
      <div className="text-xs font-semibold text-muted-foreground mb-3 px-2">최근 채팅</div>
      
      {chatRooms.map((room) => (
        <div key={room.roomId} className="flex items-center group w-full mb-1">
          <Button 
            variant={currentRoomId === room.roomId ? "secondary" : "ghost"}
            onClick={() => onSelectRoom(room.roomId)}
            className="flex-1 justify-start gap-3 rounded-full text-left font-normal px-3 truncate"
          >
            <MessageSquareIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{room.title || "새 대화"}</span>
          </Button>

          {/* 삭제 버튼을 AlertDialog 트리거로 감싸줍니다 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-muted-foreground opacity-50 hover:opacity-100 hover:text-red-500"
                title="채팅방 삭제"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>채팅방을 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 행동은 되돌릴 수 없으며, 채팅 내용이 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                {/* 확인 시 실제로 onDeleteRoom 함수를 호출 */}
                <AlertDialogAction 
                  onClick={() => onDeleteRoom(room.roomId)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  삭제하기
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* 변경 완료 */}
        </div>
      ))}

      {chatRooms.length === 0 && (
        <div className="text-sm text-center text-muted-foreground mt-4">
          채팅 내역이 없습니다.
        </div>
      )}
    </div>
  </div>
);

export default SidebarContent;