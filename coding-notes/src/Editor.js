
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from "@editorjs/list";


const Editor = () => {
    //#region EDITOR.JS

    const editor = new EditorJS({
        /** 
         * Id of Element that should contain the Editor 
         */
        holder: 'editorjs',

        /** 
         * Available Tools list. 
         * Pass Tool's class or Settings object for each Tool you want to use 
         */
        tools: {
            header: Header,
            list: {
                class: List,
                inlineToolbar: true,
                config: {
                    defaultStyle: 'unordered'
                }
            }
        },
    });



    //#endregion

    return ( 

        <div className="editor" id="editorjs">


        </div>

     );
}
 
export default Editor;