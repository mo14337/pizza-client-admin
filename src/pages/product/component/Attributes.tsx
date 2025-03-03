import { Card, Col, Form, Radio, Row, Switch } from "antd";
import { Attribute, ICategory } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";

const Attributes = ({ selectedCategory }: { selectedCategory: string }) => {
  const { data: category } = useQuery<ICategory>({
    queryKey: ["category"],
    queryFn: async () => {
      return await getCategory(selectedCategory).then((res) => res.data.data);
    },
    staleTime: 1000 * 60 * 5,
  });
  if (!category) return null;
  return (
    <Card title="Attributes" bordered={false}>
      {category?.attributes?.map((attribute: Attribute) => {
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
                  {attribute.availableOptions?.map((option) => (
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
