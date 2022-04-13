const tbody = document.getElementById('table-body')
const getSignedURL = event => {
    if (event.target.id) {
        fetch('/signedURL/' + event.target.id)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.open(data.data, '_blank')
                } else {
                    alert('Some things not right!')
                }
            })
            .catch(e => {
                alert('Some things not right!')
            })
    } else {
        alert('Some things not right!')
    }
}
let files = []
const fetchFiles = () => {
    document.getElementById('loading').style.display = 'block'
    document.getElementById('no-file').style.display = 'none'
    tbody.innerHTML = ''
    fetch('/files')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                files = data.data
                if (files && files.length > 0) {
                    tbody.innerHTML = ''
                    files.forEach((file, index) => {
                        var row = document.createElement('tr')
                        row.setAttribute('id', toString(index))
                        var col1 = document.createElement('td')
                        col1.classList.add('space-1')
                        var col2 = document.createElement('td')
                        col2.classList.add('space-3')
                        col2.classList.add('link')
                        var col3 = document.createElement('td')
                        col3.classList.add('space-2')
                        col1.innerText = index + 1
                        col2.innerText = file.fileName
                        col2.setAttribute('id', file.fileName)
                        col3.innerText = new Date(file.lastModified).toLocaleDateString() + ' ' + new Date(file.lastModified).toLocaleTimeString()
                        col2.addEventListener('click', getSignedURL)
                        row.appendChild(col1)
                        row.appendChild(col2)
                        row.appendChild(col3)
                        tbody.appendChild(row)
                    })
                    document.getElementById('loading').style.display = 'none'
                } else {
                    document.getElementById('loading').style.display = 'none'
                    document.getElementById('no-file').style.display = 'block'
                }
            }
        })
        .catch(e => {
            document.getElementById('loading').style.display = 'none'
            document.getElementById('no-file').style.display = 'block'
        })
}

window.addEventListener('load', fetchFiles)