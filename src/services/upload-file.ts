export const handleFileSelect = (evt: any) => {
    const files = evt?.target?.files;  // FileList object

    // use the 1st file from the list
    const f = files[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e: any) {
            if (theFile) {
    
            }
            //  jQuery('#ms_word_filtered_html').val(e.target.result);
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);

}
