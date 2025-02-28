import { Card, Col, Form, Input, Row, Select, Space, Switch } from "antd";
import { ReactNode } from "react";
type ProductFilterProps = {
  children: ReactNode;
};
import { Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import { ICategory, Tenant } from "../../../types";
import { useAuthStore } from "../../../store";
const { Text } = Typography;
const ProductFilters = ({ children }: ProductFilterProps) => {
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
      <Card>
        <Row justify={"space-between"}>
          <Col span={16}>
            <Row gutter={20}>
              <Col span={6}>
                <Form.Item name={"q"}>
                  <Input.Search placeholder="Search" allowClear />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={"categoryId"}>
                  <Select
                    id="product-catgeory"
                    style={{ width: "100%" }}
                    allowClear
                    placeholder="Select Category"
                  >
                    {catgeoryData?.map((item: ICategory) => {
                      return (
                        <Select.Option key={item._id} value={item._id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              {user!.role === "admin" && (
                <Col span={6}>
                  <Form.Item name={"tenantId"}>
                    <Select
                      id="tenant"
                      style={{ width: "100%" }}
                      allowClear
                      placeholder="Select Tenant"
                    >
                      {tenantData?.map((item: Tenant) => {
                        return (
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              <Col span={6}>
                <Space>
                  <Form.Item name={"isPublish"}>
                    <Switch />
                  </Form.Item>
                  <Text style={{ marginBottom: 22, display: "block" }}>
                    Show Only Published
                  </Text>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
            {children}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ProductFilters;
