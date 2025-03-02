import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Upload,
  UploadProps,
} from "antd";
import { getCategories, getTenants } from "../../../http/api";
import { ICategory, Tenant } from "../../../types";
import { PlusOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useWatch } from "antd/es/form/Form";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import { useState } from "react";
const { Text } = Typography;

const ProductForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const selectedCategory = useWatch("categoryId");
  const { data: tenantData } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      return await getTenants().then((res) => res.data.data);
    },
  });
  const { data: catgeoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await getCategories().then((res) => res.data.data);
    },
  });
  const uploadConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === "image/jpeg";
      if (!isJpgOrPng) {
        messageApi.error("You can only upload JPG/PNG file!");
      }
      setImageUrl(URL.createObjectURL(file));

      return false;
    },
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <Space direction="vertical" size="middle">
            <Card title="Product Info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Product name is required",
                      },
                    ]}
                    label="Product Name"
                    name={"name"}
                  >
                    <Input placeholder="Product Name" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Category is required",
                      },
                    ]}
                    label="Category"
                    name={"categoryId"}
                  >
                    <Select
                      style={{ width: "100%" }}
                      allowClear
                      placeholder="Select Category"
                      size="large"
                    >
                      {catgeoryData.map((category: ICategory) => (
                        <Select.Option
                          key={category._id}
                          value={JSON.stringify(category)}
                        >
                          {category.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Description is required",
                      },
                    ]}
                    label="Description"
                    name={"description"}
                  >
                    <Input.TextArea
                      rows={2}
                      maxLength={200}
                      placeholder="Description"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Product Image" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
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
                    {contextHolder}
                    <Upload {...uploadConfig} listType="picture-card">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <Space direction="vertical">
                          <PlusOutlined />
                          <Text>Upload</Text>
                        </Space>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            {selectedCategory && (
              <Pricing selectedCategory={selectedCategory} />
            )}
            {selectedCategory && (
              <Attributes selectedCategory={selectedCategory} />
            )}
            <Card title="Tenant info" bordered={false}>
              <Row gutter={20}>
                <Col span={24}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Tenant is required",
                      },
                    ]}
                    label="Tenant"
                    name={"tenantId"}
                  >
                    <Select
                      style={{ width: "100%" }}
                      allowClear
                      placeholder="Select Tenant"
                      size="large"
                    >
                      {tenantData?.map((tenant: Tenant) => {
                        return (
                          <Select.Option key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="Other info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Space>
                    <Form.Item name={"isPublish"}>
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                    <Text style={{ marginBottom: 22, display: "block" }}>
                      Published
                    </Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default ProductForm;
