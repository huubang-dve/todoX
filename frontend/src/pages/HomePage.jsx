import Footer from "@/components/Footer";
import DateTimeFilter from "@/components/DateTimeFilter";
import TaskListPagination from "@/components/TaskListPagination";
import TaskList from "@/components/TaskList";
import StatsAndFiters from "@/components/StatsAndFiters";
import AddTask from "@/components/AddTask";
import Header from "@/components/Header";
import React, { useState, useEffect, useMemo } from "react"; // Tối ưu: Thêm useMemo
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);

  // --- STATE QUẢN LÝ UI/UX ---
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("all");
  const [page, setPage] = useState(1);

  // --- LOGIC GỌI API ---
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      // Giả định res.data trả về đúng cấu trúc { tasks, activeCount, completedCount }
      setTaskBuffer(res.data.tasks || []);
      setActiveTaskCount(res.data.activeCount || 0);
      setCompletedTaskCount(res.data.completedCount || 0);
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks", error);
      toast.error("Lỗi xảy ra khi tải danh sách nhiệm vụ.");
    }
  };

  // --- EFFECTS ---

  // Gọi API khi thay đổi bộ lọc thời gian
  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  // Tối ưu: Tự động quay về trang 1 khi người dùng đổi Filter hoặc đổi Ngày
  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  // --- LOGIC XỬ LÝ DỮ LIỆU (MEMOIZED) ---

  // Tối ưu: Dùng useMemo để chỉ tính toán lại danh sách lọc khi dữ liệu gốc hoặc filter thay đổi
  const filteredTasks = useMemo(() => {
    return taskBuffer.filter((task) => {
      if (filter === "active") return task.status === "active";
      if (filter === "completed") return task.status === "completed";
      return true;
    });
  }, [taskBuffer, filter]);

  // Tính toán tổng số trang dựa trên danh sách đã lọc
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit) || 1;

  // Lấy danh sách nhiệm vụ hiển thị cho trang hiện tại
  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  // Tối ưu: Xử lý an toàn khi xóa task cuối cùng ở một trang
  // Dùng useEffect để tránh lỗi "Too many re-renders"
  useEffect(() => {
    if (visibleTasks.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [visibleTasks.length, page]);

  // --- EVENT HANDLERS ---
  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // --- RENDER ---
  return (
    <div className="relative w-full min-h-screen">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(45deg, #FFB3D9 0%, #FFD1DC 20%, #FFF0F5 40%, #E6F3FF 60%, #D1E7FF 80%, #C7E9F1 100%)`,
        }}
      />

      <div className="container relative z-10 pt-8 mx-auto">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          <Header />

          <AddTask handleNewTaskAdded={handleTaskChanged} />

          <StatsAndFiters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completedTaskCount}
          />

          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter
              dateQuery={dateQuery}
              setDateQuery={setDateQuery}
            />
          </div>

          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completedTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
