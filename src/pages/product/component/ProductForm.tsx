import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Switch } from "antd";
import { getCategories, getTenants } from "../../../http/api";
import { ICategory, Tenant } from "../../../types";
import { Typography } from "antd";
import { useWatch } from "antd/es/form/Form";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImage from "./ProductImage";
import { useAuthStore } from "../../../store";
const { Text } = Typography;

const ProductForm = () => {
  const selectedCategory = useWatch("categoryId");
  const { user } = useAuthStore();
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
                  <ProductImage />
                </Col>
              </Row>
            </Card>
            {selectedCategory && (
              <Pricing selectedCategory={selectedCategory} />
            )}
            {selectedCategory && (
              <Attributes selectedCategory={selectedCategory} />
            )}
            {user?.role !== "manager" && (
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
            )}
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
