
import EditorJS from '@editorjs/editorjs';
import InlineCode from '@editorjs/inline-code';
import NestedList from '@editorjs/nested-list';
import LinkTool from '@editorjs/link';
import Table from '@editorjs/table';
import CodeBox from '@bomdi/codebox';
import ToggleBlock from 'editorjs-toggle-block';
import Checklist from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import Title from "title-editorjs";
import Quote from '@editorjs/quote';
import Warning from '@editorjs/warning';
import Alert from 'editorjs-alert';
import { URL } from "./utils";
import ChangeCase from 'editorjs-change-case';
import useSWR from "swr";
import TextVariantTune from '@editorjs/text-variant-tune';
import { patchAjaxCall } from "./utils";
import React, { useEffect, useRef } from "react";
import Tooltip from 'editorjs-tooltip';
import DragDrop from 'editorjs-drag-drop';
// we use react memo cause when i wirte in the title, the editor gets re-rendered. React.memo makes sure this doesn't happen
const Editor = React.memo(({currentNote}) => {

    const Paragraph = require('editorjs-paragraph-with-alignment');
    const Header = require("editorjs-header-with-alignment");
    const ColorPlugin = require('editorjs-text-color-plugin');
    
    // get the current note title

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading, error } = useSWR(URL + `?retrieve=single&note=${currentNote}`, fetcher);
    


    
    // we put the editor in the useEffect so that we can unmount it when the note is switched
    //#region EDITOR.JS
    useEffect(()=>{
        console.log(note.content);

        const editor = new EditorJS({
            /** 
             * Id of Element that should contain the Editor 
             */
            holder: 'editorjs',
            data: note.content ? JSON.parse(note.content) : {},
            /** 
             * Available Tools list. 
             * Pass Tool's class or Settings object for each Tool you want to use 
            */
           tools: {
               header: Header,
               textVariant: TextVariantTune,
                Marker: {
                    class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
                    config: {
                        defaultColor: '#FFBF00',
                        type: 'marker',
                        icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
                    }
                }, changeCase: {
                    class: ChangeCase,
                    config: {
                        showLocaleOption: true, // enable locale case options
                        locale: 'tr' // or ['tr', 'TR', 'tr-TR']
                    }
                },
                title: Title,
                warning: Warning,
                quote: Quote,
                alert: Alert,
               tooltip: {
                   class: Tooltip,
                   config: {
                       location: 'left',
                       underline: true,
                    //    placeholder: 'Enter a tooltip',
                       highlightColor: '#FFEFD5',
                       backgroundColor: '#154360',
                       textColor: '#FDFEFE',
                       holder: 'editorjs',
                   }
               },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                    tunes:["textVariant"]
                },
                list: {
                    class: NestedList,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    },
                },
                inlineCode: {
                    class: InlineCode,
                    shortcut: 'CMD+SHIFT+M',
                },
                delimiter: Delimiter,
                codeBox: {
                    class: CodeBox,
                    config: {
                        useDefaultTheme: 'dark' // Optional. This also determines the background color of the language select drop-down
                    }
                },
                toggle: {
                    class: ToggleBlock,
                    inlineToolbar: true,
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                table: Table
                // linkTool: {
                //     class: LinkTool,
                //     config: {
                //         endpoint: , // Your backend endpoint for url data fetching,
                //     }
                // }
            },

            onChange: (api, e) => {

                editor.save().then((outputData) => {
                    
                    // outputData.blocks.forEach((block)=>block.data.text = block.data.text.replace(/"/g,"'"));
                    
                    console.log('Article data: ', outputData);
                    patchAjaxCall({ ...outputData, noteID: currentNote });
                }).catch((error) => {
                    console.log('Saving failed: ', error);
                });



            },

            onReady: ()=>{


                new DragDrop(editor);
            }

        });


        return ()=>{
            if (editor.destroy) {
                
                editor.destroy();
            }

        }
        
    });

    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>);
    



    //#endregion

    return ( 

        <div className="editor" id="editorjs">


        </div>
     );
});
 
export default Editor;