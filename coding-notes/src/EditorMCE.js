import { useEffect, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import useSWR from "swr";
import { URL } from "./utils";
import { patchAjaxCall } from "./utils";

const EditorMCE = ({currentNote}) => {
    console.log('editorMCE rerendered!');
    
    const editorRef = useRef(null);

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading, error } = useSWR(URL + `?retrieve=single&note=${currentNote}`, fetcher);

    const isPatching = useRef(false);

    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>);


    return ( 
        
        <Editor
            apiKey='ih58dcotk63myxm6muyk1j8f9skgkvv956m39ggamsqe25ui'
            onInit={ (e, editor) => editorRef.current = editor }
            initialValue={note.content}
            init={ {
                height: 500,
                setup: (editor)=>{

                    editor.on('change',(e)=>{

                        patchAjaxCall({content:editor.getContent(),noteID:currentNote});

                    });

                },
                menubar: true,
                content_css: ['index.css', 'dark'],
                skin: "oxide-dark",
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount','autosave'
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