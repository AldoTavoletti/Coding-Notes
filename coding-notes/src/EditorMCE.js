import { useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import useSWR from "swr";
import { URL } from "./utils";
import { patchAjaxCall } from "./utils";

const EditorMCE = ({currentNote}) => {
    
    const editorRef = useRef(null);
    
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading, error } = useSWR(URL + `?retrieve=single&note=${currentNote}`, fetcher, { revalidateOnFocus: false });

    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (<div></div>);

    return ( 
        <Editor
            apiKey='ih58dcotk63myxm6muyk1j8f9skgkvv956m39ggamsqe25ui'
            onInit={ (e, editor) => {
                editorRef.current = editor;

            } }
            initialValue={note.content}
            init={ {
                setup: (editor)=>{
                    editor.on('change',(e)=>{
                        patchAjaxCall({content:editor.getContent(),noteID:currentNote});
                    });

                },
                toolbar_sticky:true,
                branding:false,
                menubar: false,
                content_css: ['index.css', 'dark'],
                skin: "oxide-dark",
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'wordcount','autosave','autoresize','codesample','quickbars','accordion'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor codesample | accordion alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | removeformat',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;background-color: #222222 }',
                min_height:700,
                quickbars_insert_toolbar: false,
            } }
        />

    );
}
 
export default EditorMCE;