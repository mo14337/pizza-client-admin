import { Card, Col, Form, InputNumber, Row, Space } from "antd";
import { Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";
import { ICategory } from "../../../types";
const { Text } = Typography;

const Pricing = ({ selectedCategory }: { selectedCategory: string }) => {
  const { data: category } = useQuery<ICategory>({
    queryKey: ["category"],
    queryFn: async () => {
      return await getCategory(selectedCategory).then((res) => res.data.data);
    },
    staleTime: 1000 * 60 * 5,
  });
  if (!category) return null;
  return (
    <Card title="Product Price" bordered={false}>
      {category &&
        Object.entries(category?.priceConfiguration)?.map(
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
                    {configurationValue.availableOptions?.map(
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
