import TinyEditor from "../../../components/Editor";
import { useSearchParams } from "react-router";
import { metafieldsService } from "../../../services/MetafieldsService";
import Spinner from "../../../components/Spinner";

import { Form, Input, Checkbox, Button, Flex, Typography } from 'antd';
const CollectionMetafieldsForm = ({ field, objectID }) => {
  const [form] = Form.useForm();
  const initialValues = {
    active: JSON.parse(field?.value)?.active,
    title: JSON.parse(field?.value)?.title || "",
    content: JSON.parse(field?.value)?.content || "",
  };
  const { mutate: updateField } = metafieldsService.useUpdateField();
  const handleSubmit = (values) => {
    const payload = {
      values: JSON.stringify(values),
      objectID,
      metafieldID: field.id || null, // Sử dụng `id` nếu cập nhật
      type: "collection", // Loại đối tượng
    };
    if (field?.id) {
      updateField(payload);
    } else {
      createField(payload);
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      className="w-full"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Flex gap="small" justify="end" align="center">
        <Button htmlType="submit" type="primary">Lưu</Button>
        <Button htmlType="button" type="primary" danger >Xóa Tab</Button>
      </Flex>

      <Form.Item label="Trạng thái kích hoạt" name="active" layout="horizontal" valuePropName="checked">
        <Checkbox/>
      </Form.Item> 
      <Form.Item label="Tiêu đề" name="title">
        <Input />
      </Form.Item>
      <Form.Item label="Mô tả" name="content">
        <TinyEditor
          initialValue={initialValues.content}
          onEditorChange={(content) => form.setFieldValue("content", JSON.stringify(content))} />
      </Form.Item>
    </Form>
  );
};

export default CollectionMetafieldsForm;
