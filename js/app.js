document.addEventListener("DOMContentLoaded", function() {
    tinymce.init({
        selector: '#editor',
        setup: function (editor) {
            editor.on('init', function () {
                fetchContent();
            });
        }
    });
});

function fetchContent() {
    // Simulating fetching data from a JSON file
    fetch('../json/example.json')
        .then(response => response.json())
        .then(response => {
            console.log(response["0626512"]["instructor-name"]);
            tinymce.activeEditor.setContent(JSON.stringify(response));
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function saveContent() {
    const content = tinymce.activeEditor.getContent();

    // Simulating pushing data to a server
    fetch('../json/example.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content })
    })
        .then(response => {
            if (response.ok) {
                console.log('Content saved successfully!');
            } else {
                console.error('Error:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}