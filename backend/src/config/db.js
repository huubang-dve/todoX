import mongoose from "mongoose";

export const connectDB = async () => {
  // làm việc với hàm bất đồng bộ phải dùng try-catch
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

    console.log("Liên kế cơ sở dữ liệu thành công!");
  } catch (error) {
    console.error("Lỗi khi kết nối cơ sở dữ liệu: ", error);
    process.exit(1); // exit khi lỗi: 1 là exit khi thất bại, 0 là exit khi thành công
  }
};
