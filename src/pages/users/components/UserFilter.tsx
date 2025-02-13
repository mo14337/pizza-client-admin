import { Card, Col, Form, Input, Row, Select } from "antd";
import { ReactNode } from "react";
type UserFilterProps = {
  children: ReactNode;
};

const UserFilter = ({ children }: UserFilterProps) => {
  return (
    <>
      <Card>
        <Row justify={"space-between"}>
          <Col span={16}>
            <Row gutter={20}>
              <Col span={8}>
                <Form.Item name={"q"}>
                  <Input.Search placeholder="Search" allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={"role"}>
                  <Select
                    style={{ width: "100%" }}
                    allowClear
                    placeholder="Select Role"
                  >
                    <Select.Option value={"admin"}>Admin</Select.Option>
                    <Select.Option value={"manager"}>Manager</Select.Option>
                    <Select.Option value={"customer"}>Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col span={8}>
                <Select
                  style={{ width: "100%" }}
                  allowClear
                  placeholder="Status"
                  onChange={(selectedItem) =>
                    onFilterChange("statusFilter", selectedItem)
                  }
                >
                  <Select.Option value={"ban"}>Ban</Select.Option>
                  <Select.Option value={"active"}>Active</Select.Option>
                </Select>
              </Col> */}
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

export default UserFilter;
