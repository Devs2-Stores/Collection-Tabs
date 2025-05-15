import { useEffect, useState } from "react";
import TinyEditor from "../../../components/Editor";
import { metafieldsService } from "../../../services/MetafieldsService";

import { Form, Input, Button, Flex, Switch, Spin } from 'antd';
const CollectionMetafieldsForm = ({ field, objectID, tabIndex }) => {
  const createFieldMutation = metafieldsService.useCreateField();
  const updateFieldMutation = metafieldsService.useUpdateField();
  const isSubmitting = createFieldMutation.isLoading || updateFieldMutation.isLoading;

  const [isDirty, setIsDirty] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [form] = Form.useForm();
  // Sử dụng useEffect để thiết lập giá trị cho form
  useEffect(() => {
    let content = field?.value ? JSON.parse(field?.value)?.content : "";
    setEditorContent(content);
    form.setFieldsValue({
      key: tabIndex,
      active: field?.value ? JSON.parse(field?.value)?.active : false,
      title: field?.value ? JSON.parse(field?.value)?.title : "",
      content: content,
    });
    setIsDirty(false);
  }, [field, form, tabIndex, isDirty]);

  const handleValuesChange = () => {
    setIsDirty(form.isFieldsTouched(true));
  };
  const handleSubmit = async (values) => {
    const payload = {
      values: JSON.stringify(values),
      objectID,
      metafieldID: field?.id || null, // Sử dụng `id` nếu cập nhật
      type: "collection", // Loại đối tượng
    };
    if (field?.id) {
      await updateFieldMutation.mutateAsync(payload);
    } else {
      await createFieldMutation.mutateAsync(payload);
    }
  };
  return (
    <>
      {isSubmitting && <Spin />}
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
      >
        <Flex gap="small" justify="end" align="center">
          <Button htmlType="submit" type="primary" loading={isSubmitting} disabled={!isDirty}>Cập nhật</Button>
        </Flex>

        <Form.Item hidden name="key" layout="horizontal">
          <Input />
        </Form.Item>

        <Form.Item label="Kích hoạt Tab" name="active" layout="horizontal" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
          <Input/>
        </Form.Item>
        <Form.Item label="Mô tả" name="content">
          <TinyEditor
            initialValue={editorContent ? JSON.parse(editorContent) : editorContent}
            onEditorChange={(content) => {
              form.setFieldValue("content", JSON.stringify(content))
              setIsDirty(true);
            }} />
        </Form.Item>
      </Form>
    </>
  );
};

export default CollectionMetafieldsForm;
