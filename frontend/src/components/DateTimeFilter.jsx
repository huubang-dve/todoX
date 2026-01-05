import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { options } from "@/lib/data";

const DateTimeFilter = ({ dateQuery, setDateQuery }) => {
  const [open, setOpen] = React.useState(false);

  // --- TỐI ƯU: Tìm label hiển thị ---
  const selectedLabel = React.useMemo(() => {
    return (
      options.find((option) => option.value === dateQuery)?.label || "Tất cả"
    );
  }, [dateQuery]);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between shadow-sm hover:bg-accent transition-colors"
        >
          {/* Hiển thị label đã chọn hoặc mặc định */}
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 opacity-50 size-4 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[200px] p-0"
        align="end"
      >
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  // --- TỐI ƯU: Cập nhật state và đóng popover ---
                  onSelect={(currentValue) => {
                    // Shadcn Command đôi khi trả về value viết thường,
                    // ta nên dùng trực tiếp option.value để chính xác nhất
                    setDateQuery(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto size-4",
                      dateQuery === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimeFilter;
