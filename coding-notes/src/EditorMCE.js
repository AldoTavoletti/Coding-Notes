import { useEffect, useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import useSWR from "swr";
import { URL } from "./utils";
import { patchAjaxCall } from "./utils";

const EditorMCE = ({ currentNote }) => {

    const editorRef = useRef(null);
    const correspondingNoteID = useRef(null);
    //this prevents the duplication of note contents. Even if the currentNote changed during the "change" event, it would still remain the same value. If I didn't use this ref, switching between notes fast could cause content duplication, since the currentNote could change right before sending the object to ajaxPatchCall.
    correspondingNoteID.current = currentNote;

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
            initialValue={ note.content }
            init={ {
                setup: (editor) => {
                    editor.on('change', (e) => {

                        patchAjaxCall({ content: editor.getContent(), noteID: correspondingNoteID.current });

                    });
                },
                placeholder: "Write something...",
                branding: false,
                menubar: true,
                toolbar_sticky: true,
                ui_mode: "split",
                content_css: ['index.css', 'dark'],
                skin: "oxide-dark",
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace',
                    'insertdatetime', 'media', 'table', 'wordcount', 'autosave', 'autoresize', 'codesample', 'quickbars', 'accordion'
                ],
                toolbar: 'undo redo | fontsize  |' +
                    'bold italic forecolor backcolor codesample | alignleft aligncenter ' +
                    'alignright alignjustify indent | accordion bullist numlist media | charmap removeformat',
             
                    //i use content_styke caus these instructions don't work if put in the index.css file, they refer only to the tinymce editor
                    content_style: `
                body { 
                    font-family:Helvetica,Arial,sans-serif; 
                    font-size:14pt;
                    background-color: #1b1b1b
                }

                /* width */
                ::-webkit-scrollbar {
                    width: 10px;
                }

                /* Track */
                ::-webkit-scrollbar-track {
                    background: #1b1b1b;
                }

                /* Handle */
                ::-webkit-scrollbar-thumb {
                    background-color: #2f2f2f;
                }

                /* Handle on hover */
                ::-webkit-scrollbar-thumb:hover {
                    background-color: #555;
                }
                .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
  color: #ffffff80;
}
                `,
                statusbar: false,
                min_height: 700,
                quickbars_insert_toolbar: false,
                quickbars_selection_toolbar: 'bold italic forecolor backcolor'
            } }
        />

    );
};

export default EditorMCE;