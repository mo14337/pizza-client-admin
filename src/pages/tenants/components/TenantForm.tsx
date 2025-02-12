import { Card, Col, Form, Input, Row, Space } from "antd";

const TenantForm = () => {
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
                        message: "Tenant name is required",
                      },
                    ]}
                    label="Tenant Name"
                    name={"name"}
                  >
                    <Input placeholder="Tenant Name" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Address is required",
                      },
                    ]}
                    label="Tenant Address"
                    name={"address"}
                  >
                    <Input placeholder="Tenant Address" size="large" />
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

export default TenantForm;
