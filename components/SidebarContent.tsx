import { Button } from "@/components/ui/button";
import { PlusIcon, MessageSquareIcon } from "lucide-react";

const SidebarContent = () => (
  <div className="justify-center flex flex-col h-full bg-[#f0f4f9] dark:bg-[#1e1f20] p-4">
    <Button 
      variant="outline" 
      className="w-[90%] justify-start gap-2 rounded-full shadow-sm bg-background hover:shadow-md transition-shadow"
    >
      <PlusIcon className="size-5 text-muted-foreground shrink-0" />
      새 채팅
    </Button>
    
    <div className="mt-8 flex-1 overflow-y-auto">
      <div className="text-xs font-semibold text-muted-foreground mb-3 px-2">최근</div>
      <Button variant="ghost" className="w-full justify-start gap-3 rounded-full text-left font-normal px-3">
        <MessageSquareIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">React 컴포넌트 질문</span>
      </Button>
    </div>
  </div>
);

export default SidebarContent;