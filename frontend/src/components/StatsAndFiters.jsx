import React from "react";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import { FilterTypeVN, FilterTypeCN } from "@/lib/data";
import { Badge } from "./ui/badge";

const StatsAndFiters = ({
  completedTasksCount = 0,
  activeTasksCount = 0,
  filter = "all",
  setFilter,
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      {/* Phần thống kê */}
      <div className="flex gap-3">
        <Badge
          variant="secondary"
          className="bg-white/50 text-accent-foreground border-info/20"
        >
          {activeTasksCount} {FilterTypeVN.active}
        </Badge>
        <Badge
          variant="secondary"
          className="bg-white/50 text-success border-success/20"
        >
          {completedTasksCount} {FilterTypeVN.completed}
        </Badge>
      </div>
      {/* Phần tìm kiếm */}
      <div className="flex flex-col gap-2 sm:flex-row ">
        {Object.keys(FilterTypeVN).map((type) => (
          <Button
            key={type}
            variant={filter === type ? "gradient" : "ghost"}
            size="sm"
            className="capitalize"
            onClick={() => setFilter(type)}
          >
            <Filter className="size-4" />
            {FilterTypeVN[type]}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StatsAndFiters;
