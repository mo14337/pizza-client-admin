import { Card, Col, Form, InputNumber, Row, Space } from "antd";
import { ICategory } from "../../../types";
import { Typography } from "antd";
const { Text } = Typography;

const Pricing = ({ selectedCategory }: { selectedCategory: string }) => {
  const category: ICategory | null = selectedCategory
    ? JSON.parse(selectedCategory)
    : null;
  return (
    <Card title="Product Price" bordered={false}>
      {category &&
        Object.entries(category.priceConfiguration).map(
          ([configurationKey, configurationValue]) => {
            return (
              <div key={configurationKey}>
                <Space
                  direction="vertical"
                  size={"large"}
                  style={{ width: "100%" }}
                >
                  <Text>{`${configurationKey} (${configurationValue.priceType})`}</Text>
                  <Row gutter={20}>
                    {configurationValue.availableOptions.map(
                      (option, index) => (
                        <Col span={8} key={index}>
                          <Form.Item
                            label={option}
                            name={[
                              "priceConfiguration",
                              JSON.stringify({
                                configurationKey: configurationKey,
                                priceType: configurationValue.priceType,
                              }),
                              option,
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              min={0}
                              size="large"
                              addonAfter="₹"
                            />
                          </Form.Item>
                        </Col>
                      )
                    )}
                  </Row>
                </Space>
              </div>
            );
          }
        )}
    </Card>
  );
};

export default Pricing;
