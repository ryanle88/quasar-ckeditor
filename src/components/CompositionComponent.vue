<template>
    <div>
        <ckeditor
            :editor="editor"
            @ready="onReady"
            v-model="editorData"
            :config="editorConfig"
        ></ckeditor>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    PropType,
    computed,
    ref,
    toRef,
    Ref,
    reactive
} from 'vue';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

export default defineComponent({
    name: 'CompositionComponent',
    setup(props) {
        let editor = DecoupledEditor;
        let editorData = ref('<p>Content of the editor.</p>');
        let editorConfig = {
            // plugins: [SimpleUploadAdapter],
            toolbar: {},
            simpleUpload: {
                // The URL that the images are uploaded to.
                uploadUrl:
                    'https://darwin-file-upload.evolvesecurity.com/api/file/upload',

                // Enable the XMLHttpRequest.withCredentials property.
                withCredentials: true,

                // Headers sent along with the XMLHttpRequest to the upload server.
                headers: {
                    'X-CSRF-TOKEN': 'CSRF-Token',
                    Authorization: `Bearer`
                }
            }
        };

        const onReady = ed => {
            // Insert the toolbar before the editable area.
            ed.ui
                .getEditableElement()
                .parentElement.insertBefore(
                    ed.ui.view.toolbar.element,
                    ed.ui.getEditableElement()
                );
        };

        return {
            editor,
            editorData,
            editorConfig,
            onReady
        };
    }
});
</script>
