import { Form, message, Space, Upload, UploadProps } from "antd";
import { Typography } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
const { Text } = Typography;

const ProductImage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const uploadConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        messageApi.error("You can only upload JPG/PNG file!");
      }
      setImageUrl(URL.createObjectURL(file));

      return false;
    },
  };
  return (
    <>
      <Form.Item
        rules={[
          {
            required: true,
            message: "Image is required",
          },
        ]}
        label="Product Image"
        name={"image"}
      >
        <Upload {...uploadConfig} listType="picture-card">
          {contextHolder}
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            <Space direction="vertical">
              <PlusOutlined />
              <Text>Upload</Text>
            </Space>
          )}
        </Upload>
      </Form.Item>
    </>
  );
};

export default ProductImage;
