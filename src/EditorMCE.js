import { useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import useSWR from "swr";
import { URL } from "./utils";
import { simplePatchCall } from "./utils";
const EditorMCE = ({ currentNote }) => {


    const correspondingNoteID = useRef(null);

    /*
    This prevents the duplication of note contents. 
    Even if the currentNote changed during the "change" event, it would still remain the same value. 
    If I didn't use this ref, switching between notes fast could cause content duplication, since the currentNote could change right before sending the object to simplePatchCall.
    Running some test I discovered that correspondingNoteID.current stays the same during the execution of the change event, while currentNote changes.
    As a matter of fact, if the change event is fired by clicking on another note, "correspondingNoteID.current = currentNote" gets executed after the end of the event function, while currentNote changes instantly.
    
    */
    correspondingNoteID.current = currentNote;

    // retrieve data relative to the currentNote
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading, error } = useSWR(URL + `?retrieve=single&note=${currentNote}`, fetcher, { revalidateOnFocus: false });

    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (
    
    <div class="center-container">
            <div class="spinner-grow" role="status">
        </div>
    </div>
    
);

    return (
        <Editor
            tinymceScriptSrc='/tinymce/tinymce.min.js'
            initialValue={ note.content }
            init={ {
                setup: (editor) => {
                    editor.on('change', (e) => {
                        // save content changes in db
                        simplePatchCall({ content: editor.getContent(), noteID: correspondingNoteID.current });

                    });
                },
                license_key: 'gpl',
                promotion: false, // get rid of "upgrade" button
                placeholder: "Write something...",
                branding: false, // gets rid of tinyMCE watermark at the end of the editor
                menubar: true,
                toolbar_sticky: true, // makes the toolbar sticky when scrolling, it's a little buggy but I handled it
                ui_mode: "split", // without this toolbar_sticky doesn't work
                content_css: ['index.css'],
                skin: "oxide-dark", //makes the toolbar text of the right colors
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace',
                    'insertdatetime', 'media', 'table', 'wordcount', 'autosave', 'autoresize', 'codesample', 'quickbars', 'accordion'
                ],
                toolbar: 'undo redo | fontsize  |' +
                    'bold italic forecolor backcolor codesample | alignleft aligncenter ' +
                    'alignright alignjustify indent | accordion bullist numlist | charmap removeformat',
             
                    // I use content_style because these instructions don't work if put in the index.css file, they refer only to the tinyMCE editor
                    content_style: `
                body { 
                    font-family:Helvetica,Arial,sans-serif; 
                    font-size:14pt;
                    background-color: #1b1b1b;
                    color: white;
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
                /* Changes the color of the placeholder */
                .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                    color: #ffffff80;
                }
                `,
                statusbar: false, // removes a line at the end of the editor
                quickbars_insert_toolbar: false, // gets rid of the inline toolbar shown when just clicking on an empty line, I only want the selection toolbar activated
                quickbars_selection_toolbar: 'bold italic forecolor backcolor' // inline toolbar shown on selection
            } }
        />

    );
};

export default EditorMCE;