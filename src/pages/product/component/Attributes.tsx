import { Card, Col, Form, Radio, Row, Switch } from "antd";
import { Attribute, ICategory } from "../../../types";

const Attributes = ({ selectedCategory }: { selectedCategory: string }) => {
  const category: ICategory | null = selectedCategory
    ? JSON.parse(selectedCategory)
    : null;
  if (!category) return null;
  return (
    <Card title="Attributes" bordered={false}>
      {category.attributes.map((attribute: Attribute) => {
        return (
          <div key={attribute._id}>
            {attribute.widgetType === "radio" ? (
              <Form.Item
                label={attribute.name}
                name={["attributes", attribute.name]}
                initialValue={attribute.defaultValue}
                rules={[
                  {
                    required: true,
                    message: `Please select ${attribute.name}`,
                  },
                ]}
              >
                <Radio.Group>
                  {attribute.availableOptions.map((option) => (
                    <Radio.Button key={option} value={option}>
                      {option}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            ) : attribute.widgetType === "switch" ? (
              <Row>
                <Col>
                  <Form.Item
                    label={attribute.name}
                    name={["attributes", attribute.name]}
                    valuePropName="checked"
                    initialValue={attribute.defaultValue}
                  >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </div>
        );
      })}
    </Card>
  );
};

export default Attributes;
