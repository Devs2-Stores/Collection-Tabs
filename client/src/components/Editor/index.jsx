import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyEditor = () => {
  const editorRef = useRef(null);
  
    return (
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={"value"}
        init={{ 
          height: 500,
          menubar: "file edit insert",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
          ],
          toolbar:
            "undo redo accordion accordionremove | blocks fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | outdent indent| forecolor backcolor removeformat code",
          branding: false,
        }}
        onEditorChange={(content) => console.log(1)}
      />
    );
};

export default TinyEditor;
