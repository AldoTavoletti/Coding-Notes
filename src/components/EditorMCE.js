import { useEffect, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import useSWR from "swr";
import { URL } from "../utils/utils";
import { simplePatchCall } from "../utils/utils";
import "../prism/prism.css";
import "../prism/prism";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { useState } from "react";

const EditorMCE = ({ currentNote, contextMenuInfo, setContextMenuInfo }) => {

    // used to keep track of the saved content and decide wether a patch call should be executed
    const content = useRef(null);
    const [isReady, setIsReady] = useState(false);

    // retrieve data relative to the currentNote
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading, error, mutate } = useSWR(URL + `?retrieve=single&note=${currentNote.noteID}`, fetcher, { revalidateOnFocus: false });

    /*
    this useEffect is used to guarantee a smooth menu transition. 
    If the extended menu gets closed, and the current note has a lot of text, its animation may be rough. Making editorMCE load 200 ms later
    this problem gets resolved. The isReady state variable makes sure the loading screen is shown when its value is false.
    */
    useEffect(() => {

        setTimeout(() => {

            setIsReady(true);

        }, 200);

    }, []);

    useEffect(()=>{

        mutate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentNote]);

    if (error) return (<div></div>);
    if (!note || isLoading || isValidating || !isReady) return (

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
                        if (content.current !== editor.getContent()) {


                            let controller = new AbortController();

                            const patchPromise = new Promise((resolve, reject) => {

                                const abortListener = ({ target }) => {
                                    controller.signal.removeEventListener('abort', abortListener);
                                    reject(target.reason);
                                };
                                controller.signal.addEventListener('abort', abortListener);

                                simplePatchCall({ content: editor.getContent(), noteID: currentNote.noteID });
                                content.current = editor.getContent();

                                resolve('Success');


                            });

                            controller.abort('cancelled reason'); 

                            toast.promise(patchPromise, {

                                pending: "Saving content...",
                                success: "Content saved!",
                                error: "The content hasn't been saved."

                            }).catch(error => {
                                if (error === 'Operation aborted') {
                                    toast.error('Previous operation was aborted');
                                }
                            });;

                        }

                    });

                    editor.on("preinit", () => {
                        // before the note gets initialized, change the data-theme attribute of the iframe' contentDocument's body, so that css style changes according to the theme
                        document.querySelector('iframe').contentDocument.body.setAttribute("light-theme", document.body.getAttribute("light-theme"));

                    });

                    editor.on("click", () => {
                        // close the contextmenu if open
                        contextMenuInfo.x && setContextMenuInfo({ x: null, y: null, element: null });

                    });

                    editor.on("FullScreenStateChanged", (isFullscreen) => {
                        // get the header of the editor
                        const editorHeader = editor.container.querySelector(".tox-editor-header");

                        if (isFullscreen.state) /* if the fullscreen mode is activated */ {

                            // get rid of the header containing the note's title
                            document.querySelector(".header").style.display = "none";

                            // make the editorHeader full width. There is no need to remove previous classes, since this class has more specificity in the css file (div.tox-editor-header.my-tox-header-sticky--fullscreen)
                            editorHeader.classList.add("my-tox-header-sticky--fullscreen");


                        } else {

                            //remove the class
                            editorHeader.classList.remove("my-tox-header-sticky--fullscreen");

                            // show the header containing the note's title
                            document.querySelector(".header").style.display = "flex";


                        }

                    });

                    editor.on('change', (e) => {

                        // save content changes in db (fired only if the user unfocuses from the editor, it gets executed only if the editor's content is different from the last one saved)
                        if (content.current !== editor.getContent()) {

                            simplePatchCall({ content: editor.getContent(), noteID: currentNote.noteID });

                            // save the content in the ref variable
                            content.current = editor.getContent();
                        }

                    });


                },
                mobile: {
                    menubar: window.innerWidth > 360 ? true : false, // if the width is less than 361px, the menubar would wrap
                },
                license_key: 'gpl',
                promotion: false, // get rid of "upgrade" button
                placeholder: "Write something...",
                branding: false, // gets rid of tinyMCE watermark at the end of the editor
                menubar: true,
                toolbar_sticky: true, // makes the toolbar sticky when scrolling, it's a little buggy but I handled it
                ui_mode: "split", // without this toolbar_sticky doesn't work
                autosave_interval: "2s",
                autosave_retention: '1m', //not working i think
                contextmenu: false, // if this is true, when pressing the right button a toolbar with the "link" option would appear
                autosave_prefix: 'tinymce-autosave-' + note.noteID,
                fullscreen_native: true,
                skin: localStorage.getItem("light-theme") ? "oxide" : "oxide-dark", //makes the codesample and the menu's text color right
                autosave_ask_before_unload: true, // let the user know that if he tries to close the browser and the content hasn't been saved yet, it could be lost. Sometimes it doesn't work but rarely.
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
                        --purple: #6b41bf;
                        --purple-light: #9b64df;
                        --purple-hover: #5326a8;
                        --purple-active: #3e247d;
                        --text-color: white;
                        --text-color-secondary: black;
                        --editor-bg-color: #1f1f1f;
                    }

                    [light-theme="true"] {

                        --primary-bg-color: #efefef;
                        --secondary-bg-color: #e2e2e2;
                        --secondary-bg-color-hover: #ffffff8f;
                        --tertiary-bg-color: #1b1b1b;
                        --tertiary-bg-color-hover: #232323;
                        --tertiary-bg-color-active: #3e3d3d;
                        --quaternary-bg-color: #c0c0c0;
                        --text-color: black;
                        --text-color-secondary: white;
                        --purple-active: #3e247d;

                        --editor-bg-color: white;
                    }
                   /* Changes the color of the placeholder */
                    .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                    color: var(--tertiary-bg-color-active);
                    }

                    body {
                        font-family: Helvetica, Arial, sans-serif;
                        font-size: 12pt;
                        background-color: var(--editor-bg-color);
                        color: var(--text-color);
                    }

                    /* inline-code */
                    code{
                        color: white;
                        background-color:var(--purple);

                    }

                    /* change the color of inline-code when selected */
                    .mce-content-body [data-mce-selected=inline-boundary]{

                        background-color:var(--purple-light);


                    }

                    /* width */
                    ::-webkit-scrollbar {
                        width: 15px;
                    }

                    /* Track */
                    ::-webkit-scrollbar-track {
                        background: var(--primary-bg-color);
                    }

                    /* Handle */
                    ::-webkit-scrollbar-thumb {
                        background-color: var(--secondary-bg-color);
                    }

                    /* Handle on hover */
                    ::-webkit-scrollbar-thumb:hover {
                        background-color: #555;
                    }

                /* changes the background-color of the code sample */
                :not(pre)>code[class*=language-], pre[class*=language-]{

                    background-color:var(--secondary-bg-color);

                }

                /* makes sure that in light mode, the code-sample doesn't put a white background-color to certain elements (like ":", "." or strings etc.) */
                .language-css .token.string, .style .token.string, .token.entity, .token.operator, .token.url{

                    background-color:transparent;

                }

                /* changes the outline of the accordion and other elements */
                .mce-content-body audio[data-mce-selected],
                .mce-content-body details[data-mce-selected],
                .mce-content-body embed[data-mce-selected],
                .mce-content-body img[data-mce-selected],
                .mce-content-body object[data-mce-selected],
                .mce-content-body table[data-mce-selected],
                .mce-content-body video[data-mce-selected] {
                    outline: 3px solid var(--purple);
                }

                .mce-content-body [contentEditable=false][data-mce-selected] {
                    outline: 3px solid var(--purple);
                }

                .mce-content-body div.mce-resizehandle {
                    background-color: var(--purple);
                    border-color: var(--purple);
                }

                .mce-content-body div.mce-resizehandle:hover {
                    background-color: var(--purple);
                    border-color: var(--purple);
                }
                
                `,
                codesample_global_prismjs: true, //uses a prism.js and prism.css file to highlight more languages 
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
                quickbars_link_toolbar: false,
                quickbars_selection_toolbar: 'bold italic forecolor backcolor' // inline toolbar shown on selection
            } }
        />

    );
};

export default EditorMCE;