import { useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import useSWR from "swr";
import { URL } from "../utils/utils";
import { simplePatchCall } from "../utils/utils";
import "../prism/prism.css";
import "../prism/prism";
const EditorMCE = ({ currentNote }) => {

    // used to keep track of the saved content and decide wether a patch call should be executed
    const content = useRef(null);


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
    // the content ref is set here cause note is undefined before useSWR
    content.current = note.content;
    return (
        <Editor
            tinymceScriptSrc='/tinymce/tinymce.min.js'
            initialValue={ note.content }
            init={ {
                setup: (editor) => {
                    editor.on('storeDraft', (e) => {
                        // save content changes in db (fired every 1s, it gets executed only if the editor's content is different from the last one saved)
                        if (content.current !== editor.getContent()) {

                            simplePatchCall({ content: editor.getContent(), noteID: correspondingNoteID.current });
                            content.current = editor.getContent();
                        }

                    });

                    editor.on("preinit", () => {


                        document.querySelector('iframe').contentDocument.body.setAttribute("data-theme", document.body.getAttribute("data-theme"));

                    });

                    editor.on("FullScreenStateChanged", (isFullscreen) => {

                        const editorHeader = editor.container.querySelector(".tox-editor-header");
                        if (isFullscreen.state) {
                            document.querySelector(".header").style.display = "none";
                            editorHeader.classList.add("my-tox-header-sticky--fullscreen");


                        }else{
                            editorHeader.classList.remove("my-tox-header-sticky--fullscreen");
                            document.querySelector(".header").style.display = "flex";


                        }

                    });

                    editor.on('change', (e) => {
                        // save content changes in db (fired only if the user unfocuses from the editor, it gets executed only if the editor's content is different from the last one saved)
                        if (content.current !== editor.getContent()) {

                            simplePatchCall({ content: editor.getContent(), noteID: correspondingNoteID.current });
                            content.current = editor.getContent();
                        }

                    });



                },
                mobile:{
                    menubar:window.innerWidth > 360 ? true:false,
                },
                license_key: 'gpl',
                promotion: false, // get rid of "upgrade" button
                placeholder: "Write something...",
                branding: false, // gets rid of tinyMCE watermark at the end of the editor
                menubar: true,
                toolbar_sticky: true, // makes the toolbar sticky when scrolling, it's a little buggy but I handled it
                ui_mode: "split", // without this toolbar_sticky doesn't work
                autosave_interval: "1s",
                autosave_retention: '1m', //not working i think
                
                autosave_prefix:'tinymce-autosave-'+note.noteID,
                fullscreen_native:true,
                skin: localStorage.getItem("selectedTheme") === "dark" ? "oxide-dark" : "oxide", //makes sue codesample and other menu's text color is right
                autosave_ask_before_unload: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'searchreplace', 'insertdatetime', 'media', 'table', 'wordcount', 'autosave', 'autoresize', 'codesample', 'quickbars', 'accordion', 'fullscreen'
                ],
                toolbar: 'undo redo | fontsize  |' +
                    'bold italic forecolor backcolor codesample | alignleft aligncenter ' +
                    'alignright alignjustify indent | accordion bullist numlist | charmap removeformat | fullscreen',

                // I use content_style because these instructions don't work if put in the index.css file, they refer only to the tinyMCE editor
                content_style: `
                

:root {

    --primary-bg-color: #1b1b1b;
    --secondary-bg-color: #232323;
    --secondary-bg-color-hover: #3e3d3d;
    --tertiary-bg-color: #ffffff;
    --tertiary-bg-color-hover: #ffffffc9;
    --tertiary-bg-color-active: #ffffff8f;
    --quaternary-bg-color: #1d1d1d;
    /* --purple:#5f5fde; */
    --purple: #5941df;
    --purple-light: #7e64ff;
    --purple-hover: #4a33ce;
    --purple-active: #3f2da5;
    --text-color:white;
    --text-color-secondary:black;
    --editor-bg-color: #1f1f1f;
    /* this 2 values are used to make sure text is black on light surfaces and white on dark ones */
    --light: 80;
    /* the threshold at which colors are considered "light." Range: integers from 0 to 100, recommended 50 - 70 */
    --threshold: 60;
}

[data-theme="light"] {

    --primary-bg-color: #efefef;
    --secondary-bg-color: #e2e2e2;
    --secondary-bg-color-hover: #ffffff8f;
    --tertiary-bg-color: #1b1b1b;
    --tertiary-bg-color-hover: #232323;
    --tertiary-bg-color-active: #3e3d3d;
    --quaternary-bg-color: #d7d7d7;
    --text-color: black;
    --text-color-secondary: white;
    --editor-bg-color:white;
}
                   /* Changes the color of the placeholder */
                    .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                    color: var(--tertiary-bg-color-active);
                    }

                    body {
                        font-family: Helvetica, Arial, sans-serif;
                        font-size: 14pt;
                        background-color: var(--editor-bg-color);
                        color: var(--text-color);
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

                :not(pre)>code[class*=language-], pre[class*=language-]{

                    background-color:var(--secondary-bg-color);

                }

                
                `,
                codesample_global_prismjs: true,
                codesample_languages: [
                    { text: "HTML/XML", value: "markup" },
                    { text: "CSS", value: "css" },
                    { text: "JavaScript", value: "javascript" },
                    { text: "JSON", value: "json" },
                    { text: "JSX", value: "jsx" },
                    { text: "PHP", value: "php" },
                    { text: "Java", value: "java" },
                    { text: "Python", value: "python" },
                    { text: "C++", value: "cpp" },
                    { text: "C", value: "c" },
                    { text: "SQL", value: "sql" },
                    { text: "Docker", value: "docker" },
                ],
                statusbar: false, // removes a line at the end of the editor
                quickbars_insert_toolbar: false, // gets rid of the inline toolbar shown when just clicking on an empty line, I only want the selection toolbar activated
                quickbars_selection_toolbar: 'bold italic forecolor backcolor' // inline toolbar shown on selection
            } }
        />

    );
};

export default EditorMCE;