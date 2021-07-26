import { boot } from 'quasar/wrappers';
import CKEditor from '@ckeditor/ckeditor5-vue';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
    app.use(CKEditor);
});
