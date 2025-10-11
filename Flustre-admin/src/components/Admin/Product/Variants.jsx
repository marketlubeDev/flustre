import React, { useState } from 'react';
import { Button, Input, Space, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const Variants = ({ onVariantsChange }) => {
    const [variants, setVariants] = useState([]);

    const handleVariantChange = (index, event) => {
        const { name, value } = event.target;
        const updatedVariants = [...variants];
        updatedVariants[index][name] = value;
        setVariants(updatedVariants);
        onVariantsChange(updatedVariants); // Notify parent component
    };

    const addVariant = () => {
        setVariants([...variants, { size: '', color: '', price: '' }]);
    };

    const removeVariant = (index) => {
        const updatedVariants = variants.filter((_, i) => i !== index);
        setVariants(updatedVariants);
        onVariantsChange(updatedVariants); // Notify parent component
    };

    return (
        <div>
            {variants.map((variant, index) => (
                <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item>
                        <Input
                            name="size"
                            placeholder="Size"
                            value={variant.size}
                            onChange={(e) => handleVariantChange(index, e)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input
                            name="color"
                            placeholder="Color"
                            value={variant.color}
                            onChange={(e) => handleVariantChange(index, e)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input
                            name="price"
                            placeholder="Price"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, e)}
                        />
                    </Form.Item>
                    <Button
                        type="danger"
                        onClick={() => removeVariant(index)}
                        icon={<DeleteOutlined />}
                    />
                </Space>
            ))}
            <Form.Item>
                <Button type="dashed" onClick={addVariant} icon={<PlusOutlined />}>
                    Add Variant
                </Button>
            </Form.Item>
        </div>
    );
};

export default Variants;
