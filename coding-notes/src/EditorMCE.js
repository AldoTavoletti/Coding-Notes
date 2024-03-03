import { useEffect, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';


const EditorMCE = () => {
    const editorRef = useRef(null);

    // useEffect(()=>{

    //     const bodyElement = editorRef.current.editor.getBody().removeEventListener('blur');


    // },[]);


    return ( 
        
        <Editor
            apiKey='ih58dcotk63myxm6muyk1j8f9skgkvv956m39ggamsqe25ui'
            onInit={ (e, editor) => editorRef.current = editor }
            initialValue="<p>This is the initial content of the editor.</p>"
            init={ {
                height: 500,
                menubar: true,
                content_css: ['index.css', 'dark'],
                skin: "oxide-dark",
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;background-color: #222222 }'
            } }
        />

    );
}
 
export default EditorMCE;