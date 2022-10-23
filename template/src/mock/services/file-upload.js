import Mock from "mockjs";
import { builder, getBody } from "../util";

const fileInfo = (_params) => {
  const mockData = {
    fileName: "文件-89.docx",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  };
  const data = Mock.mock(mockData);
  return builder(data, "success", 0);
};
const useMockFileUpload = () => {
  Mock.mock(/\/api\/file\/upload/, "post", fileInfo);
};

export default useMockFileUpload;
