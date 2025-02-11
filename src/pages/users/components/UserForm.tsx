import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = () => {
  const { data: tenantData } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      return await getTenants().then((res) => res.data);
    },
  });
  console.log(tenantData);
  return (
    <>
      <Row>
        <Col span={24}>
          <Space direction="vertical" size={"large"}>
            <Card title="Basic Info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "First name is required",
                      },
                    ]}
                    label="First Name"
                    name={"firstName"}
                  >
                    <Input placeholder="First Name" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Last name is required",
                      },
                    ]}
                    label="Last Name"
                    name={"lastName"}
                  >
                    <Input placeholder="Last Name" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Email is required",
                      },
                      {
                        type: "email",
                        message: "Email is not valid",
                      },
                    ]}
                    label="Email"
                    name={"email"}
                  >
                    <Input placeholder="Email" size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Security Info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Password is required",
                      },
                    ]}
                    label="Password"
                    name={"password"}
                  >
                    <Input.Password placeholder="Password" size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Role Info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Role is required",
                      },
                    ]}
                    label="Role"
                    name={"role"}
                  >
                    <Select
                      style={{ width: "100%" }}
                      allowClear
                      placeholder="Select Role"
                      size="large"
                    >
                      <Select.Option value={"admin"}>Admin</Select.Option>
                      <Select.Option value={"manager"}>Manager</Select.Option>
                      <Select.Option value={"customer"}>Customer</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
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
                          <Select.Option value={tenant.id}>
                            {tenant.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default UserForm;
