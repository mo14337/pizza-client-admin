import { Card, Col, Form, Input, Row, Select, Space, Switch } from "antd";
import { ReactNode } from "react";
type ProductFilterProps = {
  children: ReactNode;
};
import { Typography } from "antd";
const { Text } = Typography;
const ProductFilters = ({ children }: ProductFilterProps) => {
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
                <Form.Item name={"category"}>
                  <Select
                    id="product-catgeory"
                    style={{ width: "100%" }}
                    allowClear
                    placeholder="Select Category"
                  >
                    <Select.Option value={"pizza"}>Pizza</Select.Option>
                    <Select.Option value={"beverages"}>Beverages</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={"tenant"}>
                  <Select
                    id="tenat"
                    style={{ width: "100%" }}
                    allowClear
                    placeholder="Select Tenant"
                  >
                    <Select.Option value={"delhi-ncr"}>Delhi Ncr</Select.Option>
                    <Select.Option value={"surat"}>Surat</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Space>
                  <Switch defaultChecked onChange={() => {}} />
                  <Text>Show Only Published</Text>
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
